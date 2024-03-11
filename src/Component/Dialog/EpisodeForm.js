import React, { useState, useEffect } from "react";

//react-router-dom
import { Link, useHistory } from "react-router-dom";

// material-ui
import { DialogActions, Typography } from "@material-ui/core";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
       
//action
import { getMovieCategory } from "../../store/Movie/movie.action";
import { getSeason } from "../../store/Season/season.action";
import {
  insertEpisode,
  updateEpisode,
} from "../../store/Episode/episode.action";

//component
import EpisodeUploadProgress from "../../Pages/EpisodeUploadProgress";
import { setUploadFile } from "../../store/Episode/episode.action";

//Alert
import { permissionError } from "../../Util/Alert";
import { covertURl, uploadFile } from "../../Util/AwsFunction";
import { baseURL, devKey } from "../../Util/ServerPath";
import { Toast } from "../../Util/Toast_";

const EpisodeForm = (props) => {
  const history = useHistory();

  //Get Data from Local Storage
  const dialogData = JSON.parse(localStorage.getItem("updateEpisodeData"));

  const dialogData_ = JSON.parse(localStorage.getItem("updateMovieData"));
  console.log("dialogData", dialogData);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  const [name, setName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [movies, setMovies] = useState("");
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [mongoId, setMongoId] = useState("");
  const [videoType, setVideoType] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");
  const [movUrl, setMovUrl] = useState("");
  const [mp4Url, setMp4Url] = useState("");
  const [mkvUrl, setMkvUrl] = useState("");
  const [webmUrl, setWebmUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [update, setUpdate] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    episodeNumber: "",
    name: "",
    seasonNumber: "",
    // video: "",
    movies: "",
    image: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
  });
  const [data, setData] = useState({
    episodeNumber: "",
    name: "",
    seasonNumber: "",
    movies: "",
    image: "",
    videoType: "",
    youtubeUrl: "",
    m3u8Url: "",
    movUrl: "",
    mp4Url: "",
    mkvUrl: "",
    webmUrl: "",
    embedUrl: "",
  });

  const [resURL, setResURL] = useState({
    episodeImageResURL: "",
    episodeVideoResURL: "",
  });

  const movieTitle = localStorage.getItem("seriesTitle");
  const tvSeriesId = sessionStorage.getItem("tvSeriesId");

  //get movie data from movie
  const [movieData, setMovieData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    props.getMovieCategory();
  }, []);

  //call the movie
  const { movie } = useSelector((state) => state.movie);

  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  //get tv series season from season
  const [seasonData, setSeasonData] = useState([]);

  //useEffect for getmovie
  useEffect(() => {
    props.getSeason(dialogData_._id);
  }, []);

  //call the season
  const { season } = useSelector((state) => state.season);

  useEffect(() => {
    setSeasonData(season);
  }, [season]);

  //Empty Data After Insertion
  useEffect(() => {
    setName("");
    setEpisodeNumber("");
    setSeasonNumber("");
    setVideo([]);
    setVideoPath("");
    setMovies("");
    setImagePath("");
    setVideoType("");
    setError({
      name: "",
      episodeNumber: "",
      seasonNumber: "",
      movies: "",
      video: "",
      // videoPath: "",
      image: "",
      videoType: "",
    });
  }, []);

  const fetchData = async () => {
    if (dialogData?.IMDBid == null && dialogData?.TmdbMovieId == null) {
      const fileNameWithExtensionImage = dialogData?.image?.split("/").pop();
      const { imageURL } = await covertURl(
        "episodeImage/" + fileNameWithExtensionImage
      );

      setImagePath(imageURL);
    } else {
      setImagePath(dialogData?.image);
    }

    if (dialogData?.videoType === 7) {
      const fileNameWithExtensionVideoLink = dialogData?.videoUrl
        ?.split("/")
        .pop();
      const { imageURL } = await covertURl(
        "episodeVideo/" + fileNameWithExtensionVideoLink
      );

      setVideoPath(imageURL);
    }
  };

  //Set Value For Update
  useEffect(() => {
    if (dialogData) {
      setEpisodeNumber(dialogData.episodeNumber);
      setName(dialogData.name);
      setSeasonNumber(dialogData.season);
      setMongoId(dialogData._id);
      setMovies(dialogData.movieId);
      setVideoPath(dialogData.videoUrl);
      setImagePath(dialogData.image);
      setVideoType(dialogData.videoType);
      if (dialogData.videoType == 0) {
        setYoutubeUrl(dialogData.videoUrl);
      } else if (dialogData.videoType == 1) {
        setM3u8Url(dialogData.videoUrl);
      } else if (dialogData.videoType == 2) {
        setMovUrl(dialogData.videoUrl);
      } else if (dialogData.videoType == 3) {
        setMp4Url(dialogData.videoUrl);
      } else if (dialogData.videoType == 4) {
        setMkvUrl(dialogData.videoUrl);
      } else if (dialogData.videoType == 5) {
        setWebmUrl(dialogData.videoUrl);
      } else if (dialogData.videoType == 6) {
        setEmbedUrl(dialogData.videoUrl);
      }
      fetchData();

      const interval = setInterval(fetchData, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, []);

  let folderStructureMovieVideo = "mova/episodeVideo";


  const videoLoad = async (event) => {

    setVideo(event.target.files[0]);
    // try {
    const formData = new FormData();
    formData.append("folderStructure", folderStructureMovieVideo);
    formData.append("keyName", event.target.files[0]?.name);
    formData.append("content", event.target.files[0]);
    const uploadUrl = baseURL + `file/upload-file`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);
    xhr.upload.onprogress = (event) => {
      const progress = (event.loaded / event.total) * 100;
      setUploadProgress(progress);
      setLoading(true);
      if (progress === 100) {
        xhr.onload = async () => {
          if (xhr.status === 200) {
            try {
              const responseData = JSON?.parse(xhr.responseText);
              setResURL({ ...resURL, episodeVideoResURL: responseData?.url });

              if (responseData?.status) {
                setLoading(false);
                Toast("success", "successfully Video Upload");
                const fileNameWithExtension = responseData?.url
                  .split("/")
                  .pop();

                const fetchData = async () => {
                  try {
                    const { imageURL } = await covertURl(
                      "episodeVideo/" + fileNameWithExtension
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
  


  

  //Insert Data
  const handleSubmit = (e) => {
    if (!hasPermission) return permissionError();
    if (!name || !episodeNumber || !imagePath) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (!episodeNumber) error.episodeNumber = "Episode Number is Required !";
      // if (!movies) error.movies = "Movie is Required !";
      if (image.length === 0 || !imagePath) error.image = "Image is Require !";
      if (!seasonNumber) error.seasonNumber = "Season is Required !";
      if (!videoType) error.videoType = "Video Type is required !";

      if (videoType == 0) {
        if (!youtubeUrl) error.youtubeUrl = "You tube Url is required !";
      } else if (videoType == 1) {
        if (!m3u8Url) error.m3u8Url = "m3u8 Url is required !";
      } else if (videoType == 2) {
        if (!movUrl) error.movUrl = "Mov Url is required !";
      } else if (videoType == 3) {
        if (!mp4Url) error.mp4Url = "mp4 Url is required !";
      } else if (videoType == 4) {
        if (!mkvUrl) error.mkvUrl = "mkv Url is required !";
      } else if (videoType == 5) {
        if (!webmUrl) error.webmUrl = "webm Url is required !";
      } else if (videoType == 6) {
        if (!embedUrl) error.embedUrl = "embed Url is required !";
      } else if (videoType == 7) {
        if (video.length === 0) error.video = "Video is Required !";
      }

      return setError({ ...error });
    } else {
      let url =
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
          : videoType == 6 && embedUrl;

      isValidURL(url);

      const objData = {
        movieId: tvSeriesId,
        name,
        episodeNumber,
        season: seasonNumber,
        videoType,
        image: resURL?.episodeImageResURL,
        videoUrl:
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
            : resURL?.episodeVideoResURL,
      };

      props.insertEpisode(objData);

      setTimeout(() => {
        history.push({
          pathname: "/admin/episode",
          state: data,
        });
      }, 3000);
    }
  };

  const isValidURL = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  //Update Function
  const updateSubmit = () => {
    if (!hasPermission) return permissionError();
    if (
      !name ||
      !seasonNumber ||
      !movies ||
      !imagePath ||
      !episodeNumber ||
      episodeNumber < 0
    ) {
      const error = {};

      if (!name) error.name = "Name is Required !";
      if (!episodeNumber) error.episodeNumber = "Episode Number is Required !";
      if (episodeNumber < 0) error.episodeNumber = "Episode Number Invalid !";
      if (!seasonNumber) error.seasonNumber = "Season is Required !";
      if (!movies) error.movies = "Movie is Required !";
      if (!imagePath) error.image = "Image is Require !";
      if (videoType == 7) {
        if (video.length === 0) error.video = "Video is Required !";
      }

      return setError({ ...error });
    }
    const objData = {
      movieId: tvSeriesId,
      name,
      episodeNumber,
      season: seasonNumber,
      videoType,
      image: resURL?.episodeImageResURL,
      videoUrl:
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
          : resURL?.episodeVideoResURL,
    };

    props.updateEpisode(objData, mongoId);
    localStorage.removeItem("updateEpisodeData");
    history.push("/admin/episode");
  };

  // Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateEpisodeData");
    history.replace("/admin/episode");
  };

  let folderStructureMovieImage = "mova/episodeImage";
  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL({ ...resURL, episodeImageResURL: resDataUrl });

    setImagePath(imageURL);
  };

  return (
    <>
      <div
        id="content-page"
        class="content-page"
        style={{ marginRight: "0px" }}
      >
        <div class="container-fluid">
          <div class="row">
            {/* <!-- start page title --> */}
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                  <h4 class="ml-3">Episode</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title --> */}

            <div className="col-lg-12">
              <div className="card mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-6 my-2 ">
                              <label className="float-left styleForTitle">
                                Episode No.
                              </label>
                              <input
                                type="number"
                                min="1"
                                placeholder="1"
                                className="form-control form-control-line"
                                required
                                value={episodeNumber}
                                onChange={(e) => {
                                  setEpisodeNumber(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      episodeNumber:
                                        "Episode Number is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      episodeNumber: "",
                                    });
                                  }
                                }}
                              />
                              {error.episodeNumber && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.episodeNumber}
                                  </Typography>
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 my-2 ">
                              <label className="float-left styleForTitle">
                                Name
                              </label>
                              <input
                                type="text"
                                placeholder="Name"
                                className="form-control form-control-line"
                                required
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      name: "Name is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      name: "",
                                    });
                                  }
                                }}
                              />
                              {error.name && (
                                <div className="pl-1 text-left">
                                  {error.name && (
                                    <span className="error">{error.name}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Web Series</label>

                              <input
                                type="text"
                                placeholder="Name"
                                className="form-control form-control-line"
                                value={movieTitle}
                              />
                              {error.movies && (
                                <div className="pl-1 text-left">
                                  {error.movies && (
                                    <span className="error">
                                      {error.movies}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Season</label>
                              <select
                                name="session"
                                value={seasonNumber}
                                className="form-control "
                                onChange={(e) => {
                                  setSeasonNumber(e.target.value);

                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      seasonNumber: "Season is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      seasonNumber: "",
                                    });
                                  }
                                }}
                              >
                                <option>Select Season</option>
                                {seasonData.map((data, key) => {
                                  return (
                                    <>
                                      <option value={data?._id}>
                                        {data?.seasonNumber}
                                      </option>
                                    </>
                                  );
                                })}
                              </select>
                              {error.seasonNumber && (
                                <div className="pl-1 text-left">
                                  {error.seasonNumber && (
                                    <span className="error">
                                      {error.seasonNumber}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Video Type</label>
                              <select
                                id="contentType"
                                name="contentType"
                                class="form-control form-control-line"
                                required
                                value={videoType}
                                onChange={(e) => {
                                  setVideoType(e.target.value);
                                  if (!e.target.value) {
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
                                <option>Select Video Type</option>
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
                              {error.videoType && (
                                <div className="pl-1 text-left">
                                  {error.videoType && (
                                    <span className="error">
                                      {error.videoType}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Video URL</label>
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
                                              "You tube URL is Required!",
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
                                        {error.youtubeUrl && (
                                          <span className="error">
                                            {error.youtubeUrl}
                                          </span>
                                        )}
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
                                            m3u8Url: "m3u8 URL is Required!",
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
                                        {error.m2u8Url && (
                                          <span className="error">
                                            {error.m2u8Url}
                                          </span>
                                        )}
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
                                            movUrl: "mov URL is Required!",
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
                                        {error.movUrl && (
                                          <span className="error">
                                            {error.movUrl}
                                          </span>
                                        )}
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
                                            mp4Url: "mp4 URL is Required!",
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
                                        {error.mp4Url && (
                                          <span className="error">
                                            {error.mp4Url}
                                          </span>
                                        )}
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
                                            mkvUrl: "mkv URL is Required!",
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
                                            webmUrl: "webm URL is Required!",
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
                                            embedUrl: "embed URL is Required!",
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
                                      // id="dVideo"
                                      className="form-control"
                                      accept="video/*"
                                      required=""
                                      onChange={videoLoad}
                                    />
                                    {videoPath &&
                                      (console.log("videoPath", videoPath),
                                      (
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
                                      ))}
                                    {error.youtubeUrl && (
                                      <div className="pl-1 text-left">
                                        <Typography
                                          variant="caption"
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
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12 my-2">
                              <label className="float-left styleForTitle">
                                Image
                              </label>
                              <input
                                type="file"
                                id="customFile"
                                className="form-control"
                                accept="image/png, image/jpeg ,image/jpg"
                                Required=""
                                onChange={imageLoad}
                              />
                              {image.length === 0 ? (
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

                              {imagePath && (
                                <>
                                  <img
                                    height="100px"
                                    width="100px"
                                    alt="app"
                                    src={imagePath}
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
                                    className="img-container"
                                    style={{
                                      display: "inline",
                                      position: "relative",
                                      float: "left",
                                    }}
                                  ></div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <DialogActions>
                          {dialogData ? (
                            <button
                              type="button"
                              className="btn btn-success btn-sm px-3 py-1"
                              onClick={updateSubmit}
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-success btn-sm px-3 py-1"
                              onClick={handleSubmit}
                            >
                              Insert
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm px-3 py-1"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                        </DialogActions>
                        <EpisodeUploadProgress
                          data={data}
                          mongoId={mongoId}
                          update={update}
                        />
                      </form>
                    </div>
                  </div>
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
  setUploadFile,
  insertEpisode,
  updateEpisode,
  getSeason,
  // getMovie,
  getMovieCategory,
})(EpisodeForm);
