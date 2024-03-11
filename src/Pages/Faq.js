import React, { useState, useEffect } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getFaQ, deleteFaQ } from "../store/Faq/faq.action";
import { OPEN_FAQ_DIALOG, CLOSE_FAQ_TOAST } from "../store/Faq/faq.type";

//component
import FaqDialog from "../Component/Dialog/FaqDialog";
import ContactUs from "./ContactUs";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../Util/Toast";
import { warning } from "../Util/Alert";
import { permissionError } from "../Util/Alert";

const Faq = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  //useEffect for Get Data
  useEffect(() => {
    props.getFaQ(); // eslint-disable-next-line
  }, []);

  const { FaQ, toast, toastData, actionFor } = useSelector(
    (state) => state.FaQ
  );

  //Set Data after Getting
  useEffect(() => {
    setData(FaQ);
  }, [FaQ]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_FAQ_DIALOG });
  };

  //Update Dialog
  const handleEdit = (data) => {
    dispatch({ type: OPEN_FAQ_DIALOG, payload: data });
  };

  // delete sweetAlert
  const handleDelete = (faqId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteFaQ(faqId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_FAQ_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" class="content-page">
        <div class="container-fluid">
          <div class="row">
            <div className="col-lg-12 mt-1">
              <div className="iq-header-title mt-4">

              <h4>Help Center</h4>
              </div>
            </div>

            <div className="col-sm-6 mt-4">
              <div className="iq-card faq_card">
                <div className="row d-flex align-items-center mt-2">
                  <div className="col-6">
                    <h5 className="faq_title"> FAQ</h5>
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

               
                <div className="row help-center-scroll">
                  {data.length > 0
                    ? data.map((data, index) => {
                        return (
                          <>
                            <div className="col-md-12 mt-4">
                              <div class="iq-accordion career-style faq-style">
                                <div class="card iq-accordion-block accordion ">
                                  <div class="active-faq clearfix">
                                    <div class="container m-0">
                                      <div class="row">
                                        <div class="col-sm-12">
                                          <a class="accordion-title">
                                            <span> {data?.question} </span>{" "}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="accordion-details">
                                    <p class="mb-0 " style={{color:"#fdfdfd"}}>{data?.answer} </p>
                                  </div>
                                  <div class="contact-card-buttons d-flex justify-content-end pr-2 pb-1">
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

                                    <button
                                      type="button"
                                      className="btn iq-pf-primary btn-sm mr-2"
                                      onClick={() => handleDelete(data._id)}
                                    >
                                      <i
                                        class="ri-delete-bin-6-line"
                                        style={{ fontSize: "19px" }}
                                      ></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    : ""}
                </div>
              </div>
            </div>
            <FaqDialog />

            <ContactUs />
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFaQ, deleteFaQ })(Faq);
