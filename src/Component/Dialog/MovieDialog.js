import React, { useState, useRef, useEffect } from "react";
import UploadProgress from "../../Pages/UploadProgress";
import { setUploadFile } from "../../store/Movie/movie.action";
//react-router-dom
import { useHistory, NavLink, useLocation } from "react-router-dom";
import { EMPTY_TMDB_MOVIES_DIALOGUE } from "../../store/Movie/movie.type";

//material-ui
import { DialogActions, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";

import Paper from "@material-ui/core/Paper";

import card from "../assets/images/1.png";
import thumb from "../assets/images/5.png";

//editor
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

//Multi Select Dropdown
import Multiselect from "multiselect-react-dropdown";

//react-redux
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

//all actions

import {
  updateMovie,
  loadMovieData,
  ImdbMovieCreate,
} from "../../store/Movie/movie.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";

//jquery
import $ from "jquery";
import noImage from "../../Component/assets/images/noImage.png";
//Alert
import { permissionError } from "../../Util/Alert";
import { YouTube } from "@material-ui/icons";
import { baseURL, devKey } from "../../Util/ServerPath";
import { Toast } from "../../Util/Toast_";
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

const MovieDialog = (props) => {
  const { region } = useSelector((state) => state.region);
  const { teamMember } = useSelector((state) => state.teamMember);
  const { genre } = useSelector((state) => state.genre);

  const ref = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const editor = useRef(null);
  const classes = useStyles1();
  const history = useHistory();

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };

  const [tmdbId, setTmdbId] = useState("");
  const [tmdbTitle, setTmdbTitle] = useState("");
  const [genres, setGenres] = useState([]);
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [description, setDescription] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [movieId, setMovieId] = useState("");
  const [type, setType] = useState("Premium");
  const [runtime, setRuntime] = useState("");
  const [videoType, setVideoType] = useState("0");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");
  const [movUrl, setMovUrl] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [mkvUrl, setMkvUrl] = useState("");
  const [webmUrl, setWebmUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [update, setUpdate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [genreData, setGenreData] = useState([{ value: "", label: "" }]);
  const [editorOptions, setEditorOptions] = useState({
    buttonList: [
      ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["removeFormat"],
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "table"],
      ["link", "image", "video"],
      ["fullScreen", "showBlocks", "codeView"],
      ["preview", "print"],
      ["save"],
    ],

    onPaste: handlePaste,
  });

  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    movieImageResURL: "",
    movieVideoResURL: "",
  });

  const location = useLocation();
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const dialogDatas = JSON.parse(localStorage.getItem("updateMovieData1"));

  const dialogData = location?.state ? location?.state : dialogDatas;
  const [data, setData] = useState({
    title: "",
    description: "",
    year: "",
    categories: "",
    genres: [],
    thumbnail: [],
    image: [],
    type: "",
    country: "",
    runtime: "",
    tmdbMovieId: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
  });

  const [error, setError] = useState({
    videoType: "",
    youtubeUrl: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    m3u8Url: "",
  });

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });

  const { movieDetailsTmdb, showData } = useSelector((state) => state.movie);

  //useEffect for Get Data
  useEffect(() => {
    props.getGenre(); // eslint-disable-next-line
    props.getRegion(); // eslint-disable-next-line
    props.getTeamMember(); // eslint-disable-next-line
  }, []);

  //set data in dialog

  const genreId_ = dialogData?.genre?.map((value) => {
    return value._id;
  });

  const genreId = movieDetailsTmdb?.genre?.map((id) => {
    return id;
  });

  useEffect(() => {
    setGenres(genreId);
  }, [movieDetailsTmdb]);

  useEffect(() => {
    if (dialogData) {
      setTitle(dialogData.title);

      // setResURL({
      //   thumbnailImageResURL: dialogData?.thumbnail,
      //   movieImageResURL: dialogData?.image,
      //   movieVideoResURL: dialogData?.link,
      // });

      setDescription(dialogData.description);
      setYear(dialogData.year);
      setCountry(dialogData.region._id);
      setGenres(genreId !== undefined ? genreId : genreId_);
      setMovieId(dialogData._id);
      setType(dialogData.type);

      setRuntime(dialogData.runtime);
      setVideoType(dialogData.videoType);
      if (dialogData.videoType == 0) {
        setYoutubeUrl(dialogData.link);
      } else if (dialogData.videoType == 1) {
        setM3u8Url(dialogData.link);
      } else if (dialogData.videoType == 2) {
        setMovUrl(dialogData.link);
      } else if (dialogData.videoType == 3) {
        setMp4Url(dialogData.link);
      } else if (dialogData.videoType == 4) {
        setMkvUrl(dialogData.link);
      } else if (dialogData.videoType == 5) {
        setWebmUrl(dialogData.link);
      } else if (dialogData.videoType == 6) {
        setEmbedUrl(dialogData.link);
      }
    }
    localStorage.setItem("trailerId", JSON.stringify(dialogData));
    localStorage.setItem("movieTitle", dialogData?.title);
  }, []);

  const fetchData = async () => {
    if (dialogData?.IMDBid == null && dialogData?.TmdbMovieId == null) {
      const fileNameWithExtensionThumbnail = dialogData?.thumbnail
        ?.split("/")
        .pop();
      const { imageURL: thumbnailURL } = await covertURl(
        "movieThumbnail/" + fileNameWithExtensionThumbnail
      );
      const fileNameWithExtensionImage = dialogData?.image?.split("/").pop();
      const { imageURL } = await covertURl(
        "movieImage/" + fileNameWithExtensionImage
      );
      setThumbnailPath(thumbnailURL);
      setImagePath(imageURL);
    } else {
      setThumbnailPath(dialogData?.thumbnail);
      setImagePath(dialogData?.image);
    }

    if (dialogData?.videoType === 7) {
      const fileNameWithExtensionVideoLink = dialogData?.link?.split("/").pop();
      const { imageURL } = await covertURl(
        "movieVideo/" + fileNameWithExtensionVideoLink
      );
      setVideoPath(imageURL);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const tmdbMovieDetail = async () => {
    await props.loadMovieData(tmdbId, tmdbTitle);
  };

  //Set Data after Getting
  useEffect(() => {
    setGenreData(
      genre?.map((val) => ({
        value: val?.name,
        label: val?.name,
      }))
    );
  }, [genre]);

  //Set Data after Getting
  useEffect(() => {
    setCountries(region);
  }, [region]);

  //call teamMember and set teamMember

  useEffect(() => {
    setTeamMemberData(teamMember);
  }, [teamMember]);

  let folderStructureMovieImage = "mova/movieImage";

  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL({ ...resURL, movieImageResURL: resDataUrl });

    setImagePath(imageURL);
  };
  let folderStructureThumbnail = "mova/movieThumbnail";

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

  let folderStructureMovieVideo = "mova/movieVideo";

  const videoLoad = async (event) => {
    setVideo(event.target.files[0]);
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(event.target.files[0]);
    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setRuntime(parseInt(durationInMilliseconds));
    });

    // try {
    const formData = new FormData();
    formData.append("folderStructure", folderStructureMovieVideo);
    formData.append("keyName", event.target.files[0]?.name);
    formData.append("content", event.target.files[0]);
    const uploadUrl = baseURL + `file/upload-file`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);
    // Set up event listener for tracking progress
    xhr.upload.onprogress = (event) => {
      const progress = (event.loaded / event.total) * 100;
      setUploadProgress(progress);
      setLoading(true);

      if (progress === 100) {
        xhr.onload = async () => {
          if (xhr.status === 200) {
            try {
              const responseData = JSON?.parse(xhr.responseText);
              setResURL({ ...resURL, movieVideoResURL: responseData?.url });
              if (responseData?.status) {
                setLoading(false);
                Toast("success", "successfully Video Upload");

                const fileNameWithExtension = responseData?.url
                  .split("/")
                  .pop();
                const fetchData = async () => {
                  try {
                    const { imageURL } = await covertURl(
                      "movieVideo/" + fileNameWithExtension
                    );

                    setVideoPath(imageURL);
                  } catch (error) {
                    console.error(error);
                  }
                };
                fetchData();
                const interval = setInterval(fetchData, 1000 * 60);
                return () => clearInterval(interval);
              }
            } catch (error) {
              console.error("Error parsing response data:", error);
            }
          } else {
            console.error("HTTP error! Status:", xhr?.status);
          }
        };
      }
    };

    xhr.onerror = () => {
      console.error("Error during upload");
    };

    // Set request headers
    xhr.setRequestHeader("key", devKey); // Your API key if required

    // Send the request with the form data
    xhr.send(formData);
  };

  const dispatch = useDispatch();

  const validateUrlByType = (url, videoType) => {
    ;
    console.log("url", url);
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const setUrlErrorByType = (videoType, url, setError, updateError) => {
    const error = {};
    if (!validateUrlByType(url, videoType)) {
      error[`${videoType}Url`] = "Invalid URL format";
      updateError(error);
    }
  };

  //insert function

  const handleSubmit = () => {
    if (
      !runtime ||
      !type ||
      type === "select Type" ||
      videoType === "selectVideoType" ||
      (videoType == 1 && !youtubeUrl) ||
      (videoType == 1 && !m3u8Url) ||
      (videoType == 2 && !movUrl) ||
      (videoType == 3 && !mp4Url) ||
      (videoType == 4 && !mkvUrl) ||
      (videoType == 5 && !webmUrl) ||
      (videoType == 6 && !embedUrl) ||
      (videoType === 7 && !videoPath)
    ) {
      const error = {};
      if (!runtime) error.runtime = "runTime is Required";

      if (videoType == 0 && !youtubeUrl)
        error.youtubeUrl = "Link is Not Required !";
      if (videoType == 1 && !m3u8Url) error.m3u8Url = "Link is Not Required !" ;
      if (videoType == 2 && !movUrl) error.movUrl = "Link is Not Required !";
      if (videoType == 3 && !mp4Url) error.mp4Url = "Link is Not Required !";
      if (videoType == 4 && !mkvUrl) error.mkvUrl = "Link is Not Required !";
      if (videoType == 5 && !webmUrl) error.webmUrl = "Link is Not Required !";
      if (videoType == 6 && !embedUrl)
        error.embedUrl = "Video is Not Required !";
      if (videoType == 7 && video?.length === 0)
        error.video = "Link is Not Required !";
      if (type === "select Type" || !type) error.type = "Type Is Required";
      if (!runtime) error.runtime = "runtime is Required !";
      if (videoType == "selectVideoType" && videoType == 0)
        error.videoType = "Video Type is Required !";
        debugger
      switch (videoType) {
        case 1:
          setUrlErrorByType(videoType, m3u8Url, setError, (error) =>
          setError({ ...error, m3u8Url: error[`${m3u8Url}Url`] })
        );
          break;
        case 2:
    setUrlErrorByType(videoType, movUrl, setError, (error) =>
        setError({ ...error, movUrl: error[`${movUrl}Url`] })
      );
          break;
        case 3:
    setUrlErrorByType(videoType, mp4Url, setError, (error) =>
        setError({ ...error, mp4Url: error[`${mp4Url}Url`] })
      );
          break;
        case 4:
    setUrlErrorByType(videoType, mkvUrl, setError, (error) =>
        setError({ ...error, mkvUrl: error[`${mkvUrl}Url`] })
      );
          break;
        case 5:
    setUrlErrorByType(videoType, webmUrl, setError, (error) =>
        setError({ ...error, webmUrl: error[`${webmUrl}Url`] })
      );
          break;
        case 6:
    setUrlErrorByType(videoType, embedUrl, setError, (error) =>
        setError({ ...error, embedUrl: error[`${embedUrl}Url`] })
      );
          break;
        default:
          break;
      }

      return setError({ ...error });
    } else {
      if (!hasPermission) return permissionError();
      // props.setUploadFile(video);

      if (dialogData) {
        if (
          resURL?.thumbnailImageResURL ||
          resURL?.movieVideoResURL ||
          resURL?.movieImageResURL
        ) {
          let objData = {
            title,
            description,
            year,
            type,
            region: country,
            image: resURL?.movieImageResURL,
            runtime,
            thumbnail: resURL?.thumbnailImageResURL,
            videoType,
            genre: genres,
            link:
              videoType == 0
                ? youtubeUrl
                : videoType == 1
                ? m3u8Url
                : videoType == 2
                ? movUrl
                : videoType == 3
                ? mp4Url
                : videoType == 4
                ? mkvUrl
                : videoType == 5
                ? webmUrl
                : videoType == 6
                ? embedUrl
                : resURL?.movieVideoResURL,
          };
          props.updateMovie(objData, dialogData?._id);
        } else {
          let objData = {
            title,
            description,
            year,
            type,
            region: country,
            runtime,
            videoType,
            genre: genres,
            link:
              videoType == 0
                ? youtubeUrl
                : videoType == 1
                ? m3u8Url
                : videoType == 2
                ? movUrl
                : videoType == 3
                ? mp4Url
                : videoType == 4
                ? mkvUrl
                : videoType == 5
                ? webmUrl
                : videoType == 6 && embedUrl,
          };
          props.updateMovie(objData, dialogData?._id);
        }
      } else {
        let imdbObjData = {
          tmdbId: movieDetailsTmdb?.TmdbMovieId,
          videoType,
          link:
            videoType == 0
              ? youtubeUrl
              : videoType == 1
              ? m3u8Url
              : videoType == 2
              ? movUrl
              : videoType == 3
              ? mp4Url
              : videoType == 4
              ? mkvUrl
              : videoType == 5
              ? webmUrl
              : videoType == 6
              ? embedUrl
              : resURL?.movieVideoResURL,
        };
        props.ImdbMovieCreate(imdbObjData);
      }

      setUpdate("update");

      setTimeout(() => {
        dispatch({ type: EMPTY_TMDB_MOVIES_DIALOGUE });
        history.push({
          pathname: "/admin/movie",
          state: data,
        });
      }, 3000);

      localStorage.removeItem("updateMovieData");
    }
  };

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    genres?.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    history.replace("/admin/movie");
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
          <div className="row ">
            <div className="col-lg-12">
              {dialogData ? (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card mt-3 ml-4">
                    <div class="iq-card-header d-flex justify-content-between ">
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
                        <li class="nav-item navCustom">
                          <NavLink
                            class="nav-link active"
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
                            class="nav-link"
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
              ) : (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex align-items-center">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px", color: "#ffff" }}
                        />

                        <h4 class="card-title my-0">Insert Movie </h4>
                      </div>
                    </div>
                    <div class="iq-card-body">
                      <ul
                        class="nav nav-pills mb-2 ml-0"
                        id="pills-tab"
                        style={{ marginLeft: "21px" }}
                        role="tablist"
                      >
                        <li class="nav-item navCustom">
                          <NavLink
                            class="nav-link active"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-home"
                            to="/admin/movie/movie_form"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                          >
                            <GetAppIcon
                              className="mb-1 "
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
                            to="/admin/movie/movie_manual"
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

              {!dialogData && (
                <>
                  <div>
                    {" "}
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
                          placeholder="Enter IMDB ID. Ex:tt0120338"
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
                          placeholder="Enter Movie Title"
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
                            {" "}
                            Fetch{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-content-center mt-2 mb-5">
                      <div class="col-lg-5">
                        <h6>
                          <p>
                            {" "}
                            Get IMDB or IMDB ID from here:{" "}
                            <ard-body
                              href="https://www.themoviedb.org/movie/"
                              target="_blank"
                            >
                              TheMovieDB.org
                            </ard-body>{" "}
                            or{" "}
                            <a href="https://www.imdb.com/" target="_blank">
                              Imdb.com
                            </a>{" "}
                          </p>
                        </h6>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="iq-card mb-5 ">
                <div className="iq-card-body">
                  {showData ? (
                    <>
                      <div className="row">
                        <div className="col-md-6 iq-item-product-left">
                          <div className="iq-image-container px-3">
                            <div className="iq-product-cover">
                              <label className="float-left styleForTitle movieForm">
                                Title
                              </label>

                              <input
                                type="text"
                                placeholder="Title"
                                className="form-control form-control-line"
                                Required
                                value={movieDetailsTmdb?.title}
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                }}
                              />

                              <label
                                htmlFor="description"
                                className="styleForTitle mt-3 movieForm"
                              >
                                Description
                              </label>

                              <SunEditor
                                value={movieDetailsTmdb?.description}
                                setContents={movieDetailsTmdb?.description}
                                ref={editor}
                                height={300}
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

                              <div className="row">
                                <div className="col-md-6 my-2">
                                  <label className="float-left styleForTitle movieForm">
                                    Release Year
                                  </label>

                                  <input
                                    type="date"
                                    readOnly
                                    placeholder="YYYY-MM-DD"
                                    className="form-control form-control-line"
                                    Required
                                    min="1950"
                                    value={movieDetailsTmdb?.year}
                                    onChange={(e) => {
                                      setYear(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="col-md-6 my-2">
                                  <label className="float-left">Runtime</label>
                                  <input
                                    type="number"
                                    placeholder="Runtime"
                                    className="form-control form-control-line"
                                    required
                                    value={runtime}
                                    onChange={(e) => {
                                      setRuntime(e.target.value);
                                    }}
                                  />
                                  {error.runtime && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.runtime}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="row">
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

                                      if (e.target.value === "select Type") {
                                        return setError({
                                          ...error,
                                          type: "Season is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          type: "",
                                        });
                                      }
                                    }}
                                  >
                                    <option value="select Type">
                                      Select Type
                                    </option>
                                    <option value="Free">Free</option>
                                    <option value="Premium">Premium</option>
                                  </select>
                                </div>
                                {error.type && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.type}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                              <div className="row">
                                <div className="col-md-12 my-2">
                                  Genre
                                  <label className="styleForTitle movieForm"></label>
                                  <Multiselect
                                    displayValue="name"
                                    id="css_custom"
                                    options={genre ? genre : null}
                                    onSelect={onSelect} // Function will trigger on select event
                                    onRemove={onRemove}
                                    selectedValues={
                                      movieDetailsTmdb
                                        ? movieDetailsTmdb?.genre
                                        : null
                                    }
                                  />
                                </div>
                              </div>

                              <div className="row">
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
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="https://www.youtube.com"
                                      className="form-control form-control-line"
                                      Required
                                      value={movieDetailsTmdb?.trailerUrl}
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
                          <div className="product-additional-details pr-3">
                            <label className="mt-3 movieForm">Thumbnail </label>
                            <div className="d-flex justify-content-center align-item-center">
                              <img
                                alt="app"
                                src={
                                  movieDetailsTmdb.thumbnail
                                    ? movieDetailsTmdb.thumbnail
                                    : thumb
                                }
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                  borderRadius: "0.25rem",
                                  marginTop: 10,
                                  marginBottom: 30,
                                  height: "240px",
                                  width: "170px",
                                }}
                              />
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
                              <img
                                className="img-fluid"
                                alt="app"
                                src={
                                  movieDetailsTmdb.image
                                    ? movieDetailsTmdb.image
                                    : card
                                }
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

                            <label
                              className="movieForm"
                              style={{
                                paddingTop: "1.5px",
                                marginTop: "9px",
                              }}
                            >
                              Video Type
                            </label>
                            <div>
                              <select
                                id="contentType"
                                name="contentType"
                                class="form-control form-control-line"
                                value={videoType}
                                onChange={(e) => {
                                  setVideoType(e.target.value);

                                  if (e.target.value) {
                                    return setError({
                                      ...error,
                                      videoType: "Video Tyccpe is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      videoType: "",
                                    });
                                  }
                                }}
                              >
                                <option value="selectVideoType">
                                  Select Video Type
                                </option>
                                <option value="0">Youtube Url </option>
                                <option value="1">m3u8 Url </option>
                                <option value="2">MOV Url </option>
                                <option value="3">MP4 Url</option>
                                <option value="4">MKV Url</option>
                                <option value="5">WEBM Url</option>
                                <option value="6">Embed source</option>
                                <option value="7">
                                  File (MP4/MOV/MKV/WEBM)
                                </option>
                              </select>
                            </div>
                            <label
                              className="movieForm"
                              style={{ marginTop: "14px" }}
                              onChange={(e) => setVideoUrl(e.target.value)}
                            >
                              Video URL
                            </label>

                            <div>
                              {videoType == 0 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={youtubeUrl}
                                    onChange={(e) => {
                                      setYoutubeUrl(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          youtubeUrl:
                                            "Youtube url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          youtubeUrl: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.youtubeUrl && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.youtubeUrl}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 1 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={m3u8Url}
                                    onChange={(e) => {
                                      setM3u8Url(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          m3u8Url: "m3u8 Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          m3u8Url: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.m3u8Url && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.m3u8Url}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 2 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={movUrl}
                                    onChange={(e) => {
                                      setMovUrl(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          movUrl: "mov Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          movUrl: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.movUrl && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.movUrl}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 3 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={mp4Url}
                                    onChange={(e) => {
                                      setMp4Url(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          mp4Url: "mp4 Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          mp4Url: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.mp4Url && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.mp4Url}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 4 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={mkvUrl}
                                    onChange={(e) => {
                                      setMkvUrl(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          mkvUrl: "mkv Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          mkvUrl: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.mkvUrl && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.mkvUrl}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 5 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={webmUrl}
                                    onChange={(e) => {
                                      setWebmUrl(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          webmUrl: "webm Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          webmUrl: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.webmUrl && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.webmUrl}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 6 && (
                                <>
                                  <input
                                    type="text"
                                    id="link"
                                    placeholder="Link"
                                    class="form-control "
                                    value={embedUrl}
                                    onChange={(e) => {
                                      setEmbedUrl(e.target.value);
                                      if (!e.target.value) {
                                        return setError({
                                          ...error,
                                          embedUrl: "embed Url is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          embedUrl: "",
                                        });
                                      }
                                    }}
                                  />
                                  {error.embedUrl && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.embedUrl}
                                      </Typography>
                                    </div>
                                  )}
                                </>
                              )}
                              {videoType == 7 && (
                                <>
                                  <input
                                    type="file"
                                    id="customFile"
                                    className="form-control"
                                    accept="video/*"
                                    required=""
                                    onChange={videoLoad}
                                  />

                                  <>
                                    <video
                                      height="100px"
                                      width="100px"
                                      controls
                                      alt="app"
                                      src={videoPath}
                                      style={{
                                        boxShadow:
                                          " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                        border:
                                          "0.5px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: "10px",
                                        marginTop: "10px",
                                        float: "left",
                                      }}
                                    />

                                    <div
                                      class="img-container"
                                      style={{
                                        display: "inline",
                                        position: "relative",
                                        float: "left",
                                      }}
                                    ></div>
                                  </>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogActions className="mb-3 mr-3">
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
                    </>
                  ) : (
                    dialogData && (
                      <>
                        <div className="row p-2 ">
                          <div className="col-md-6 iq-item-product-left">
                            <div className="iq-image-container px-3">
                              <div className="iq-product-cover my-3">
                                <div class="">
                                  <label className="float-left styleForTitle movieForm">
                                    Title
                                  </label>

                                  <input
                                    type="text"
                                    placeholder="Title"
                                    className="form-control form-control-line"
                                    Required
                                    name="title"
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

                                <div class="my-3">
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
                                    setOptions={editorOptions}
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
                                <div className="row my-3">
                                  <div className="col-md-6 my-2">
                                    <label className="float-left styleForTitle movieForm">
                                      Release Year
                                    </label>

                                    <input
                                      type="data"
                                      placeholder="YYYY-MM-DD"
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
                                    <label className="float-left">
                                      Runtime
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Runtime"
                                      className="form-control form-control-line"
                                      required
                                      value={runtime}
                                      onChange={(e) => {
                                        setRuntime(e.target.value);

                                        if (!e.target.value) {
                                          return setError({
                                            ...error,
                                            runtime: "Runtime is Required!",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            runtime: "",
                                          });
                                        }
                                      }}
                                    />
                                    {error.runtime && (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
                                          color="error"
                                          style={{
                                            fontFamily: "Circular-Loom",
                                            color: "#ee2e47",
                                          }}
                                        >
                                          {error.runtime}
                                        </Typography>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="row my-3">
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
                                      <option value="select Type">
                                        Select Type
                                      </option>
                                      <option value="Free">Free</option>
                                      <option vlaue="Premium">Premium</option>
                                      {/* <option>Default</option> */}
                                    </select>

                                    {error.type && (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
                                          style={{
                                            fontFamily: "Circular-Loom",
                                            color: "#ee2e47",
                                          }}
                                        >
                                          {error.type}
                                        </Typography>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="row my-3">
                                  <div className="col-md-12 my-2">
                                    <label className="styleForTitle movieForm">
                                      Genre
                                    </label>

                                    <Multiselect
                                      displayValue="name"
                                      options={genre ? genre : null}
                                      selectedValues={
                                        dialogData ? dialogData?.genre : null
                                      }
                                      onSelect={onSelect}
                                      onRemove={onRemove}
                                      // id="css_custom"
                                      // placeholder="Select Genre"
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

                                <div className="row my-3">
                                  <div className="col-md-12 my-2">
                                    <label
                                      htmlFor="earning"
                                      className="styleForTitle movieForm"
                                    >
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
                                      {countries.map((data, i) => {
                                        return (
                                          <option value={data._id} key={i}>
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
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 iq-item-product-right">
                            <div className="product-additional-details px-3">
                              <label className="mt-3 movieForm">
                                Thumbnail 
                              </label>
                              <div className="d-flex justify-content-center align-item-center">
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
                                        alt=""
                                        height="250"
                                        width="170"
                                        style={{
                                          zIndex: "-1",
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                          borderRadius: "0.25rem",
                                        }}
                                        onClick={handleClick}
                                      />
                                    </Paper>
                                  </div>
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
                              <div class="my-3">
                                <label className="mt-3 movieForm">Image</label>
                                <div className="d-flex justify-content-center align-item-center">
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
                                          style={{
                                            display: "none",
                                            boxShadow:
                                              "0 5px 15px 0 rgb(105 103 103 / 50%)",

                                            borderRadius: "0.25rem",
                                          }}
                                          enctype="multipart/form-data"
                                        />
                                      </div>
                                      <img
                                        onClick={handleClickImage}
                                        className="img-fluid"
                                        alt="app"
                                        src={imagePath}
                                        style={{
                                          border:
                                            "0.5px solid rgba(255, 255, 255, 0.2)",
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
                                          alt=""
                                          src={card}
                                          onClick={handleClickImage}
                                        />
                                      </Paper>
                                    </div>
                                  )}
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

                              <div class="my-3">
                                <label
                                  className="movieForm"
                                  style={{
                                    paddingTop: "1.5px",
                                    marginTop: "9px",
                                  }}
                                >
                                  Video Type
                                </label>
                                <div>
                                  <select
                                    id="contentType"
                                    name="contentType"
                                    class="form-control form-control-line"
                                    required
                                    value={videoType}
                                    onChange={(e) => {
                                      setVideoType(e.target.value);
                                      if (
                                        !e.target.value === "selectVideoType"
                                      ) {
                                        return setError({
                                          ...error,
                                          videoType:
                                            "Video Tyasdsdpe is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          videoType: "",
                                        });
                                      }
                                    }}
                                  >
                                    <option value="selectVideoType">
                                      Select Video Type
                                    </option>
                                    <option value={0}>Youtube Url </option>
                                    <option value={1}>m3u8 Url </option>
                                    <option value={2}>MOV Url </option>
                                    <option value={3}>MP4 Url</option>
                                    <option value={4}>MKV Url</option>
                                    <option value={5}>WEBM Url</option>
                                    <option value={6}>Embed source</option>
                                    <option value={7}>
                                      File (MP4/MOV/MKV/WEBM)
                                    </option>
                                  </select>
                                  {error.videoType && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.videoType}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div class="my-3">
                                <label
                                  className="movieForm"
                                  style={{ marginTop: "14px" }}
                                  onChange={(e) => {
                                    setVideoUrl(e.target.value);
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
                                >
                                  Video URL
                                </label>
                                {error.videoUrl && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.videoUrl}
                                    </Typography>
                                  </div>
                                )}

                                {videoType == 0 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={youtubeUrl}
                                      onChange={(e) => {
                                        setYoutubeUrl(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 1 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={m3u8Url}
                                      onChange={(e) => {
                                        setM3u8Url(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 2 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={movUrl}
                                      onChange={(e) => {
                                        setMovUrl(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 3 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={mp4Url}
                                      onChange={(e) => {
                                        setMp4Url(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 4 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={mkvUrl}
                                      onChange={(e) => {
                                        setMkvUrl(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 5 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={webmUrl}
                                      onChange={(e) => {
                                        setWebmUrl(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 6 && (
                                  <>
                                    <input
                                      type="text"
                                      id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={embedUrl}
                                      onChange={(e) => {
                                        setEmbedUrl(e.target.value);
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 7 && (
                                  <>
                                    <input
                                      type="file"
                                      id="customFile"
                                      className="form-control"
                                      accept="video/*"
                                      required=""
                                      onChange={videoLoad}
                                    />
                                    {videoPath && (
                                      <>
                                        <video
                                          height="100px"
                                          width="100px"
                                          controls
                                          alt="app"
                                          src={videoPath}
                                          style={{
                                            boxShadow:
                                              " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                            border:
                                              "0.5px solid rgba(255, 255, 255, 0.2)",
                                            borderRadius: "10px",
                                            marginTop: "10px",
                                            float: "left",
                                          }}
                                        />

                                        <div
                                          class="img-container"
                                          style={{
                                            display: "inline",
                                            position: "relative",
                                            float: "left",
                                          }}
                                        ></div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogActions className="mb-3 mr-3">
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
                      </>
                    )
                  )}
                </div>

                <UploadProgress data={data} movieId={movieId} update={update} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  setUploadFile,
  getGenre,
  getRegion,
  getTeamMember,
  updateMovie,
  loadMovieData,
  ImdbMovieCreate,
})(MovieDialog);
