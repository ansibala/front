import React, { useState, useRef, useEffect } from "react";
import UploadProgressTv from "../../Pages/UploadProgressTv";

//react-router-dom
import { useHistory, NavLink } from "react-router-dom";

//material-ui
import { DialogActions, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import card from "../assets/images/1.png";
import thumb from "../assets/images/5.png";

import { EMPTY_TMDB_SERIES_DIALOGUE } from "../../store/TvSeries/tvSeries.type";
//editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import { ImdbSeriesCreate } from "../../store/TvSeries/tvSeries.action";

//Multi Select Dropdown
import Multiselect from "multiselect-react-dropdown";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import TvIcon from "@material-ui/icons/Tv";

//react-redux
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";

import {
  // updateSeries,
  loadSeriesData,
  // createSeries,
  setUploadTvFile,
  updateTvSeries,
} from "../../store/TvSeries/tvSeries.action";

import { getGenre } from "../../store/Genre/genre.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";

//Alert
import { permissionError } from "../../Util/Alert";

//jquery
import $ from "jquery";
import noImage from "../../Component/assets/images/noImage.png";
import { covertURl, uploadFile } from "../../Util/AwsFunction";

const useStyles1 = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      marginBottom: "22px",
    },
  },
}));

const SeriesForm = (props) => {
  const ref = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const classes = useStyles1();

  const history = useHistory();

  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));

  const editor = useRef(null);
  const [tmdbId, setTmdbId] = useState("");
  const [tmdbTitle, setTmdbTitle] = useState("");
  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [type, setType] = useState("Premium");
  const [update, setUpdate] = useState("");

  const { seriesDetailsTmdb, showData } = useSelector((state) => state.series);
  localStorage.setItem("seriesTrailerId", seriesId);
  localStorage.setItem("seriesTitle", title);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [data, setData] = useState({
    title: "",
    description: "",
    year: "",
    genres: [],
    thumbnail: [],
    image: [],
    type: "",
    country: "",
    tmdbMovieId: "",
  });

  const [error, setError] = useState({
    title: "",
    description: "",
    year: "",
    country: "",
    genres: "",
    image: "",
    thumbnail: "",
    type: "",
  });

  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    seriesImageResURL: "",
    movieVideoResURL: "",
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });

  useEffect(() => {
    setTitle(seriesDetailsTmdb?.title);
    setYear(seriesDetailsTmdb?.year);
    setImagePath(seriesDetailsTmdb?.image);
    setDescription(seriesDetailsTmdb?.description);
    setTrailerUrl(seriesDetailsTmdb?.trailerUrl);
    setThumbnailPath(seriesDetailsTmdb?.thumbnail);
  }, [seriesDetailsTmdb]);

  const genreId = seriesDetailsTmdb?.genre?.map((id) => {
    return id;
  });
  const fetchData = async () => {
    if (dialogData?.IMDBid == null && dialogData?.TmdbMovieId == null) {
      const fileNameWithExtensionThumbnail = dialogData?.thumbnail
        ?.split("/")
        .pop();
      const { imageURL: thumbnailURL } = await covertURl(
        "seriesThumbnail/" + fileNameWithExtensionThumbnail
      );

      const fileNameWithExtensionImage = dialogData?.image?.split("/").pop();
      const { imageURL } = await covertURl(
        "seriesImage/" + fileNameWithExtensionImage
      );
      setThumbnailPath(thumbnailURL);
      setImagePath(imageURL);
    } else {
      setThumbnailPath(dialogData?.thumbnail);
      setImagePath(dialogData?.image);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  // set data in dialog
  useEffect(() => {
    if (dialogData) {
      const genreId_ = dialogData?.genre?.map((value) => {
        return value;
      });
      setTitle(dialogData.title);
      setDescription(dialogData.description);
      setYear(dialogData.year);
      setCountry(dialogData.region._id);
      setGenres(genreId !== undefined ? genreId : genreId_);
      setImagePath(dialogData.image);
      setThumbnailPath(dialogData.thumbnail);
      // setMovieId(dialogData._id);
      setSeriesId(dialogData._id);
      setType(dialogData.type);
    }
  }, []);

  useEffect(() => {
    if (seriesDetailsTmdb) {
      seriesDetailsTmdb?.region?.map((data) => {
        return setCountry(data?._id);
      });
      setSelectedValue(seriesDetailsTmdb.genre);
    }
  }, [seriesDetailsTmdb]);

  useEffect(() => {
    setGenres(genreId);
  }, [seriesDetailsTmdb]);

  //useEffect for Get Data
  useEffect(() => {
    props.getGenre(); // eslint-disable-next-line
    props.getRegion(); // eslint-disable-next-line
    props.getTeamMember(); // eslint-disable-next-line
  }, []);

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });

  const tmdbMovieDetail = async () => {
    await props.loadSeriesData(tmdbId, tmdbTitle);
  };

  //get genre list
  const [genreData, setGenreData] = useState([]);
  const { genre } = useSelector((state) => state.genre);

  //Set Data after Getting
  useEffect(() => {
    setGenreData(genre);
  }, [genre]);

  //get country list
  const [countries, setCountries] = useState([]);

  const { region } = useSelector((state) => state.region);

  //Set Data after Getting
  useEffect(() => {
    setCountries(region);
  }, [region]);

  //get Teammember list
  const [teamMemberData, setTeamMemberData] = useState([]);

  //call teamMember and set teamMember
  const { teamMember } = useSelector((state) => state.teamMember);

  useEffect(() => {
    setTeamMemberData(teamMember);
  }, [teamMember]);

  let folderStructureMovieImage = "mova/seriesImage";

  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL({ ...resURL, seriesImageResURL: resDataUrl });
    setImagePath(imageURL);
  };

  let folderStructureThumbnail = "mova/seriesThumbnail";
  // Thumbnail Load
  const thumbnailLoad = async (event) => {
    setThumbnail(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureThumbnail
    );

    setResURL({ ...resURL, thumbnailImageResURL: resDataUrl });
    setThumbnailPath(imageURL);
  };
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (dialogData) {
      if (!title || !year || !description || !country) {
        const error = {};
        if (genre.length === 0) error.genre = "Genre is Required!";
        if (!title) error.title = "Title is Required!";
        if (!year) error.year = "Year is Required!";
        if (!country) error.country = "Title is Required!";
        if (!description) error.description = "Title is Required!";
        if (image.length === 0) error.image = "Image is Required!";
        if (thumbnail.length === 0) error.thumbnail = "Image is Required!";
        return setError({ ...error });
      } else {
        if (!hasPermission) return permissionError();

        if (resURL?.thumbnailImageResURL || resURL?.seriesImageResURL) {
          let objData = {
            title,
            year,
            genre: genres,
            description,
            type,
            region: country,
            thumbnail: resURL?.thumbnailImageResURL,
            image: resURL?.seriesImageResURL,
          };

          props.updateTvSeries(dialogData?._id, objData);
          setUpdate("update");
        } else {
          let objData = {
            title,
            year,
            genre: genres,
            description,
            type,
            region: country,
          };

          props.updateTvSeries(dialogData?._id, objData);
          setUpdate("update");
        }
        setTimeout(() => {
          seriesDetailsTmdb && dispatch({ type: EMPTY_TMDB_SERIES_DIALOGUE });
          history.goBack();
        }, 3000);
      }
    } else {
      if (!hasPermission) return permissionError();
      let objData = {
        tmdbId: seriesDetailsTmdb?.TmdbMovieId,
        title,
        year,
        genre: genres,
        description,
        type,
        region: country,
        thumbnail: thumbnailPath,
        image: imagePath,
      };

      props.ImdbSeriesCreate(objData);
      setTimeout(() => {
        seriesDetailsTmdb && dispatch({ type: EMPTY_TMDB_SERIES_DIALOGUE });
        history.goBack();
      }, 3000);
    }
  };

  const [selectedGenres, setSelectedGenres] = useState([]);

  // ...

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    const updatedGenres = [...selectedGenres, selectedItem._id];
    setSelectedGenres(updatedGenres);

    genres?.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    history.goBack();
  };

  const handleClick = (e) => {
    ref.current.click();
  };

  const handleClickImage = (e) => {
    imageRef.current.click();
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {dialogData ? (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card mx-3">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex align-items-center">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px", color: "#ffff" }}
                        />

                        <h4 class="card-title my-0">{dialogData.title}</h4>
                      </div>
                    </div>
                    <div class="iq-card-body">
                      <ul
                        class="nav nav-pills mb-2"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li class="nav-item navCustom mt-2">
                          <NavLink
                            class="nav-link active"
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
                        <li class="nav-item navCustom mt-2">
                          <NavLink
                            class="nav-link "
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
                        <li class="nav-item navCustom mt-2">
                          <NavLink
                            class="nav-link "
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
                        <li class="nav-item navCustom mt-2">
                          <NavLink
                            class="nav-link "
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
                        <li class="nav-item navCustom mt-2">
                          <NavLink
                            class="nav-link "
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
              ) : (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card mx-3">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex align-items-center">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px", color: "#ffff" }}
                        />

                        <h4 class="card-title my-0">Insert Web Series</h4>
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
                            class="nav-link active"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-home"
                            to="/admin/web_series/series_form"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                          >
                            <GetAppIcon
                              className="mb-1"
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            TMDB
                          </NavLink>
                        </li>
                        <li class="nav-item navCustom">
                          <NavLink
                            class="nav-link"
                            id="pills-profile-tab"
                            data-toggle="pill"
                            href="#pills-profile"
                            to="/admin/web_series/series_manual"
                            role="tab"
                            aria-controls="pills-profile"
                            aria-selected="false"
                          >
                            <AddIcon
                              className="mb-1"
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Manual
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
              )}
              {dialogData ? (
                ""
              ) : (
                <>
                  <div className="row">
                    <div className="col-lg-3"></div>
                    <div class="col-lg-6">
                      <div
                        class="alert alert-info border-0 text-center movie_alert"
                        role="alert"
                      >
                        Import Contents From TMDB
                      </div>
                    </div>
                    <div className="col-lg-3"></div>
                  </div>
                  <div class="row justify-content-center align-items-baseline">
                    <div class="col-lg-2">
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter IMDB ID. Ex: tt9432978"
                        value={tmdbId}
                        onChange={(e) => {
                          setTmdbId(e.target.value);
                        }}
                        style={{
                          boxShadow: "0 0 0 1.5px ##5fade726",
                        }}
                      />
                    </div>
                    <p className="text-center mt-1">
                      <strong>or</strong>
                    </p>
                    <div class="col-lg-3 d-flex">
                      <input
                        class="form-control"
                        id="imdb_id"
                        type="text"
                        placeholder="Enter Web Series Title"
                        value={tmdbTitle}
                        onChange={(e) => {
                          setTmdbTitle(e.target.value);
                        }}
                        style={{
                          boxShadow: "0 0 0 1.5px ##5fade726",
                        }}
                      />
                      <div>
                        <button
                          type="submit"
                          onClick={tmdbMovieDetail}
                          id="import_btn"
                          className="btn btn-primary btn-sm px-3 py-2 ml-3"
                        >
                          Fetch
                        </button>
                      </div>
                    </div>
                  </div>
                  {error.tmdbTitle && (
                    <div className="pl-1 text-left">
                      <Typography
                        variant="caption"
                        style={{
                          fontFamily: "Circular-Loom",
                          color: "#ee2e47",
                        }}
                      >
                        {error.tmdbTitle}
                      </Typography>
                    </div>
                  )}
                  <div class="row justify-content-center mt-2 mb-5">
                    <div class="col-lg-5">
                      <h6>
                        <p>
                          Get IMDB or IMDB ID from here:
                          <a href={() => false} target="blank">
                            TheMovieDB.org
                          </a>
                          or
                          <a href={() => false} target="blank">
                            Imdb.com
                          </a>
                        </p>
                      </h6>
                    </div>
                  </div>
                </>
              )}

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  {showData ? (
                    <>
                      <div className="row ">
                        <div className="col-md-6 iq-item-product-left">
                          <div className="iq-image-container px-3">
                            <div className="iq-product-cover">
                              <div class="my-4">
                                <label className="float-left styleForTitle movieForm">
                                  Title
                                </label>

                                <input
                                  type="text"
                                  placeholder="Title"
                                  className="form-control form-control-line"
                                  Required
                                  value={title}
                                  onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        title: "Title is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        title: "",
                                      });
                                    }
                                  }}
                                />

                                {error.title && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.title}
                                    </Typography>
                                  </div>
                                )}
                              </div>

                              <div class="my-4">
                                <label
                                  htmlFor="description"
                                  className="styleForTitle mt-3 movieForm"
                                >
                                  Description
                                </label>

                                <SunEditor
                                  value={seriesDetailsTmdb?.description}
                                  setContents={seriesDetailsTmdb?.description}
                                  ref={editor}
                                  height={318}
                                  onChange={(e) => {
                                    setDescription(e);

                                    if (!e) {
                                      return setError({
                                        ...error,
                                        description:
                                          "Description is Required !",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        description: "",
                                      });
                                    }
                                  }}
                                  placeholder="Description"
                                  setOptions={{
                                    buttonList: [
                                      ["undo", "redo"],
                                      ["font", "fontSize", "formatBlock"],

                                      ["fontColor", "hiliteColor", "textStyle"],
                                      ["removeFormat"],
                                      [
                                        "bold",
                                        "underline",
                                        "italic",
                                        "subscript",
                                        "superscript",
                                      ],

                                      ["align", "list", "lineHeight"],
                                      ["link"],
                                      ["fullScreen"],
                                    ],
                                  }}
                                />

                                {error.description && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.description}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                              <div className="row my-4">
                                <div className="col-md-6 my-2">
                                  <label className="float-left styleForTitle movieForm">
                                    Release Year
                                  </label>

                                  <input
                                    type="string"
                                    placeholder="YYYY-MM-DD"
                                    className="form-control form-control-line"
                                    Required
                                    min="1950"
                                    value={seriesDetailsTmdb?.year}
                                    onChange={(e) => {
                                      setYear(e.target.value);

                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          year: "Year is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          year: "",
                                        });
                                      }
                                    }}
                                  />

                                  {error.year && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.year}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-6 my-2">
                                  <label className="float-left styleForTitle movieForm">
                                    Region
                                  </label>

                                  <>
                                    <select
                                      name="type"
                                      className="form-control form-control-line"
                                      id="type"
                                      value={country}
                                      onChange={(e) => {
                                        setCountry(e.target.value);
                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            country: "Country is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            country: "",
                                          });
                                        }
                                      }}
                                    >
                                      <option>Select Region</option>
                                      {countries.map((data) => {
                                        return (
                                          <option value={data._id}>
                                            {data.name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </>

                                  {error.country && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.country}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="row my-4">
                                <div className="col-md-12 my-2">
                                  <label className="float-left movieForm">
                                    Free/Premium
                                  </label>
                                  <select
                                    name="type"
                                    className="form-control form-control-line selector"
                                    id="type"
                                    value={type}
                                    onChange={(e) => {
                                      setType(e.target.value);

                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          type: "Type is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          type: "",
                                        });
                                      }
                                    }}
                                  >
                                    <option>Select Type</option>
                                    <option value={"Free"}>Free</option>
                                    <option value={"Premium"}>Premium</option>
                                    {/* <option value={"Default"}>Default</option> */}
                                  </select>
                                </div>
                              </div>

                              <div className="row my-4">
                                <div className="col-md-12 my-2">
                                  <label className="styleForTitle movieForm">
                                    Genre
                                  </label>

                                  <Multiselect
                                    options={genre} // Options to display in the dropdown
                                    selectedValues={selectedGenres} // Preselected value to persist in dropdown
                                    displayValue="name" // Property name to display in the dropdown options
                                    id="css_custom"
                                    placeholder="Select Genre"
                                    style={{
                                      chips: {
                                        // background: "rgba(145, 111, 203, 0.69)",
                                      },
                                      multiselectContainer: {
                                        color: "rgba(174, 159, 199, 1)",
                                      },
                                      searchBox: {
                                        border: "none",
                                        "border-bottom": "1px solid blue",
                                        "border-radius": "0px",
                                      },
                                    }}
                                  />

                                  {genres?.length === 0 ? (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.genres}
                                      </Typography>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

                              <div className="row my-4">
                                <div className="col-md-12 my-2">
                                  <label className="float-left movieForm">
                                    Trailer URL(YouTube Only)
                                  </label>
                                  {dialogData ? (
                                    <input
                                      type="text"
                                      placeholder="https://www.youtube.com"
                                      className="form-control form-control-line"
                                      Required
                                      value={trailerUrl}
                                      onChange={(e) => {
                                        setTrailerUrl(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            trailerUrl: "Trailer is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            trailerUrl: "",
                                          });
                                        }
                                      }}
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="https://www.youtube.com"
                                      className="form-control form-control-line"
                                      Required
                                      value={seriesDetailsTmdb?.trailerUrl}
                                      onChange={(e) => {
                                        setTrailerUrl(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            trailerUrl: "Trailer is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            trailerUrl: "",
                                          });
                                        }
                                      }}
                                    />
                                  )}

                                  {error.trailer && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.trailer}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 iq-item-product-right">
                          <div className="product-additional-details">
                            <label className="mt-3 movieForm">Thumbnail</label>
                            <div className="d-flex justify-content-center align-item-center">
                              <>
                                <img
                                  alt="app"
                                  src={
                                    seriesDetailsTmdb.thumbnail
                                      ? seriesDetailsTmdb.thumbnail
                                      : thumb
                                  }
                                  style={{
                                    borderRadius: "0.25rem",
                                    marginTop: 10,
                                    marginBottom: 30,
                                    height: "240px",
                                    width: "170px",
                                    // maxWidth: "150px",
                                    // height: "auto",
                                  }}
                                />
                              </>
                            </div>

                            {!thumbnailPath ? (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.thumbnail}
                                </Typography>
                              </div>
                            ) : (
                              ""
                            )}

                            <label className="mt-3 movieForm">Image</label>
                            <div className="d-flex justify-content-center align-item-center">
                              <>
                                {imagePath ? (
                                  <>
                                    <div>
                                      <input
                                        ref={imageRef}
                                        type="file"
                                        className="form-control"
                                        id="customFile"
                                        accept="image/png, image/jpeg ,image/jpg"
                                        Required=""
                                        onChange={imageLoad}
                                        style={{ display: "none" }}
                                        enctype="multipart/form-data"
                                      />
                                    </div>
                                    <img
                                      onClick={handleClickImage}
                                      className="img-fluid"
                                      alt="app"
                                      src={imagePath}
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                        borderRadius: "0.25rem",
                                        marginTop: 10,
                                        marginBottom: 30,
                                        maxWidth: "305px",
                                        height: "auto",
                                      }}
                                    />

                                    <div
                                      className="img-container"
                                      style={{
                                        display: "inline",
                                        position: "relative",
                                        float: "left",
                                      }}
                                    ></div>
                                  </>
                                ) : (
                                  <div className={classes.root}>
                                    <Paper elevation={5}>
                                      <div>
                                        <button
                                          onClick={handleClickImage}
                                          className="upload-button btn"
                                          style={{
                                            // backgroundColor: "#7a788b94 !important",
                                            position: "absolute",
                                            color: "#7a6699",
                                            top: "380px",
                                            right: "275px",
                                          }}
                                        >
                                          <i
                                            class="ri-add-box-fill"
                                            style={{ fontSize: "30px" }}
                                          ></i>
                                        </button>

                                        <input
                                          ref={imageRef}
                                          type="file"
                                          className="form-control"
                                          id="customFile"
                                          accept="image/png, image/jpeg ,image/jpg"
                                          Required=""
                                          onChange={imageLoad}
                                          style={{ display: "none" }}
                                          enctype="multipart/form-data"
                                        />
                                      </div>
                                      <img src={card} />
                                    </Paper>
                                  </div>
                                )}
                              </>

                              <>
                                <img
                                  className="img-fluid"
                                  alt="app"
                                  src={
                                    seriesDetailsTmdb.image
                                      ? seriesDetailsTmdb.image
                                      : card
                                  }
                                  style={{
                                    borderRadius: "0.25rem",
                                    marginTop: 10,
                                    marginBottom: 30,

                                    maxWidth: "305px",
                                    height: "auto",
                                  }}
                                />
                              </>
                            </div>

                            {!imagePath ? (
                              <div className="pl-1 text-left">
                                <Typography
                                  variant="caption"
                                  style={{
                                    fontFamily: "Circular-Loom",
                                    color: "#ee2e47",
                                  }}
                                >
                                  {error.image}
                                </Typography>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogActions className="mb-3  mr-2">
                        <button
                          type="button"
                          className="btn btn-success btn-sm px-3 py-1 mt-4"
                          onClick={handleSubmit}
                        >
                          Insert
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-3 py-1 mt-4"
                          onClick={handleClose}
                        >
                          Cancel
                        </button>
                      </DialogActions>
                      <UploadProgressTv
                        data={data}
                        seriesId={seriesId}
                        update={update}
                      />
                    </>
                  ) : (
                    dialogData && (
                      <>
                        <div className="row mb-4">
                          <div className="col-md-6 iq-item-product-left">
                            <div className="iq-image-container px-3">
                              <div className="iq-product-cover">
                                <div>
                                  <label className="float-left styleForTitle movieForm">
                                    Title
                                  </label>

                                  <input
                                    type="text"
                                    placeholder="Title"
                                    className="form-control form-control-line"
                                    Required
                                    value={title}
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          title: "Title is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          title: "",
                                        });
                                      }
                                    }}
                                  />

                                  {error.title && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.title}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                                <div class="my-4">
                                  <label
                                    htmlFor="description"
                                    className="styleForTitle mt-3 movieForm"
                                  >
                                    Description
                                  </label>

                                  <SunEditor
                                    value={description}
                                    setContents={description}
                                    ref={editor}
                                    height={318}
                                    onChange={(e) => {
                                      setDescription(e);

                                      if (!e) {
                                        return setError({
                                          ...error,
                                          description:
                                            "Description is Required !",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          description: "",
                                        });
                                      }
                                    }}
                                    placeholder="Description"
                                    setOptions={{
                                      callBackSave: (contents) => {
                                        editor.current.editor.core._editable.classList.add(
                                          "custom-editor-class"
                                        );
                                      },
                                      buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize", "formatBlock"],

                                        [
                                          "fontColor",
                                          "hiliteColor",
                                          "textStyle",
                                        ],
                                        ["removeFormat"],
                                        [
                                          "bold",
                                          "underline",
                                          "italic",
                                          "subscript",
                                          "superscript",
                                        ],

                                        ["align", "list", "lineHeight"],
                                        ["link"],
                                        ["fullScreen"],
                                      ],
                                    }}
                                  />

                                  {error.description && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.description}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                                <div className="row my-4">
                                  <div className="col-md-6 my-2">
                                    <label className="float-left styleForTitle movieForm">
                                      Release Year
                                    </label>

                                    <input
                                      type="date"
                                      placeholder="YYYY"
                                      className="form-control form-control-line"
                                      Required
                                      min="1950"
                                      value={year}
                                      onChange={(e) => {
                                        setYear(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            year: "Year is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            year: "",
                                          });
                                        }
                                      }}
                                    />

                                    {error.year && (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
                                          style={{
                                            fontFamily: "Circular-Loom",
                                            color: "#ee2e47",
                                          }}
                                        >
                                          {error.year}
                                        </Typography>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-md-6 my-2">
                                    <label className="float-left styleForTitle movieForm">
                                      Region
                                    </label>

                                    <select
                                      name="type"
                                      className="form-control form-control-line"
                                      id="type"
                                      value={country}
                                      onChange={(e) => {
                                        setCountry(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            country: "Country is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            country: "",
                                          });
                                        }
                                      }}
                                    >
                                      <option>Select Region</option>
                                      {countries.map((data) => {
                                        return (
                                          <option value={data._id}>
                                            {data.name}
                                          </option>
                                        );
                                      })}
                                    </select>

                                    {error.country && (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
                                          style={{
                                            fontFamily: "Circular-Loom",
                                            color: "#ee2e47",
                                          }}
                                        >
                                          {error.country}
                                        </Typography>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="row my-4">
                                  <div className="col-md-12 my-2">
                                    <label className="float-left movieForm">
                                      Free/Premium
                                    </label>
                                    <select
                                      name="type"
                                      className="form-control form-control-line selector"
                                      id="type"
                                      value={type}
                                      onChange={(e) => {
                                        setType(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            type: "Type is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            type: "",
                                          });
                                        }
                                      }}
                                    >
                                      <option>Select Type</option>
                                      <option value={"Free"}>Free</option>
                                      <option value={"Premium"}>Premium</option>
                                      {/* <option value={"Default"}>Default</option> */}
                                    </select>
                                  </div>
                                </div>

                                <div className="row my-4">
                                  <div className="col-md-12 my-2">
                                    <label className="styleForTitle movieForm">
                                      Genre
                                    </label>

                                    <Multiselect
                                      options={genre} // Options to display in the dropdown
                                      selectedValues={dialogData?.genre} // Preselected value to persist in dropdown
                                      onSelect={onSelect} // Function will trigger on select event
                                      onRemove={onRemove} // Function will trigger on remove event
                                      displayValue="name" // Property name to display in the dropdown options
                                      id="css_custom"
                                      placeholder="Select Genre"
                                      style={{
                                        chips: {
                                          // background: "rgba(145, 111, 203, 0.69)",
                                        },
                                        multiselectContainer: {
                                          color: "rgba(174, 159, 199, 1)",
                                        },
                                        searchBox: {
                                          border: "none",
                                          "border-bottom": "1px solid blue",
                                          "border-radius": "0px",
                                        },
                                      }}
                                    />

                                    {genres?.length === 0 ? (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
                                          style={{
                                            fontFamily: "Circular-Loom",
                                            color: "#ee2e47",
                                          }}
                                        >
                                          {error.genres}
                                        </Typography>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="col-md-6 iq-item-product-right"
                            style={{
                              borderLeft:
                                "0.5px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <div className="product-additional-details">
                              <div>
                                <label className="mt-3 movieForm">
                                  Thumbnail
                                </label>
                                <div className="d-flex justify-content-center align-item-center">
                                  {dialogData ? (
                                    <>
                                      {thumbnailPath ? (
                                        <>
                                          <div>
                                            <input
                                              ref={ref}
                                              type="file"
                                              className="form-control"
                                              id="customFile"
                                              accept="image/png, image/jpeg ,image/jpg"
                                              Required=""
                                              onChange={thumbnailLoad}
                                              style={{ display: "none" }}
                                              enctype="multipart/form-data"
                                            />
                                            <img
                                              onClick={handleClick}
                                              alt="app"
                                              src={thumbnailPath}
                                              style={{
                                                boxShadow:
                                                  "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                                borderRadius: "0.25rem",
                                                marginTop: 10,
                                                marginBottom: 30,
                                                height: "240px",
                                                width: "170px",
                                                // maxWidth: "150px",
                                                // height: "auto",
                                              }}
                                            />
                                          </div>

                                          <div
                                            className="img-container"
                                            style={{
                                              display: "inline",
                                              position: "relative",
                                              float: "left",
                                            }}
                                          ></div>
                                        </>
                                      ) : (
                                        <div className={classes.root}>
                                          <Paper elevation={5}>
                                            <div>
                                              <button
                                                onClick={handleClick}
                                                className="upload-button btn"
                                                style={{
                                                  backgroundColor:
                                                    "#7a6699 !important",
                                                  color: "#7a6699",
                                                  position: "absolute",
                                                  top: "50px",
                                                  right: "305px",
                                                }}
                                              >
                                                <i
                                                  class="ri-add-box-fill"
                                                  style={{ fontSize: "30px" }}
                                                ></i>
                                              </button>

                                              <input
                                                ref={ref}
                                                type="file"
                                                className="form-control"
                                                id="customFile"
                                                accept="image/png, image/jpeg ,image/jpg"
                                                Required=""
                                                onChange={thumbnailLoad}
                                                style={{ display: "none" }}
                                                enctype="multipart/form-data"
                                              />
                                            </div>

                                            <img
                                              src={thumb}
                                              height="250"
                                              width="170"
                                              style={{ zIndex: "-1" }}
                                              alt=""
                                            />
                                          </Paper>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        alt="app"
                                        src={
                                          seriesDetailsTmdb.thumbnail
                                            ? seriesDetailsTmdb.thumbnail
                                            : thumb
                                        }
                                        style={{
                                          borderRadius: "0.25rem",
                                          marginTop: 10,
                                          marginBottom: 30,
                                          height: "240px",
                                          width: "170px",
                                          // maxWidth: "150px",
                                          // height: "auto",
                                        }}
                                      />
                                    </>
                                  )}
                                </div>

                                {!thumbnailPath ? (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.thumbnail}
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div class="my-4">
                                <label className="mt-3 movieForm">Image</label>
                                <div className="d-flex justify-content-center align-item-center">
                                  <>
                                    {imagePath ? (
                                      <>
                                        <div>
                                          <input
                                            ref={imageRef}
                                            type="file"
                                            className="form-control"
                                            id="customFile"
                                            accept="image/png, image/jpeg ,image/jpg"
                                            Required=""
                                            onChange={imageLoad}
                                            style={{ display: "none" }}
                                            enctype="multipart/form-data"
                                          />
                                        </div>
                                        <img
                                          onClick={handleClickImage}
                                          className="img-fluid"
                                          alt="app"
                                          src={imagePath}
                                          style={{
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                            borderRadius: "0.25rem",
                                            marginTop: 10,
                                            marginBottom: 30,
                                            maxWidth: "305px",
                                            height: "auto",
                                          }}
                                        />

                                        <div
                                          className="img-container"
                                          style={{
                                            display: "inline",
                                            position: "relative",
                                            float: "left",
                                          }}
                                        ></div>
                                      </>
                                    ) : (
                                      <div className={classes.root}>
                                        <Paper elevation={5}>
                                          <div>
                                            <button
                                              onClick={handleClickImage}
                                              className="upload-button btn"
                                              style={{
                                                // backgroundColor: "#7a788b94 !important",
                                                position: "absolute",
                                                color: "#7a6699",
                                                top: "380px",
                                                right: "275px",
                                              }}
                                            >
                                              <i
                                                class="ri-add-box-fill"
                                                style={{ fontSize: "30px" }}
                                              ></i>
                                            </button>

                                            <input
                                              ref={imageRef}
                                              type="file"
                                              className="form-control"
                                              id="customFile"
                                              accept="image/png, image/jpeg ,image/jpg"
                                              Required=""
                                              onChange={imageLoad}
                                              style={{ display: "none" }}
                                              enctype="multipart/form-data"
                                            />
                                          </div>
                                          <img src={card} />
                                        </Paper>
                                      </div>
                                    )}
                                  </>
                                </div>

                                {!imagePath ? (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.image}
                                    </Typography>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogActions className="mb-3  mr-2">
                          <button
                            type="button"
                            className="btn btn-success btn-sm px-3 py-1 mt-4"
                            onClick={handleSubmit}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm px-3 py-1 mt-4"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                        </DialogActions>
                        <UploadProgressTv
                          data={data}
                          seriesId={seriesId}
                          update={update}
                        />
                      </>
                    )
                  )}
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
  setUploadTvFile,
  getGenre,
  getRegion,
  getTeamMember,
  loadSeriesData,
  updateTvSeries,
  ImdbSeriesCreate,
})(SeriesForm);
