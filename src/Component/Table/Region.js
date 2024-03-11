import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { Link } from "react-router-dom";
import Pagination from "../../Pages/Pagination";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@material-ui/core";

//Alert
import Swal from "sweetalert2";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//alert
// import dayjs from "dayjs";
import { setToast } from "../../Util/Toast";
import { warning, alert } from "../../Util/Alert";
import { permissionError } from "../../Util/Alert";
import Search from "../assets/images/search.png" 


//action
import {
  CLOSE_REGION_TOAST,
  OPEN_REGION_DIALOG,
} from "../../store/Region/region.type";
import { getRegion, deleteRegion } from "../../store/Region/region.action";

//component
import RegionDialog from "../Dialog/RegionDialog";

const Region = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const dispatch = useDispatch();

  //useEffect for Get Data
  useEffect(() => {
    props.getRegion(); // eslint-disable-next-line
  }, []);

  const { region, toast, toastData, actionFor } = useSelector(
    (state) => state.region
  );

  //Set Data after Getting
  useEffect(() => {
    setData(region);
  }, [region]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_REGION_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_REGION_DIALOG, payload: data });
  };
  // delete sweetAlert
  const openDeleteDialog = (regionId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteRegion(regionId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_REGION_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = region.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(region);
    }
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <>
      {/* <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4 class="card-title">Region</h4>
            </div>
          </div>
          <div class="row layout-top-spacing mt-2">
            <div className="col-xs-12 col-md-6 col-lg-8 col-6 float-left">
              <button
                class="btn dark-icon btn-primary"
                onClick={handleOpen}
                id="giftDialog"
              >
                <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
              </button>
              <RegionDialog />
            </div>
            <div className="col-xs-12  col-md-6 col-lg-4 col-6  mb-3 mt-lg-0 mt-xl-0 filtered-list-search d-flex justify-content-end">
              <form class="form-inline my-2 my-lg-0 justify-content-center">
                <div class="w-100">
                  <input
                    type="text"
                    class="form-control"
                   
                    id="input-search"
                    placeholder="Search..."
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>
          </div>
          <div class="row layout-top-spacing">
            {data.length > 0 ? (
              data?.map((data, index) => {
                return (
                  <>
                    <div class="col-md-3" key={index}>
                      <div class="iq-card contact-card card-bg pointer-cursor "  style={{overflowX:"hidden"}}>
                        <div class="iq-card-body mb-3 card-background">
                          <div class="d-flex contact-card-info justify-content-center mt-2 pt-2">
                            <h5 className="dialog__input__title mx-1">
                              <i
                                class="ri-earth-line"
                                style={{ fontSize: "84px" }}
                              ></i>
                            </h5>
                          </div>
                          <div class="d-flex contact-card-info my-2  px-2 justify-content-center">
                            <h5>
                              <span className="dialog__input__title text-capitalize three-dot">
                                {data?.name?.length && data?.name}
                              </span>
                            </h5>
                          </div>

                          <div className="col-12 text-left">
                            <div className="row">
                              <div className="col-6 text-right pr-0">
                                <div class="contact-card-buttons text-right">
                                  <a
                                    type="button"
                                    class="btn btn-primary badge badge-lg   m-1 d-inline-block"
                             
                                    onClick={() => updateDialogOpen(data)}
                                    href
                                  >
                                    <i
                                      className="ri-pencil-fill"
                                      style={{ fontSize: "14px" }}
                                    />
                                  </a>
                                </div>
                              </div>
                              <div className="col-6 pl-0">
                                <div class="contact-card-buttons text-left">
                                  <a
                                    type="button"
                                    class="btn badge badge-lg m-1 d-inline-block btn-pink"
                                  
                                    style={{
                                      padding: "7px 14px",
                                      color: "white",
                                    }}
                                    onClick={() => openDeleteDialog(data._id)}
                                    href
                                  >
                                    <i
                                      class="ri-delete-bin-6-line"
                                      style={{
                                        fontSize: "14px",
                                      }}
                                    ></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                            <div  style={{
                                borderTop: "1px solid #5fbbe726",
                              }}
                              className="row d-flex justify-content-between py-3"
                             
                            >
                              <div class="col-6 d-flex justify-content-center">
                                <button
                                  type="button"
                                  class="btn btn-primary badge badge-lg  m-1 d-inline-block"
                                  onClick={() => updateDialogOpen(data)}
                                  style={{ width: "80%", height: "38px" }}
                                >
                                  <i
                                  className="ri-pencil-fill"
                                  style={{ fontSize: "20px" }}
                                />
                                  <p className="mb-0" style={{fontSize:"16px"}}>Update</p>
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
                                  onClick={() => openDeleteDialog(data._id)}
                                  href
                                >
                                  <i
                                  class="ri-delete-bin-6-line"
                                  style={{
                                    fontSize: "20px",
                                  }}
                                ></i>
                                  <p className="mb-0" style={{fontSize:"16px"}}>Delete</p>
                                </button>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (  loader === false &&
              data.length === 0 && 
              <div className="ml-3 mt-1"> Nothing to show!!</div>
            )}
          </div>
        </div>
      </div> */}
     

     <div id="content-page" className="content-page">
        <div className="container-fluid pl-3">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title mt-4 ml-2">
                <h4 class="card-title">Region</h4>
              </div>
              <div className="iq-card mb-5 ">
                <div className="iq-card-header d-flex justify-content-between p-0 ml-3">
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
                  <div className="text-center sm position-relative" style={{right:"0"}}>
                    <form class="mr-3 position-relative">
                      <div class="form-group mb-0 d-flex mr-3 position-relative">
                      <img src={Search} width="23px" height="23px" style={{filter:"invert(1)" , right : "10px" , position:"absolute" , top :"7px" , }}/>
                        <input
                          type="search"
                          class="form-control"
                          id="input-search"
                          placeholder="Search"
                          aria-controls="user-list-table"
                          onChange={handleSearch}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="iq-card-body">
                  <div className="table-responsive">
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless mt-4"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead>
                        <tr className="text-center">
                          <th>ID</th>
                          <th>Name</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className="pr-3 tableAlign">
                                        {index + 1}
                                      </td>

                                      <td className="pr-3 ">
                                        {data?.name?.length && data?.name}
                                      </td>

                                      <td className="pr-3 tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => updateDialogOpen(data)}
                                        >
                                          <i
                                            className="ri-pencil-fill"
                                            style={{ fontSize: "19px" }}
                                          />
                                        </button>
                                      </td>
                                      <td className="pr-3 tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() =>
                                            openDeleteDialog(data._id)
                                          }
                                        >
                                          <i
                                            class="ri-delete-bin-6-line"
                                            style={{ fontSize: "19px" }}
                                          ></i>
                                        </button>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                          : loader === false &&
                            data?.length < 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>

                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      50,
                      100,
                      { label: "All", value: data.length },
                    ]}
                    component="div"
                    count={data.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </div>
              </div>
            </div>
          </div>
          <RegionDialog />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRegion, deleteRegion })(Region);
