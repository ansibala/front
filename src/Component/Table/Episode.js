import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//css
import noImage from "../assets/images/noImage.png";

//mui
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import TvIcon from "@material-ui/icons/Tv";

//Alert
import Swal from "sweetalert2";
import { setToast } from "../../Util/Toast";
import { warning } from "../../Util/Alert";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

//action
import {
  getEpisode,
  deleteEpisode,
  getAllEpisode,
  getMovieEpisode,
} from "../../store/Episode/episode.action";
import { getMovieCategory } from "../../store/Movie/movie.action";
import {
  OPEN_INSERT_DIALOG,
  CLOSE_EPISODE_TOAST,
} from "../../store/Episode/episode.type";
import { getSeason } from "../../store/Season/season.action";

//Pagination
import TablePaginationActions from "./Pagination";
import { TablePagination } from "@material-ui/core";
//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//component
import { permissionError } from "../../Util/Alert";
import { covertURl } from "../../Util/AwsFunction";

const Episode = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const history = useHistory();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [seasons, setSeasons] = useState("");
  const [showURLs, setShowURLs] = useState([""]);
  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const dialogData = localStorage.getItem("seriesTrailerId");
  const seriesTitle = localStorage.getItem("seriesTitle");
  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));

  //get movie
  const [movieData, setMovieData] = useState([]);

  const { movie } = useSelector((state) => state.movie);

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data.map(async (item) => {
           
          if (tmdbId.IMDBid == null && tmdbId.TmdbMovieId == null) {
            const fileNameWithExtension = item.image.split("/").pop();
            const { imageURL } = await covertURl(
              "episodeImage/" + fileNameWithExtension
            );
            return imageURL;
          } else {
            // return item.thumbnail;
            return item.image == "https://www.themoviedb.org/t/p/originalnull"
              ? placeholderImage
              : item.image;
          }
        })
      );
      setShowURLs(urls);
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  useEffect(() => {
    props.getMovieEpisode(dialogData, seasons ? seasons : "AllSeasonGet");
  }, [dialogData, seasons]);

  //Get Episode
  const { episode, toast, toastData, actionFor } = useSelector(
    (state) => state.episode
  );

  useEffect(() => {
    setData(episode);
  }, [episode]);

  //get tv series season from season
  const [seasonData, setSeasonData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    props.getSeason(dialogData);
  }, []);

  //call the season
  const { season } = useSelector((state) => state.season);
  useEffect(() => {
    setSeasonData(season ? season : "AllSeasonGet");
  }, [season]);

  const insertOpen = () => {
    localStorage.removeItem("updateEpisodeData");
    dispatch({ type: OPEN_INSERT_DIALOG });
    history.push("/admin/episode/episode_form");
  };

  //Update Dialog OPen
  const updateOpen = (data) => {
    dispatch({ type: OPEN_INSERT_DIALOG, payload: data });
    localStorage.setItem("updateEpisodeData", JSON.stringify(data));
    history.push("/admin/episode/episode_form");
  };

  const deleteOpen = (mongoId) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();
          props.deleteEpisode(mongoId);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };
  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = episode.filter((data) => {
        return (
          data?.movie?.title?.toUpperCase()?.indexOf(value) > -1 ||
          data?.name?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(episode);
    }
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_EPISODE_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="col-sm-12 col-lg-12  pr-0 pl-0 mt-3">
                <div class="iq-card mx-3">
                  <div class="iq-card-header d-flex justify-content-between">
                    <div class="iq-header-title d-flex align-items-center">
                      <MovieFilterIcon
                        className="mr-2"
                        style={{ fontSize: "30px"  ,color:"#ffff"}}
                      />

                      <h4 class="card-title my-0">
                        {seriesTitle}
                        (Episode)
                      </h4>
                    </div>
                  </div>
                  <div class="iq-card-body pl-0">
                    <ul
                      class="nav nav-pills mb-2"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link"
                          id="pills-home-tab"
                          data-toggle="pill"
                          href="#pills-home"
                          to="/admin/web_series/series_form"
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
                          class="nav-link"
                          id="pills-profile-tab"
                          data-toggle="pill"
                          href="#pills-profile"
                          to="/admin/web_series/trailer"
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
                          to="/admin/web_series/season"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          <DynamicFeedIcon
                            className="mr-1"
                            style={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Season
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link active"
                          id="pills-contact-tab"
                          data-toggle="pill"
                          href="#pills-contact"
                          to="/admin/episode"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          <TvIcon
                            className="mr-1"
                            style={{ fontSize: "20px", marginBottom: "2px" }}
                          />
                          Episode
                        </NavLink>
                      </li>
                      <li class="nav-item navCustom">
                        <NavLink
                          class="nav-link"
                          id="pills-contact-tab"
                          data-toggle="pill"
                          href="#pills-contact"
                          to="/admin/web_series/cast"
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

              <div className="row">
                <div className="col-lg-12">
                  <div className="card mb-2"  style={{backgroundColor:"#1c2c2d00"}}> 
                    <div className=" py-3 d-flex flex-row align-items-center justify-content-between">
                      <div className="card-body py-0 pl-2" >
                        <div className="">
                          <label className="styleForTitle">Select Season</label>
                          <select
                            name="session"
                            value={seasons}
                            className="form-control "
                            onChange={(e) => {
                              setSeasons(e.target.value);
                            }}
                          >
                            <option value="AllSeasonGet">
                              {!seasons ? "select season" : "All Season"}
                            </option>
                            {seasonData.map((data, key) => {
                              return (
                                <option
                                  value={data._id}
                                  key={key}
                                  selected={data._id}
                                >
                                  {data.seasonNumber}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between ml-3 ">
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

                  <div className="text-center sm ">
                    <form class="mr-3 position-relative">
                      <div class="form-group mb-0">
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
                <div className="iq-card-body pl-2 pr-4">
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
                          <th>Episode No.</th>
                          <th>Name</th>
                          <th>Web Series</th>
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
                                    <tr className="text-center">
                                      <td>{index + 1}</td>
                                      <td>
                                        <img
                                          src={showURLs[index]}
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                            border:
                                              "0.5px solid rgb(88 106 110)",
                                            borderRadius: 10,

                                            objectFit: "cover",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                      <td>{data?.episodeNumber}</td>
                                      <td>
                                        {data?.name.length > 10
                                          ? data?.name?.slice(0, 10) + "..."
                                          : data?.name}
                                      </td>
                                      <td>{data?.title}</td>

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
                            data.length < 0 && (
                              <tr>
                                <td colSpan="10" className="text-center">
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
    </>
  );
};

export default connect(null, {
  getEpisode,
  getMovieCategory,
  // getMovie,
  deleteEpisode,
  getSeason,
  getMovieEpisode,
  getAllEpisode,
})(Episode);
