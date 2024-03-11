import React, { useState, useEffect } from "react";

//react-router-dom
import { NavLink } from "react-router-dom";

//Alert
import Swal from "sweetalert2";

import { setToast } from "../Util/Toast";
import { warning, alert, permissionError } from "../Util/Alert";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getContactUs, deleteContact } from "../store/Contact/contact.action";
import {
  OPEN_CONTACT_DIALOG,
  CLOSE_CONTACT_US_TOAST,
} from "../store/Contact/contact.type";

//component
import ContactDialog from "../Component/Dialog/ContactDialog";
import { covertURl } from "../Util/AwsFunction";

const ContactUs = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  //useEffect for Get Data
  useEffect(() => {
    props.getContactUs(); // eslint-disable-next-line
  }, []);

  const { contact, toast, toastData, actionFor } = useSelector(
    (state) => state.contact
  );
  const [showURLs, setShowURLs] = useState([]);

  //Set Data after Getting
  useEffect(() => {
    setData(contact);
  }, [contact])


    useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data.map(async (item) => {
            const fileNameWithExtension = item?.image.split('/').pop();
            const { imageURL } = await covertURl('contactUs/' + fileNameWithExtension);
            return imageURL;
        })
      );
      setShowURLs(urls);
    };
    fetchData();
  }, [data]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_CONTACT_DIALOG });
  };

  //Update Dialog
  const handleEdit = (data) => {
    dispatch({ type: OPEN_CONTACT_DIALOG, payload: data });
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_CONTACT_US_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteContact(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="col-sm-6 mt-4">
        <div class="row">
          <div class="col-md-12">
            <div
              class="iq-card contact-card card-bg pointer-cursor"
              style={{ borderRadius: "20px" }}
            >
              <div class="iq-card-body">
                <div className="row d-flex align-items-center ">
                  <div className="col-6">
                    <h5 className="faq_title">Contact Us</h5>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn dark-icon btn-primary"
                      data-bs-toggle="modal"
                      id="create-btn"
                      data-bs-target="#showModal"
                      onClick={handleOpen}
                    >
                      <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
                    </button>
                  </div>
                </div>
                <div className="help-center-scroll m-2">
                  {data.length > 0
                    ? data.map((data, index) => {
                        return (
                          <>
                            <div className="iq-email-listbox">
                              <div className="tab-content">
                                <div
                                  className="tab-pane fade show active"
                                  id="mail-inbox"
                                  role="tabpanel"
                                >
                                  <ol className="iq-email-sender-list" >
                                    <li>
                                      <div className="d-flex align-items-center" style={{paddingTop:"25px"}}>
                                        <div className="iq-email-sender-info">
                                          <img
                                            className="rounded-circle img-fluid avatar-40"
                                            src={showURLs[index]}
                                            alt="profile"
                                          />

                                          <a
                                            href="javascript: void(0);"
                                            className="iq-email-title"
                                          >
                                            {data?.name}
                                          </a>
                                        </div>

                                        <div class="iq-email-content">
                                          <a
                                            href="javascript: void(0);"
                                            class="iq-email-subject"
                                          >
                                            {data?.link}
                                          </a>
                                        </div>
                                        <ul class="iq-social-media">
                                          <li>
                                            <button
                                              type="button"
                                              className="btn iq-pf-primary btn-sm mr-2"
                                              onClick={() => handleEdit(data)}
                                            >
                                              <i
                                                className="ri-pencil-fill"
                                                style={{ fontSize: "19px" }}
                                              />
                                            </button>
                                          </li>
                                          <li>
                                            <button
                                              type="button"
                                              className="btn iq-pf-primary btn-sm mr-2"
                                              onClick={() =>
                                                handleDelete(data._id)
                                              }
                                            >
                                              <i
                                                className="ri-delete-bin-6-line"
                                                style={{ fontSize: "19px" }}
                                              />
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>
                                  </ol>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    : ""}
                </div>
                <ContactDialog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getContactUs, deleteContact })(ContactUs);
