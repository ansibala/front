import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

//image
import Default from "../assets/images/noImage.png";

//react-router-dom
import { NavLink } from "react-router-dom";

//mui
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import TvIcon from "@material-ui/icons/Tv";
import Search from "../assets/images/search.png" 


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

//action
// import {
//   CLOSE_REGION_TOAST,
//   OPEN_REGION_DIALOG,
// } from "../../store/Region/region.type";
import { getSeason, deleteSeason } from "../../store/Season/season.action";
import { OPEN_SEASON_DIALOG } from "../../store/Season/season.type";
import SeasonDialogue from "../Dialog/SeasonDialogue";
import { covertURl } from "../../Util/AwsFunction";
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

//component
// import RegionDialog from "../Dialog/RegionDialog";

const Season = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showUrls, setShowURLs] = useState([""]);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const dialogData = localStorage.getItem("seriesTrailerId");
  const seriesTitle = localStorage.getItem("seriesTitle");



  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch({ type: OPEN_SEASON_DIALOG });
  };

  const updateDialogOpen = (data) => {
    dispatch({ type: OPEN_SEASON_DIALOG, payload: data });
  };
  //useEffect for Get Data
  useEffect(() => {
    props.getSeason(dialogData); // eslint-disable-next-line
  }, []);

  const { season, toast, toastData, actionFor } = useSelector(
    (state) => state.season
  );
  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));

  //Set Data after Getting
  useEffect(() => {
    setData(season);
  }, [season]);

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        data?.map(async (item) => {
       
          if (tmdbId.IMDBid == null && tmdbId.TmdbMovieId == null) {
            const fileNameWithExtension = item.image.split("/").pop();
            const { imageURL } = await covertURl(
              "seasonImage/" + fileNameWithExtension
              );
        
              console.log("imageURL" ,imageURL)
    
            return imageURL;



          } else {
        
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

  const openDeleteDialog = (id) => {
    const data = warning();
    data
      .then((result) => {
        if (result.isConfirmed) {
          if (!hasPermission) return permissionError();

          props.deleteSeason(id);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //Open Dialog
  // const handleOpen = () => {
  //   dispatch({ type: OPEN_REGION_DIALOG });
  // };

  //Update Dialog
  // const updateDialogOpen = (data) => {
  //   dispatch({ type: OPEN_REGION_DIALOG, payload: data });
  // };
  // delete sweetAlert
  // const openDeleteDialog = (regionId) => {
  //   const data = warning();
  //   data
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         if (!hasPermission) return permissionError();
  //         props.deleteRegion(regionId);
  //         Swal.fire("Deleted!", "Your file has been deleted.", "success");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  //toast
  // useEffect(() => {
  //   if (toast) {
  //     setToast(toastData, actionFor);
  //     dispatch({ type: CLOSE_REGION_TOAST });
  //   }
  // }, [toast, toastData, actionFor, dispatch]);

  // for search
  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = season.filter((data) => {
        return data?.name?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(season);
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
                        style={{ fontSize: "30px" ,color:"#ffff" }}
                      />

                      <h4 class="card-title my-0">{seriesTitle} (Season)</h4>
                    </div>
                  </div>
                  <div class="iq-card-body">
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
                          class="nav-link active"
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
                          class="nav-link"
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

              <div className="iq-card mb-5">
                <div className="iq-card-header d-flex justify-content-between">
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
                    <form class="mr-4 position-relative">
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
                  {/* <div className="iq-header-title">
                    <h4 className="card-title">User List</h4>
                  </div> */}
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
                        <tr>
                          <th className="tableAlign">ID</th>
                          <th style={{ paddingLeft: "45px" }}>Image</th>
                          <th className="tableAlign">Name</th>
                          <th className="tableAlign">Season No.</th>
                          <th className="tableAlign">Total Episode</th>
                          <th className="tableAlign">Web Series</th>
                          <th className="tableAlign">Realese Date</th>
                          <th className="tableAlign">Created At</th>
                          <th className="tableAlign">Edit</th>
                          <th className="tableAlign">Delete</th>
                        </tr>
                      </thead>
                      <tbody style={{ borderColor: "#e9ebec" }}>
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
                                      <td class="align-middle tableAlign">
                                        {index + 1}
                                      </td>
                                      <td
                                        className="align-middle"
                                        style={{ paddingLeft: "38px" }}
                                      >
                                        <img
                                          src={showUrls[index]}
                                          height="60px"
                                          width="60px"
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                            border: "0.5px solid rgb(88 106 110)",
                                            borderRadius: 10,
                                            float: "left",
                                            objectFit: "cover",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.name}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.seasonNumber}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.episodeCount}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.movie?.title}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {data?.releaseDate}
                                      </td>
                                      <td class="align-middle tableAlign">
                                        {dayjs(data?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>

                                      <td class="align-middle tableAlign">
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
                                      <td class="align-middle tableAlign">
                                        <button
                                          type="button"
                                          className="btn iq-bg-primary btn-sm"
                                          onClick={() =>
                                            openDeleteDialog(data?._id)
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
                            data?.length === 0 && (
                              <tr>
                                <td colSpan="12" className="text-center">
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
        <SeasonDialogue />
      </div>
    </>
  );
};

export default connect(null, { getSeason, deleteSeason })(Season);
