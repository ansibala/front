import React, { useState, useEffect } from "react";

//Alert
import Swal from "sweetalert2";

//mui
import InboxIcon from "@material-ui/icons/Inbox";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//alert

import { setToast } from "../../Util/Toast";
import { warning, alert } from "../../Util/Alert";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@material-ui/core";

//action
import {
  CLOSE_GENRE_TOAST,
  OPEN_GENRE_DIALOG,
} from "../../store/Genre/genre.type";
import { getGenre, deleteGenre } from "../../store/Genre/genre.action";

import logo from "../assets/images/movie.png";

//component
import GenreDialog from "../Dialog/GenreDialog";
import { permissionError } from "../../Util/Alert";
import Search from "../assets/images/search.png" 


const Genre = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  //useEffect for Get Data
  useEffect(() => {
    props.getGenre(); // eslint-disable-next-line
  }, []);

  const { genre, toast, toastData, actionFor } = useSelector(
    (state) => state.genre
  );

  //Set Data after Getting
  useEffect(() => {
    setData(genre);
  }, [genre]);

  //Open Dialog
  const handleOpen = () => {
    dispatch({ type: OPEN_GENRE_DIALOG });
  };

  //Update Dialog
  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_GENRE_DIALOG, payload: data });
  };
  // delete sweetAlert
  const openDeleteDialog = (genreId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteGenre(genreId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_GENRE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = genre.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(genre);
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
      

      <div id="content-page" className="content-page">
        <div className="container-fluid pl-3">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title mt-4 ml-2">
                <h4 class="card-title">Genre</h4>
              </div>
              <div className="iq-card mb-5">
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
                  <div className="text-center sm">
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
                      <thead class="text-nowrap">
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

                                      <td className="pr-3  text-start">
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
          <GenreDialog />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getGenre, deleteGenre })(Genre);
