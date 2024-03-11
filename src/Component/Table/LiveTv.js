import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
//Pagination
import TablePaginationActions from "./Pagination";
import { Switch, TablePagination } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getAdminCreateLiveTv,
  deleteLiveChannel,
} from "../../store/LiveTv/liveTv.action";

//Alert
import Swal from "sweetalert2";

//Alert
import { permissionError } from "../../Util/Alert";

import { useHistory } from "react-router-dom";
import { OPEN_LIVE_TV_DIALOGUE } from "../../store/LiveTv/liveTv.type";
import LiveTvEditDialogue from "../Dialog/LiveTvEditDialogue";
import $ from "jquery";
import noImage from "../../Component/assets/images/noImage.png";

import { getSetting, handleSwitch } from "../../store/Setting/setting.action";
import { warning } from "../../Util/Alert";

const LiveTv = (props) => {
  const { loader } = useSelector((state) => state.loader);



  const { adminCreateLiveTv } = useSelector((state) => state.liveTv);

  const { setting } = useSelector((state) => state.setting);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countries, setCountries] = useState("");
  const [isIptvAPI, setIsIptvAPI] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    setIsIptvAPI(setting.isIptvAPI);
    props.getSetting();
    props.getAdminCreateLiveTv();
    // props.getLiveTvData("india");
  }, []);

  useEffect(() => {
    setIsIptvAPI(setting.isIptvAPI);
  }, [setting]);

  useEffect(() => {
    setData(adminCreateLiveTv);
  }, [adminCreateLiveTv]);

  //pagination
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const dispatch = useDispatch();
  const insertManualLiveTv = (data) => {

    dispatch({ type: OPEN_LIVE_TV_DIALOGUE });
  };

  const history = useHistory();
  const insertOpen = () => {
    history.push("live_tv/createLiveTv");
  };



  const handleMouseOver = (videoId) => {
    setIsHovered(videoId);
  };

  const handleMouseOut = () => {
    setIsHovered(null);
  };

  const deleteOpen = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteLiveChannel(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });

  const handleSwitch_ = (type, value) => {
    if (!hasPermission) return permissionError();
    props.handleSwitch(setting?._id, type, value);
  };

  const handelEditManual = (data) => {
    dispatch({ type: OPEN_LIVE_TV_DIALOGUE, payload: data });
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <div className="iq-header-title mt-4">

              <h4 class="card-title ml-0">Live TV</h4>
              </div>
            </div>
          </div>
          <div class="row layout-top-spacing  align-items-center">
            <div className="col-xs-12 col-md-6 col-lg-8 col-6 float-left">
              <div className="d-flex">
                <button
                  type="button"
                  class="btn dark-icon btn-primary "
                  style={{ marginRight: "10px" }}
                  data-bs-toggle="modal"
                  id="create-btn"
                  data-bs-target="#showModal"
                  onClick={insertOpen}
                >
                  <i class="ri-add-line align-bottom me-1 fs-6"></i> Fetch
                </button>
                <button
                  type="button"
                  class="btn dark-icon btn-primary "
                  style={{ marginRight: "10px" }}
                  data-bs-toggle="modal"
                  id="create-btn"
                  data-bs-target="#showModal"
                  onClick={insertManualLiveTv}
                >
                  <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
                </button>
              </div>
            </div>
            <div className="col-xs-12  col-md-6 col-lg-4 col-6  mb-3 mt-lg-0 mt-xl-0 filtered-list-search d-flex justify-content-end">
              <div className="iq-card-header d-flex flex-row-reverse">
                <div className=" d-flex justify-content-between align-items-center">
                  <h5 className="mt-3">Show In App</h5>
                  <label class="switch mt-3">
                    <Switch
                      onChange={() => handleSwitch_("IptvAPI", isIptvAPI)}
                      checked={isIptvAPI}
                      color="primary"
                      name="checkedB"
                      inputProps={{
                        "aria-label": "primary checkbox",
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="row layout-top-spacing">
            {data.length > 0
              ? data.map((data, index) => {
                  return (
                    <>
                      <div class="col-md-6 col-lg-4 col-xl-4  p-0" key={index}>
                        <div
                          class="iq-card contact-card card-bg pointer-cursor m-2"
                          style={{
                            border: "2px solid rgba(255,255,255,0.20)",
                            borderRadius: "17px",
                          }}
                        >
                          <div
                            key={index}
                            onMouseOver={() => handleMouseOver(data?._id)}
                            onMouseOut={handleMouseOut}
                            style={{
                              boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                              overflow: "hidden",
                              display: "block",
                              width: "calc(100% - 0px)",
                              borderTopLeftRadius:"16px",
                              borderTopRightRadius:"16px",
                            }}
                          >
                            <ReactPlayer
                              width="calc(100% - 0px)"
                              height="292px"
                              url={data?.streamURL}
                              playing={isHovered === data?._id ? true : false}
                              loop={true}
                              controls
                            />
                          </div>

                          <div
                            class="iq-card-body rowspan-2"
                            style={{ padding: "1px" }}
                          >
                            <div className="row ">
                              <div className="col">
                                <h4 className="m-2"> {data?.channelName}</h4>

                                <p
                                  className="text-white m-2 mt-3"
                                  style={{ fontSize: "17px" }}
                                >
                                  {data?.streamURL?.length > 30
                                    ? data?.streamURL.slice(0, 30) + "...."
                                    : data?.streamURL}
                                </p>
                                <div
                                  className="m-2 mt-2"
                                  style={{ fontSize: "15px", color: "#fff" }}
                                >
                                  {data?.country}
                                </div>
                              </div>
                            </div>
                            <hr
                              className="mb-0"
                              style={{
                                borderTop: "1px solid #ae9fbe63",
                              }}
                            />
                            <div
                              className="row d-flex justify-content-between py-3"
                              // style={{
                              //   borderTop: "2px solid #282947",
                              // }}
                            >
                              <div class="col-6 d-flex justify-content-center">
                                <button
                                  type="button"
                                  class="btn btn-primary badge badge-lg  m-1 d-inline-block"
                                  onClick={() => handelEditManual(data)}
                                  style={{ width: "80%", height: "38px" }}
                                >
                                  {/* <i
                                  className="ri-pencil-fill"
                                  style={{ fontSize: "20px" }}
                                /> */}
                                  <p className="mb-0" style={{fontSize:"20px"}}>Update</p>
                                </button>
                              </div>

                              <div class="col-6 d-flex justify-content-center">
                                <button
                                  type="button"
                                  class="btn badge badge-lg m-1 d-inline-block btn-pink"
                                  style={{
                                    padding: "7px 14px",
                                    color: "white",
                                    width: "80%",
                                    height: "38px",
                                  }}
                                  onClick={() => deleteOpen(data._id)}
                                  href
                                >
                                  {/* <i
                                  class="ri-delete-bin-6-line"
                                  style={{
                                    fontSize: "20px",
                                  }}
                                ></i> */}
                                  <p className="mb-0" style={{fontSize:"20px"}}>Delete</p>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              : loader === false &&
                data.length == 0 && (
                  <div className="ml-3 mt-1"> Nothing to show!!</div>
                )}
          </div>
        </div>
      </div>

      <LiveTvEditDialogue />
    </>
  );
};

export default connect(null, {
  getAdminCreateLiveTv,
  deleteLiveChannel,
  handleSwitch,
  getSetting,
})(LiveTv);
