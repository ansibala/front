import React, { useState, useRef, useEffect } from "react";
import $ from "jquery";

//react-router-dom
import { useHistory, NavLink } from "react-router-dom";

//material-ui
import { DialogActions, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";
import male from "../assets/images/defaultUserPicture.jpg";
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
  createManual,
} from "../../store/Movie/movie.action";
import { getGenre } from "../../store/Genre/genre.action";
import { getRegion } from "../../store/Region/region.action";
import { getTeamMember } from "../../store/TeamMember/teamMember.action";
import UploadProgressManual from "../../Pages/UploadProgressManual";
import { setUploadFileManual } from "../../store/Movie/movie.action";
//Alert
import { permissionError } from "../../Util/Alert";
import { covertURl, uploadFile } from "../../Util/AwsFunction";
import axios from "axios";
import { baseURL, devKey } from "../../Util/ServerPath";
import { setToast } from "../../Util/Toast";
import { Toast } from "../../Util/Toast_";
import { FILE_UPLOAD_SUCCESS } from "../../store/Movie/movie.type";

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
  const { genre } = useSelector((state) => state.genre);
  const { region } = useSelector((state) => state.region);
  const { movieDetailsTmdb } = useSelector((state) => state.movie);
  const hasPermission = useSelector((state) => state.admin.admin.flag);
  //call teamMember and set teamMember
  const { teamMember } = useSelector((state) => state.teamMember);

  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));

  const editor = useRef(null);

  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [trailerName, setTrailerName] = useState("");
  const [trailerType, setTrailerType] = useState("");
  const [description, setDescription] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [year, setYear] = useState("");
  const [genres, setGenres] = useState([]);
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [trailerImage, setTrailerImage] = useState([]);
  const [trailerImagePath, setTrailerImagePath] = useState("");
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [trailerVideo, setTrailerVideo] = useState([]);
  const [trailerVideoPath, setTrailerVideoPath] = useState("");
  const [movieId, setMovieId] = useState("");
  const [type, setType] = useState("Premium");
  const [runtime, setRuntime] = useState("");
  const [videoType, setVideoType] = useState("0");
  const [trailerVideoType, setTrailerVideoType] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");
  const [movUrl, setMovUrl] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [mkvUrl, setMkvUrl] = useState("");
  const [webmUrl, setWebmUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [countries, setCountries] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showLink, setShowLink] = useState("");
  //get genre list
  const [genreData, setGenreData] = useState([]);
  //get category list
  const [categoryData, setCategoryData] = useState([]);
  const [trailerVideoUrl, setTrailerVideoUrl] = useState("");
  localStorage.setItem("trillerId", movieId);
  const [data, setData] = useState({
    title: "",
    trailerName: "",
    trailerType: "",
    description: "",
    year: "",
    categories: "",
    genres: [],
    thumbnail: [],
    image: [],
    trailerImage: [],
    type: "",
    country: "",
    runtime: "",
    videoType: "",
    trailerVideoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    trailerVideoUrl: "",
    trailerVideo: [],
  });

  const [error, setError] = useState({
    title: "",
    trailerType: "",
    trailerName: "",
    description: "",
    year: "",
    genres: [],
    thumbnail: [],
    image: [],
    trailerImage: [],
    type: "",

    country: "",
    runtime: "",
    trailerVideoType: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
    trailerVideoUrl: "",
    trailerVideo: "",
  });

  //useEffect for Get Data
  useEffect(() => {
    props.getGenre(); // eslint-disable-next-line
    props.getRegion(); // eslint-disable-next-line
    // props.getTeamMember(); // eslint-disable-next-line
  }, []);
  // // open dialogue
  // useEffect(
  //   () => () => {
  //     setGenres([]);
  //     setCountry("");
  //     setTitle("");
  //     setTrailerName("");
  //     setTrailerType("");
  //     setDescription("");
  //     setTrailerUrl("");
  //     setYear("");
  //     setImage([]);
  //     setImagePath("");
  //     setTrailerImage([]);
  //     setTrailerImagePath("");
  //     setThumbnail("");
  //     setVideo([]);
  //     setVideoPath("");
  //     setTrailerVideo([]);
  //     setTrailerVideoPath("");
  //     setMovieId("");
  //     setType("");

  //     setRuntime("");
  //     setYoutubeUrl("");
  //     setVideoType("");
  //     setTrailerVideoType("");
  //     setMovUrl("");
  //     setMp4Url("");
  //     setMkvUrl("");
  //     setWebmUrl("");
  //     setEmbedUrl("");
  //     setTrailerVideoUrl("");
  //     setError({
  //       title: "",
  //       trailerName: "",
  //       trailerType: "",
  //       description: "",
  //       year: "",
  //       country: "",
  //       genres: "",
  //       image: "",
  //       trailerImage: "",
  //       // video: "",
  //       thumbnail: "",

  //       type: "",

  //       runtime: "",
  //       trailerVideoType: "",
  //       videoType: "",
  //       trailerVideoUrl: "",
  //     });
  //   },
  //   [dialogData]
  // );

  //Set Data after Getting
  useEffect(() => {
    setGenreData(genre);
  }, [genre]);

  // set data in dialog
  useEffect(() => {
    if (dialogData) {
      const genreId = dialogData?.genre?.map((value) => {
        return value._id;
      });
      setTitle(dialogData.title);
      setTrailerName(dialogData.trailerName);
      setTrailerType(dialogData.trailerType);
      setDescription(dialogData.description);
      setYear(dialogData.year);
      setCountry(dialogData.region._id);
      setImagePath(dialogData.image);
      setThumbnailPath(dialogData.thumbnail);
      setMovieId(dialogData._id);
      setVideoPath(dialogData.link);
      setType(dialogData.type);
      setRuntime(dialogData.runtime);
      setTrailerVideoType(dialogData.trailerVideoType);
      if (dialogData.trailerVideoType == 0) {
        setTrailerVideoUrl(dialogData.trailerVideoUrl);
      } else if (dialogData.trailerVideoType == 1) {
        setTrailerVideoPath(dialogData.trailerVideoUrl);
        setTrailerVideo(dialogData.trailerVideoUrl);
      }
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
      } else if (dialogData.videoType == 7) {
        setVideoPath(dialogData.link);
        setVideo(dialogData.link);
      }
    } else {
      setTitle("");
      setTrailerName("");
      setTrailerType("");
      setDescription("");
      setYear("");
      setCountry("");
      setImagePath("");
      setThumbnailPath("");
      setMovieId("");
      setVideoPath("");
      setType("");
      setRuntime("");
      setTrailerVideoType("");
      setTrailerVideoUrl("");
      setTrailerVideoPath("");
      setTrailerVideo("");
      setVideoType("");
      setYoutubeUrl("");
      setM3u8Url("");
      setMovUrl("");
      setMp4Url("");
      setMkvUrl("");
      setWebmUrl("");
      setEmbedUrl("");
      setVideoPath("");
      setVideo("");
    }
  }, [dialogData]);

  const ref = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const classes = useStyles1();
  const history = useHistory();
  const dispatch = useDispatch();

  const handlePaste = (e) => {
    const bufferText = (e?.originalEvent || e).clipboardData.getData(
      "text/plain"
    );
    e.preventDefault();
    document.execCommand("insertText", false, bufferText);
  };
  const [editorOptions, setEditorOptions] = useState({
    // Other SunEditor options you may want to set
    // For the complete list of options, check the documentation.
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
    // Add the custom onPaste handler to the options
    onPaste: handlePaste,
  });

  useEffect(() => {
    setCountries(region);
  }, [region]);

  //get Teammember list
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [showURL, setShowURL] = useState({
    thumbnailImageShowImage: "",
    movieImageShowURL: "",
    movieVideoShowURl: "",
    trailerImageShowURL: "",
    trailerVideoShowURL: "",
  });
  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    movieImageResURL: "",
    movieVideoResURL: "",
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });

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
    setShowURL({ ...showURL, movieImageShowURL: imageURL });
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
    setShowURL({ ...showURL, thumbnailImageShowImage: imageURL });
  };

  let folderStructureMovieVideo = "mova/movieVideo";

  const videoLoad = async (event) => {
    setVideo(event.target.files[0]);
    setVideo(event.target.files[0]);
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(event.target.files[0]);
    videoElement.addEventListener("loadedmetadata", () => {
      const durationInSeconds = videoElement.duration;
      const durationInMilliseconds = durationInSeconds * 1000;
      setRuntime(parseInt(durationInMilliseconds));
    });

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

                    setShowURL({ ...showURL, movieVideoShowURl: imageURL });
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
    xhr.setRequestHeader("key", devKey);
    xhr.send(formData);
  };

  //Trailer Video Load
  let folderStructureTrailerVideo = "mova/trailerVideo";
  const trailerVideoLoad = async (event) => {
    const formData = new FormData();
    formData.append("folderStructure", folderStructureTrailerVideo);
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

              setResURL({ ...resURL, trailerVideoResURL: responseData?.url });

              if (responseData?.status) {
                setLoading(false);

                Toast("success", "successfully Video Upload");

                const fileNameWithExtension = responseData?.url
                  .split("/")
                  .pop();
                const fetchData = async () => {
                  try {
                    const { imageURL } = await covertURl(
                      "trailerVideo/" + fileNameWithExtension
                    );

                    setShowURL({ ...showURL, trailerVideoShowURL: imageURL });
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

    xhr.setRequestHeader("key", devKey);

    xhr.send(formData);
  };

  let folderStructureTrailerImage = "mova/trailerImage";
  //Trailer Image Load
  const trailerImageLoad = async (event) => {
    setTrailerImage(event.target.files[0]);

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerImage
    );

    setResURL({ ...resURL, trailerImageResURL: resDataUrl });
    setShowURL({ ...showURL, trailerImageShowURL: imageURL });
  };

  //Remove Demo
  const removeDemo = () => {
    setVideo([]);
    setVideoPath("");
  };

  const videoChange = (event) => {
    if (document.getElementById("demoVideo").checked) {
      setShowLink("");
    } else {
      setShowLink(event.target.value);
    }
  };

  // //insert function
  const handleSubmit = () => {
    if (!hasPermission) return permissionError();

    if (
      !title ||
      !trailerName ||
      !trailerType ||
      !description ||
      !year ||
      !country ||
      !image ||
      !trailerImage ||
      !thumbnail ||
      !runtime ||
      !type ||
      !trailerVideoType ||
      (!videoType && videoType == 0) ||
      (trailerVideoType == 0 && !trailerVideoUrl)
    ) {
      const error = {};
      if (!image || !imagePath) error.image = "Image is Required!";
      if (!trailerImage) error.trailerImage = "Trailer Image is Required!";
      if (!title) error.title = "Title is Required !";
      if (!trailerName) error.trailerName = "Trailer Name is Required !";
      if (!trailerType) error.trailerType = "Trailer Type is Required !";
      if (!description) error.description = "Description is Required !";
      if (!year) error.year = "Year is Required !";
      if (genres.length === 0) error.genres = "Genre is Required !";
      if (!country) error.country = "Region is Required !";
      if (!runtime) error.runtime = "Runtime is Required !";
      if (!thumbnail) error.thumbnail = "Thumbnail is Required !";
      if (!type) error.type = "Type is required !";

      if (!videoType) error.videoType = "Video Type is required !";
      if (!trailerVideoType)
        error.trailerVideoType = "Trailer Video Type is required !";
      if (trailerVideoType == 0) {
        if (!trailerVideoUrl) {
          error.trailerVideoUrl = "Trailer Youtube URL is Required !";
        }
      } else if (trailerVideoType == 1) {
        if (trailerVideo.length == 0) {
          error.trailerVideo = "Trailer Video is Required !";
        }
      }
      if (!video || !videoPath) error.video = "Video is Required !";
      if (!trailerVideo) error.trailerVideo = "Trailer Video is Required !";

      if (!videoType || !youtubeUrl) {
        error.youtubeUrl = "Youtube URL is Required !";
      }

      return setError({ ...error });
    } else {
      // if (videoType == 7) {
      // props.setUploadFileManual(video);
      setData({
        title,
        trailerName,
        trailerType,
        description,
        year,
        genres,
        thumbnail,
        image,
        trailerImage,
        type,
        runtime,
        videoType,
        trailerVideoType,
        youtubeUrl,
        m3u8Url,
        movUrl,
        mp4Url,
        mkvUrl,
        webmUrl,
        embedUrl,
        trailerVideoUrl,
        country,
        trailerVideo,
      });
      // } else {

      let objData = {
        title,
        description,
        year,
        type,
        region: country,
        image: resURL?.movieImageResURL,
        trailerType,
        trailerVideoType,
        runtime,
        thumbnail: resURL?.thumbnailImageResURL,
        trailerName,
        videoType,
        trailerImage: resURL?.trailerImageResURL,
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
        trailerVideoType,
        trailerVideoUrl:
          trailerVideoType == 0 ? trailerVideoUrl : resURL?.trailerVideoResURL,
      };

      // if (uploadProgress == 100) {
      //   dispatch({ type: FILE_UPLOAD_SUCCESS, payload: objData });
      // }

      props.createManual(objData);
    }

    setTimeout(() => {
      history.push("/admin/movie");
    }, 3000);
    // }
  };

  const genreId = movieDetailsTmdb?.genre?.map((id) => {
    return id;
  });

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    genres?.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");

    if (dialogData) {
      history.goBack();
    } else {
      history.push("/admin/movie");
    }
  };

  const handleClick = (e) => {
    ref.current.click();
  };

  const handleClickImage = (e) => {
    imageRef.current.click();
  };

  const handleClickVideo = (e) => {
    videoRef.current.click();
  };

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {dialogData ? (
                <div class="col-sm-12 col-lg-12 mb-4 pr-0 pl-0">
                  <div class="iq-card ml-2">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px" }}
                        />

                        <h4 class="card-title my-0">{dialogData.title}</h4>
                      </div>
                    </div>
                    <div class="iq-card-body">
                      <ul
                        class="nav nav-pills mb-2 ml-0"
                        id="pills-tab"
                        role="tablist"
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
                  <div class="iq-card ml-2">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex align-items-center">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px", color: "#ffff" }}
                        />

                        <h4 class="card-title my-0">Insert Movie</h4>
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
                            to="/admin/movie/movie_form"
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
                            class="nav-link active"
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

              <div class="iq-header-title">
                {/* <h4 class="card-title mb-3">Movie</h4> */}
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="row my-4">
                    <div className="col-md-6 iq-item-product-left">
                      <div className="iq-image-container px-3">
                        <div className="iq-product-cover">
                          <div class="my-4">
                            <label className="float-left styleForTitle movieForm">
                              Title
                            </label>
                            {dialogData ? (
                              <>
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
                              </>
                            ) : (
                              <input
                                type="text"
                                name="title"
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
                            )}

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
                                    description: "Description is Required !",
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
                          <div className="row my-4">
                            <div className="col-md-6 my-2">
                              <label className="float-left styleForTitle movieForm">
                                Release Year
                              </label>

                              <input
                                type="date"
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
                              <label className="float-left">Runtime</label>
                              <input
                                type="number"
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

                                  if (e.target.value === "select type") {
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
                                <option value="select type">Select Type</option>
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
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
                          <div className="row my-4">
                            <div className="col-md-12 my-2 ">
                              <label
                                htmlFor="earning"
                                className="styleForTitle movieForm"
                              >
                                Region
                              </label>
                              <select
                                name="type"
                                className="form-control form-control-line minimal"
                                id="type"
                                value={country}
                                onChange={(e) => {
                                  setCountry(e.target.value);

                                  if (e.target.value === "Select Region") {
                                    return setError({
                                      ...error,
                                      country: "Movie Country is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      country: "",
                                    });
                                  }
                                }}
                              >
                                <option value="Select Region">
                                  Select Region
                                </option>
                                {countries.map((data, key) => {
                                  return (
                                    <>
                                      <option value={data._id} key={key}>
                                        {data.name}
                                      </option>
                                    </>
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
                              <label className="styleForTitle movieForm">
                                Genre
                              </label>
                              {dialogData ? (
                                <Multiselect
                                  options={genre} // Options to display in the dropdown
                                  selectedValues={dialogData?.genre} // Preselected value to persist in dropdown
                                  onSelect={onSelect} // Function will trigger on select event
                                  onRemove={onRemove} // Function will trigger on remove event
                                  displayValue="name" // Property name to display in the dropdown options
                                  id="css_custom"
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
                              ) : (
                                <Multiselect
                                  options={genre} // Options to display in the dropdown
                                  selectedValues={movieDetailsTmdb?.genre} // Preselected value to persist in dropdown
                                  onSelect={onSelect} // Function will trigger on select event
                                  onRemove={onRemove} // Function will trigger on remove event
                                  displayValue="name" // Property name to display in the dropdown options
                                  id="css_custom"
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
                              )}

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
                        borderLeft: "0.5px solid rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      <div className="product-additional-details my-4">
                        <div>
                          <label className=" movieForm">Thumbnail </label>

                          <div className="d-flex justify-content-center align-item-center">
                            {thumbnailPath ? (
                              <>
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
                                  src={showURL?.thumbnailImageShowImage}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                    borderRadius: "0.25rem",
                                    marginTop: 10,
                                    marginBottom: 30,
                                    height: 170,
                                    width: 170,
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                {showURL?.thumbnailImageShowImage ? (
                                  <img
                                    alt=""
                                    onClick={handleClick}
                                    src={showURL?.thumbnailImageShowImage}
                                    height="170"
                                    width="170"
                                    style={{
                                      // zIndex: "-1",
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                      borderRadius: "0.25rem",
                                    }}
                                  />
                                ) : (
                                  <div class="select_thumbnail">
                                    <i
                                      className="fas fa-plus"
                                      style={{
                                        paddingTop: 19,
                                        fontSize: 129,
                                        fontWeight: 400,
                                        color: "#4d848f",
                                      }}
                                    />

                                    <input
                                      autocomplete="off"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        transform: "scale(3.5)",
                                        opacity: 0,
                                      }}
                                      type="file"
                                      className="form-control"
                                      id="customFile"
                                      accept="image/png, image/jpeg ,image/jpg"
                                      Required=""
                                      onChange={thumbnailLoad}
                                      enctype="multipart/form-data"
                                    />
                                  </div>
                                )}
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
                        <div class="my-4 ml-3">
                          <label className=" movieForm">Image</label>

                          <div className="d-flex justify-content-center align-item-center">
                            {imagePath ? (
                              <>
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
                                <img
                                  onClick={handleClickImage}
                                  alt="app"
                                  src={showURL?.movieImageShowURL}
                                  style={{
                                    boxShadow:
                                      "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                    borderRadius: "0.25rem",

                                    width: "745px",
                                    height: "270px",
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                {showURL?.movieImageShowURL ? (
                                  <img
                                    alt=""
                                    src={showURL?.movieImageShowURL}
                                    onClick={handleClickImage}
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                      borderRadius: "0.25rem",
                                      width: "745px",
                                      height: "270px",
                                    }}
                                  />
                                ) : (
                                  <div class="select_image">
                                    <i
                                      className="fas fa-plus"
                                      style={{
                                        paddingTop: 56,
                                        fontSize: 165,
                                        fontWeight: 400,
                                        color: "#4d848f",
                                      }}
                                    />

                                    <input
                                      autocomplete="off"
                                      tabIndex="-1"
                                      style={{
                                        position: "absolute",
                                        top: 112,
                                        transform: "scale(3.5)",
                                        opacity: 0,
                                      }}
                                      type="file"
                                      className="form-control"
                                      id="customFile"
                                      accept="image/png, image/jpeg ,image/jpg"
                                      Required=""
                                      onChange={imageLoad}
                                    />
                                  </div>
                                )}
                              </>
                            )}

                            {/* ===== imagePath here ======= */}
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

                        <div class="my-4 ml-3">
                          <label
                            className="movieForm"
                            style={{ paddingTop: "1.5px", marginTop: "9px" }}
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
                                if (e.target.value === "select videoType") {
                                  return setError({
                                    ...error,
                                    videoType: "Video Type is Required!",
                                  });
                                } else {
                                  return setError({
                                    ...error,
                                    videoType: "",
                                  });
                                }
                              }}
                            >
                              <option value="select videoType">
                                {" "}
                                Select Video Type
                              </option>
                              <option value={0}>Youtube Url </option>
                              <option value={1}>m3u8 Url </option>
                              <option value={2}>MOV Url </option>
                              <option value={3}>MP4 Url</option>
                              <option value={4}>MKV Url</option>
                              <option value={5}>WEBM Url</option>
                              <option value={6}>Embed source</option>
                              <option value={7}>File (MP4/MOV/MKV/WEBM)</option>
                            </select>
                            {!videoType ? (
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
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div class="my-4 ml-3">
                          <label
                            className="movieForm"
                            style={{ marginTop: "14px" }}
                          >
                            Video URL
                          </label>
                          {dialogData ? (
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
                                  {!youtubeUrl && (
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
                                          m3u8Url: "m3u8 url is Required!",
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
                                          movUrl: "mov url is Required!",
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
                                        youtubeUrl
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
                                          mp4Url: "mp4 url is Required!",
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
                                          mkvUrl: "mkv url is Required!",
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
                                          webmUrl: "webm url is Required!",
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
                                          embedUrl: "embed url is Required!",
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
                                      src={showURL?.movieVideoShowURL}
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
                          ) : (
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
                                  {!youtubeUrl && (
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
                                          m3u8Url: "m3u8 url is Required!",
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
                                          movUrl: "mov url is Required!",
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
                                        youtubeUrl
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
                                          mp4Url: "mp4 url is Required!",
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
                                          mkvUrl: "mkv url is Required!",
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
                                          webmUrl: "webm url is Required!",
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
                                          embedUrl: "embed url is Required!",
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
                                      src={showURL?.movieVideoShowURl}
                                      style={{
                                        boxShadow:
                                          "rgb(101 146 173 / 34%) 0px 0px 0px 1.2px",
                                        borderRadius: 10,
                                        marginTop: 10,
                                        float: "left",
                                      }}
                                    />
                                    {loading && <div className="loader" />}
                                    {/* Show the loader when loading is true */}

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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 pr-0 pl-0 mt-4">
                    <h4 className="px-2">Trailer</h4>
                    <div className="modal-body pt-1 px-0 pb-3">
                      <div
                        className="d-flex flex-column pr-4 pl-0"
                        style={{
                          border: "0.5px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: "10px",
                        }}
                      >
                        <form>
                          <div className="form-group">
                            <div className="row my-4 ml-3">
                              <div className="col-md-6 my-2 ">
                                <label className="float-left styleForTitle">
                                  Trailer Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="Name"
                                  className="form-control form-control-line"
                                  required
                                  value={trailerName}
                                  onChange={(e) => {
                                    setTrailerName(e.target.value);

                                    if (!e.target.value) {
                                      return setError({
                                        ...error,
                                        trailerName:
                                          "Trailer Name is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        trailerName: "",
                                      });
                                    }
                                  }}
                                />
                                {error.trailerName && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.trailerName}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-6 my-2 styleForTitle">
                                <label
                                  className="movieForm"
                                  style={{ paddingTop: "1.5px" }}
                                >
                                  Trailer Video Type
                                </label>
                                <div>
                                  <select
                                    id="contentType"
                                    name="contentType"
                                    class="form-control form-control-line"
                                    required
                                    value={trailerVideoType}
                                    onChange={(e) => {
                                      setTrailerVideoType(e.target.value);
                                      if (
                                        e.target.value ===
                                        "select trailerVideoType"
                                      ) {
                                        return setError({
                                          ...error,
                                          trailerVideoType:
                                            "Video Type is Required!",
                                        });
                                      } else {
                                        return setError({
                                          ...error,
                                          trailerVideoType: "",
                                        });
                                      }
                                    }}
                                  >
                                    <option value="select trailerVideoType">
                                      Select Trailer Video Type
                                    </option>
                                    <option value={0}>Youtube Url </option>
                                    <option value={1}>
                                      File (MP4/MOV/MKV/WEBM)
                                    </option>
                                  </select>
                                  {error.trailerVideoType && (
                                    <div className="pl-1 text-left">
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        style={{
                                          fontFamily: "Circular-Loom",
                                          color: "#ee2e47",
                                        }}
                                      >
                                        {error.trailerVideoType}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row my-4 ml-3">
                              {" "}
                              <div className="col-md-6 my-2 styleForTitle">
                                <label className="float-left styleForTitle">
                                  Image
                                </label>
                                <input
                                  type="file"
                                  id="customFile"
                                  className="form-control"
                                  accept="image/png, image/jpeg ,image/jpg"
                                  Required=""
                                  onChange={trailerImageLoad}
                                />
                                {trailerImage.length === 0 && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.trailerImage}
                                    </Typography>
                                  </div>
                                )}

                                <>
                                  {showURL?.trailerImageShowURL && (
                                    <img
                                      height="100px"
                                      width="100px"
                                      alt="app"
                                      src={showURL?.trailerImageShowURL}
                                      style={{
                                        boxShadow:
                                          "rgb(101 146 173 / 34%) 0px 0px 0px 1.2px",
                                        borderRadius: 10,
                                        marginTop: 10,
                                        float: "left",
                                      }}
                                    />
                                  )}

                                  <div
                                    className="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  ></div>
                                </>
                                {/* )} */}
                              </div>
                              <div className="col-md-6 my-2 styleForTitle">
                                <label htmlFor="earning ">
                                  Trailer Video URL
                                </label>
                                <div>
                                  {trailerVideoType == 0 && (
                                    <>
                                      <input
                                        type="text"
                                        placeholder="Link"
                                        class="form-control "
                                        value={trailerVideoUrl}
                                        onChange={(e) => {
                                          setTrailerVideoUrl(e.target.value);
                                          if (!e.target.value) {
                                            return setError({
                                              ...error,
                                              trailerVideoUrl:
                                                "Trailer Video URL is Required!",
                                            });
                                          } else {
                                            return setError({
                                              ...error,
                                              trailerVideoUrl: "",
                                            });
                                          }
                                        }}
                                      />
                                      {error.trailerVideoUrl && (
                                        <div className="pl-1 text-left">
                                          <Typography
                                            variant="caption"
                                            color="error"
                                            style={{
                                              fontFamily: "Circular-Loom",
                                              color: "#ee2e47",
                                            }}
                                          >
                                            {error.trailerVideoUrl}
                                          </Typography>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {trailerVideoType == 1 && (
                                    <>
                                      <input
                                        type="file"
                                        id="customFile"
                                        className="form-control"
                                        accept="video/*"
                                        required=""
                                        onChange={trailerVideoLoad}
                                      />
                                      {showURL?.trailerVideoShowURL ? (
                                        <>
                                          <video
                                            height="100px"
                                            width="100px"
                                            controls
                                            alt="app"
                                            src={showURL?.trailerVideoShowURL}
                                            style={{
                                              boxShadow:
                                                "rgb(101 146 173 / 34%) 0px 0px 0px 1.2px",
                                              borderRadius: 10,
                                              marginTop: 10,
                                              float: "left",
                                            }}
                                          />
                                          {loading && (
                                            <div className="loader" />
                                          )}
                                          <div
                                            class="img-container"
                                            style={{
                                              display: "inline",
                                              position: "relative",
                                              float: "left",
                                            }}
                                          ></div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="pl-1 text-left">
                                            <Typography
                                              variant="caption"
                                              color="error"
                                              style={{
                                                fontFamily: "Circular-Loom",
                                                color: "#ee2e47",
                                              }}
                                            >
                                              {error.trailerVideo}
                                            </Typography>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row my-4 ml-3">
                              <div className="col-md-12 my-2">
                                <label className="float-left styleForTitle movieForm">
                                  Trailer Type
                                </label>
                                <select
                                  type="text"
                                  placeholder="Trailer Name"
                                  className="form-control form-control-line"
                                  Required
                                  value={trailerType}
                                  onChange={(e) => {
                                    setTrailerType(e.target.value);

                                    if (
                                      e.target.value === "select Trailer Type"
                                    ) {
                                      return setError({
                                        ...error,
                                        trailerType:
                                          "Trailer Name is Required!",
                                      });
                                    } else {
                                      return setError({
                                        ...error,
                                        trailerType: "",
                                      });
                                    }
                                  }}
                                >
                                  <option value="select Trailer Type">
                                    Select Trailer Type
                                  </option>
                                  <option value="trailer">Trailer</option>
                                  <option value="teaser">Teaser </option>
                                  <option value="clip">Clip </option>
                                </select>
                                {error.trailerType && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      style={{
                                        fontFamily: "Circular-Loom",
                                        color: "#ee2e47",
                                      }}
                                    >
                                      {error.trailerType}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <DialogActions className="mb-3  mr-2">
                    {dialogData ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm px-3 py-1 mt-4"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success btn-sm px-3 py-1 mt-4"
                        onClick={handleSubmit}
                      >
                        Insert
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm px-3 py-1 mt-4"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </DialogActions>
                  {/* <UploadProgress data={data} movieId={movieId} /> */}
                  <UploadProgressManual data={data} />
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
  setUploadFileManual,
  getGenre,
  getRegion,
  getTeamMember,
  updateMovie,
  loadMovieData,
  createManual,
})(MovieDialog);
