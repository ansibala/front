import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import $ from "jquery";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//mui
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import Search from "../assets/images/search.png" 


//Alert
import Swal from "sweetalert2";
import { setToast } from "../../Util/Toast";
import { warning, alert } from "../../Util/Alert";
import { permissionError } from "../../Util/Alert";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

//action
import { getMovie } from "../../store/Movie/movie.action";
import { getSeries } from "../../store/TvSeries/tvSeries.action";
import { MOVIE_DETAILS } from "../../store/Movie/movie.type";
import { getTrailer, deleteTrailer } from "../../store/Trailer/trailer.action";
//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";
import {
  OPEN_TRAILER_DIALOG,
  CLOSE_TRAILER_TOAST,
} from "../../store/Trailer/trailer.type";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@material-ui/core";
import { covertURl } from "../../Util/AwsFunction";

const Trailer = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const dispatch = useDispatch();

  const history = useHistory();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showURLs, setShowURLs] = useState([]);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const dialogData = JSON.parse(localStorage.getItem("trailerId"));
  const movieTitle = localStorage.getItem("movieTitle");

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data.map(async (item) => {
          if (dialogData.IMDBid == null && dialogData.TmdbMovieId == null) {
            const fileNameWithExtension = item.trailerImage.split("/").pop();
            const { imageURL } = await covertURl(
              "trailerImage/" + fileNameWithExtension
            );

            return imageURL;
          } else {
            // return item.thumbnail;
            return item.trailerImage ==
              "https://www.themoviedb.org/t/p/originalnull"
              ? placeholderImage
              : item.trailerImage;
          }
        })
      );
      setShowURLs(urls);
    };

    fetchData();
  }, [data]);

  //useEffect for Trailer
  useEffect(() => {
    props.getTrailer(dialogData._id);
  }, []);

  //Get Trailer
  const { trailer, toast, toastData, actionFor } = useSelector(
    (state) => state.trailer
  );

  useEffect(() => {
    setData(trailer);
  }, [trailer]);

  //Insert Dialog OPen
  const insertOpen = (data) => {
    localStorage.removeItem("updateTrailerData");
    history.push("/admin/trailer/trailer_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    dispatch({ type: OPEN_TRAILER_DIALOG, payload: data });
    localStorage.setItem("updateTrailerData", JSON.stringify(data));

    history.push({ pathname: "/admin/trailer/trailer_form", state: data });
  };

  const deleteOpen = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteTrailer(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_TRAILER_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = trailer.filter((data) => {
        return (
          data?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.movieTitle?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(trailer);
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                <div class="iq-card">
                  <div class="iq-card-header d-flex justify-content-between">
                    <div class="iq-header-title d-flex align-items-center">
                      <MovieFilterIcon
                        className="mr-2"
                        style={{ fontSize: "30px", color: "#fff" }}
                      />
                      <h4 class="card-title my-0">{movieTitle} : Trailer </h4>
                    </div>
                  </div>
                  <div class="iq-card-body">
                    <ul
                      class="nav nav-pills mb-2"
                      id="pills-tab"
                      role="tablist"
                      style={{ marginLeft: "21px" }}
                    >
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link"
                          id="pills-home-tab"
                          data-toggle="pill"
                          href="#pills-home"
                          to="/admin/movie/movie_form"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                        >
                          <EditIcon
                            className="mb-1"
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Edit
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link active"
                          id="pills-profile-tab"
                          data-toggle="pill"
                          href="#pills-profile"
                          to="/admin/movie/trailer"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          <i
                            className="ri-vidicon-line mr-1"
                            style={{ fontSize: "18px" }}
                          />
                          Trailer
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link"
                          id="pills-contact-tab"
                          data-toggle="pill"
                          href="#pills-contact"
                          to="/admin/movie/cast"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          <RecentActorsIcon
                            className="mr-1"
                            style={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Cast
                        </NavLink>
                      </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent-2">
                      <div
                        class="tab-pane fade show active"
                        id="pills-home"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      ></div>
                      <div
                        class="tab-pane fade"
                        id="pills-contact"
                        role="tabpanel"
                        aria-labelledby="pills-contact-tab"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between">
                  <button
                    type="button"
                    class="btn dark-icon btn-primary"
                    data-bs-toggle="modal"
                    id="create-btn"
                    data-bs-target="#showModal"
                    onClick={insertOpen}
                  >
                    <i class="ri-add-line align-bottom me-1 fs-6"></i> Add
                  </button>

                  <div className="text-center sm">
                    <form class="position-relative">
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
                          <th>Image</th>
                          <th>Movie </th>
                          <th>Type</th>
                          <th>Created Date</th>
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
                                    <tr className="text-center ">
                                      <td>{index + 1}</td>
                                      <td>
                                        <img
                                          src={showURLs[index]}
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                            border:
                                              " 0.5px solid rgb(88, 106, 110)",
                                            borderRadius: "10px",

                                            objectFit: "cover",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                      <td className="text-capitalize">
                                        {data?.movieTitle}
                                      </td>
                                      <td>{data?.type}</td>
                                      <td>
                                        {dayjs(data?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => updateOpen(data)}
                                        >
                                          <i
                                            className="ri-pencil-fill"
                                            style={{ fontSize: "19px" }}
                                          />
                                        </button>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => deleteOpen(data._id)}
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
                            data.length === 0 && (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  No data Found!!
                                </td>
                              </tr>
                            )}
                      </tbody>
                    </table>
                  </div>
                  <br />
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      50,
                      100,
                      { label: "All", value: data?.length },
                    ]}
                    component="div"
                    count={data?.length}
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
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default connect(null, {
  getTrailer,
  deleteTrailer,
  getMovie,
  getSeries,
  // getCourseLecture,
})(Trailer);
