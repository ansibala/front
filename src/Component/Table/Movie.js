import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import noImage from "../assets/images/noImage.png";

//react-router-dom
import { useHistory } from "react-router-dom";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getMovie,
  deleteMovie,
  newRelease,
} from "../../store/Movie/movie.action";
import {
  CLOSE_MOVIE_TOAST,
  OPEN_MOVIE_DIALOG,
  MOVIE_DETAILS,
} from "../../store/Movie/movie.type";

//mui
import Switch from "@material-ui/core/Switch";

//Alert
import { setToast } from "../../Util/Toast";
import { warning, alert } from "../../Util/Alert";
import Swal from "sweetalert2";
import { permissionError } from "../../Util/Alert";

//html Parser
import parse from "html-react-parser";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core";
import { baseURL } from "../../Util/ServerPath";
import $ from "jquery";
import Pagination from "../../Pages/Pagination";
import { covertURl } from "../../Util/AwsFunction";
import Search from "../assets/images/search.png";
//useStyle
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
    background: "#221f3a",
    color: "#fff",
  },
}));

const Movie = (props) => {
  const { loader } = useSelector((state) => state.loader);
  let showURL;

  const classes = useStyles1();
  //Define History
  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showURLs, setShowURLs] = useState([]);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const { movie, toast, toastData, actionFor, totalMovie } = useSelector(
    (state) => state.movie
  );

  useEffect(() => {
    props.getMovie(activePage, rowsPerPage); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    props.getMovie(activePage, rowsPerPage); // eslint-disable-next-line
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data.map(async (item) => {
          if (item.IMDBid == null && item.TmdbMovieId == null) {
            const fileNameWithExtension = item.thumbnail.split("/").pop();
            const { imageURL } = await covertURl(
              "movieThumbnail/" + fileNameWithExtension
            );

            return imageURL;
          } else {
            return item.thumbnail;
          }
        })
      );
      setShowURLs(urls);
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    setData(movie);
  }, [movie]);

  //update button
  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateMovieData1", JSON.stringify(data));
    history.push({ pathname: "/admin/movie/movie_form", state: data });
  };

  //pagination
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const insertOpen = () => {
    localStorage.removeItem("updateMovieData");
    history.push("/admin/movie/movie_form");
  };

  //Movie Details
  const MovieDetails = (data) => {
    // localStorage.setItem("movieDetails", JSON.stringify(data));
    dispatch({ type: MOVIE_DETAILS, payload: data });
    history.push({
      pathname: "/admin/movie/movie_details",
      state: data,
    });
  };

  //new release switch
  const handleNewRelease = (movieId) => {
    if (!hasPermission) return permissionError();
    props.newRelease(movieId);
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = movie.filter((data) => {
        return data?.title?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(movie);
    }
  };

  // toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_MOVIE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  useEffect(() => {
    localStorage.clear("updateMovieData1");
  }, []);

  //Delete Movie
  const deleteOpen = (movieId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteMovie(movieId);
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

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid pl-3">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title mt-4 ml-2">
                <h4 class="card-title">Movie</h4>
              </div>
              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between p-0 ml-3">
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
                    <form class="mr-3 position-relative">
                      <div
                        class="form-group mb-0 d-flex mr-3 position-relative"
                      
                      >
                        {" "}
                        <img
                          src={Search}
                          width="23px"
                          height="23px"
                          style={{
                            filter: "invert(1)",
                            right: "10px",
                            position: "absolute",
                            top: "7px",
                          }}
                        />
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
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th className="tableAlign">Image</th>
                          <th className="tableAlign">Title</th>
                          <th className="tableAlign">Description</th>
                          <th className="tableAlign">Type</th>
                          <th className="tableAlign">New Release</th>
                          <th className="tableAlign">View Details</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.length > 0
                          ? data
                              // .slice(
                              //   activePage * rowsPerPage,
                              //   activePage * rowsPerPage + rowsPerPage
                              // )
                              .map((data, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className="pr-3 tableAlign">
                                        {index + 1}
                                      </td>
                                      <td className="pr-3">
                                        <img
                                          height="100px"
                                          width="80px"
                                          className="img-fluid"
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                            border:
                                              "0.5px solid rgba(255, 255, 255, 0.20)",
                                            borderRadius: 10,
                                            float: "left",
                                            objectFit: "cover",
                                          }}
                                          src={showURLs[index]}
                                          alt=""
                                        />
                                      </td>

                                      <td className="pr-3 text-start text-capitalize">
                                        {data?.title}
                                      </td>
                                      <td className="pr-3 description-text">
                                        {parse(
                                          `${
                                            data?.description?.length > 250
                                              ? data?.description.substr(
                                                  0,
                                                  250
                                                ) + "..."
                                              : data?.description
                                          }`
                                        )}
                                      </td>

                                      <td className="pr-3 tableAlign">
                                        {data?.type === "Premium" ? (
                                          <div class="badge badge-pill badge-danger">
                                            {data?.type}
                                          </div>
                                        ) : (
                                          <div class="badge badge-pill badge-info">
                                            {data?.type}
                                          </div>
                                        )}
                                      </td>

                                      <td className="pr-3 tableAlign">
                                        <Switch
                                          checked={data?.isNewRelease}
                                          onChange={(e) =>
                                            handleNewRelease(data?._id)
                                          }
                                          color="primary"
                                          name="checkedB"
                                          inputProps={{
                                            "aria-label": "primary checkbox",
                                          }}
                                        />
                                      </td>

                                      <td className="pr-3 tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() => MovieDetails(data._id)}
                                        >
                                          <i
                                            class="ri-information-line"
                                            style={{ fontSize: "19px" }}
                                          ></i>
                                        </button>
                                      </td>
                                      <td className="pr-3 tableAlign">
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
                                      <td className="pr-3 tableAlign">
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

                  <Pagination
                    activePage={activePage}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalMovie}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getMovie,
  deleteMovie,
  newRelease,
})(Movie);
