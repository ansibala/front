import React, { useState, useEffect } from "react";

//react-router-dom
import { useHistory, useLocation } from "react-router-dom";

// material-ui
import { DialogActions, Typography } from "@material-ui/core";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";

//action
import { getMovie } from "../../store/Movie/movie.action";
import {
  insertTrailer,
  updateTrailer,
} from "../../store/Trailer/trailer.action";

//alert
import { permissionError } from "../../Util/Alert";
import { covertURl, uploadFile } from "../../Util/AwsFunction";

const TrailerForm = (props) => {
  const history = useHistory();
  const movieTitle = localStorage.getItem("movieTitle");
  const trailerId = JSON.parse(localStorage.getItem("trailerId"));
  //Get Data from Local Storage
  const dialogData = JSON.parse(localStorage.getItem("updateTrailerData"));
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [video, setVideo] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [movie, setMovie] = useState("");
  const [videoType, setVideoType] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [showURL, setShowURL] = useState({
    trailerImageShowURL: "",
    trailerVideoShowURL: "",
  });
  const [resURL, setResURL] = useState({
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });
  const [error, setError] = useState({
    name: "",
    type: "",
    video: "",
    videoUrl: "",
    videoType: "",
    movie: "",
    image: "",
  });

  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData1"));

  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const { movie: movieList } = useSelector((state) => state.movie);

  // useEffect(() => {
  //   setName("");
  //   setType("");
  //   setVideoUrl("");
  //   setVideoType("");
  //   setVideo("");
  //   setVideoPath("");
  //   setMovie("");
  //   setImagePath("");
  //   setError({
  //     name: "",
  //     movie: "",
  //     videoUrl: "",
  //     videoType: "",
  //     video: "",
  //     videoPath: "",
  //     image: "",
  //   });
  // }, []);

  //Set Value For Update
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (tmdbId?.IMDBid == null && tmdbId?.TmdbMovieId == null) {
      const fileNameWithExtensionThumbnail = dialogData?.trailerImage
        ?.split("/")
        .pop();
      const { imageURL: trailerImage } = await covertURl(
        "trailerImage/" + fileNameWithExtensionThumbnail
      );
      const fileNameWithExtensionImage = dialogData?.videoUrl?.split("/").pop();
      const { imageURL: videoUrl } = await covertURl(
        "trailerVideo/" + fileNameWithExtensionImage
      );
      setShowURL({
        trailerImageShowURL: trailerImage,
        trailerVideoShowURL: videoUrl,
      });
    } else {
      setShowURL({
        trailerImageShowURL: dialogData?.trailerImage,
        trailerVideoShowURL: dialogData?.videoUrl,
      });
    }
    setName(dialogData?.name);
    setType(dialogData?.type);
    setMongoId(dialogData?._id);
    setMovie(dialogData?.movieId);
    setVideoType(dialogData?.videoType);

    if (dialogData?.videoType == 0) {
      setVideoUrl(dialogData?.videoUrl);
    }
  };

  //useEffect for getmovie
  useEffect(() => {
    props.getMovie();
  }, []);

  //Insert Data
  const insertSubmit = () => {

    if (
      !name ||
      !type ||
      type === "select Trails" ||
      videoType == "select"
    ) {
      const error = {};
      if (!name) error.name = "Name is Required !";
      if (videoType == "select" )
        error.videoType = "Video0 Type is Required";

      if (!videoType) {
        if (!videoUrl) {
          error.videoUrl = "Youtube URL is Required !";
        }
      } else if (videoType == 1) {
        if (video.length === 0 && !videoPath) {
          error.video = "Video is Required !";
        }
      }

      if (!type || type === "select Trails") error.type = "Type is Required !";

      if (!showURL?.trailerImageShowURL) error.image = "Image is Require !";

      return setError({ ...error });
    } else {
      if (!hasPermission) return permissionError();

      if (dialogData) {
        if (resURL?.trailerImageResURL || resURL?.trailerVideoResURL) {
          const objData = {
            name,
            type,
            videoType,
            movie: trailerId._id,
            trailerImage: resURL?.trailerImageResURL,
            videoUrl: videoType == 0 ? videoUrl : resURL?.trailerVideoResURL,
          };
          props.updateTrailer(objData, dialogData?._id);
        } else {
          const objData = {
            name,
            type,
            videoType,
            movie: trailerId._id,
          };

          props.updateTrailer(objData, dialogData?._id);
          localStorage.removeItem("updateTrailerData");
        }
      } else {
        const objData = {
          name,
          type,
          videoType,
          movie: trailerId._id,
          trailerImage: resURL?.trailerImageResURL,
          videoUrl: videoType == 0 ? videoUrl : resURL?.trailerVideoResURL,
        };
        props.insertTrailer(objData);
      }

      history.push("/admin/movie/trailer");
    }
  };
  //Empty Data After Insertion

  let folderStructureTrailerImage = "mova/trailerImage";
  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    setImagePath(URL.createObjectURL(event.target.files[0]));
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerImage
    );

    setResURL({ ...resURL, trailerImageResURL: resDataUrl });
    setShowURL({ ...showURL, trailerImageShowURL: imageURL });
    console.log("showURL", showURL);
  };

  let folderStructureTrailerVideo = "mova/trailerVideo";
  //Video Load
  const videoLoad = async (event) => {
    setVideo(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerVideo
    );

    setResURL({ ...resURL, trailerVideoResURL: resDataUrl });
    setShowURL({ ...showURL, trailerVideoShowURL: imageURL });
  };

  //Close Dialog
  const handleClose = () => {
    localStorage.removeItem("updateTrailerData");
    history.replace("/admin/movie/trailer");
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
            <div class="row">
              <div class="col-12">
                <div class="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
                  <h4 class="ml-3">Trailer </h4>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                      <form>
                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-12 my-2 ">
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
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.name}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12 my-2 styleForTitle">
                              <label className="float-left">Type</label>
                              <select
                                type="text"
                                className="form-control form-control-line"
                                value={type}
                                onChange={(e) => {
                                  setType(e.target.value);

                                  if (e.target.value === "select Trails") {
                                    return setError({
                                      ...error,
                                      type: "Trailer Type is Required!",
                                    });
                                  } else {
                                    return setError({
                                      ...error,
                                      type: "",
                                    });
                                  }
                                }}
                              >
                                <option value="select Trails">
                                  Select Type
                                </option>
                                <option value="trailer">Trailer</option>
                                <option value="teaser">Teaser </option>
                                <option value="clip">Clip </option>
                              </select>

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
                          </div>

                          <div className="row">
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Movie</label>

                              <input
                                type="text"
                                placeholder="Name"
                                className="form-control form-control-line"
                                required
                                value={movieTitle}
                                readOnly
                              />
                              {error.movie && (
                                <div className="pl-1 text-left">
                                  <Typography
                                    variant="caption"
                                    color="error"
                                    style={{
                                      fontFamily: "Circular-Loom",
                                      color: "#ee2e47",
                                    }}
                                  >
                                    {error.movie}
                                  </Typography>
                                </div>
                              )}
                            </div>
                            <div className="col-md-6 my-2 styleForTitle">
                              <label
                              // className="movieForm"
                              // style={{ paddingTop: "1.5px" }}
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
                                    if (e.target.value === "select") {
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
                                  <option value="select">
                                    Select Video Type
                                  </option>
                                  <option value="0">Youtube Url </option>
                                  <option value="1">
                                    File (MP4/MOV/MKV/WEBM)
                                  </option>
                                </select>
                                {error.videoType && (
                                  <div className="pl-1 text-left">
                                    <Typography
                                      variant="caption"
                                      color="error"
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
                          </div>

                          <div className="row">
                            <div className="col-md-6 my-2">
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
                                    color="error"
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

                              {showURL?.trailerImageShowURL &&
                                (console.log(
                                  "showURL?.trailerImageShowURL",
                                  showURL?.trailerImageShowURL
                                ),
                                (
                                  <>
                                    <img
                                      height="100px"
                                      width="100px"
                                      alt="app"
                                      src={showURL?.trailerImageShowURL}
                                      style={{
                                        boxShadow:
                                          "rgb(101 132 173 / 35%) 0px 0px 0px 1.2px;",
                                        borderRadius: 10,
                                        marginTop: 10,
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
                                ))}
                            </div>
                            <div className="col-md-6 my-2 styleForTitle">
                              <label htmlFor="earning ">Video URL</label>
                              <div>
                                {videoType == 0 && (
                                  <>
                                    <input
                                      type="text"
                                      // id="link"
                                      placeholder="Link"
                                      class="form-control "
                                      value={videoUrl}
                                      onChange={(e) => {
                                        setVideoUrl(e.target.value);
                                        if (e.target.value) {
                                          return setError({
                                            ...error,
                                            videoUrl: "Link Is Reburied",
                                          });
                                        } else {
                                          return setError({
                                            ...error,
                                            videoUrl: "",
                                          });
                                        }
                                      }}
                                    />
                                  </>
                                )}
                                {videoType == 1 && (
                                  <>
                                    <input
                                      type="file"
                                      id="customFile"
                                      className="form-control"
                                      accept="video/*"
                                      required=""
                                      onChange={videoLoad}
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
                                            {error.video}
                                          </Typography>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogActions>
                          {dialogData ? (
                            <button
                              type="button"
                              className="btn btn-success btn-sm px-3 py-1"
                              onClick={insertSubmit}
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-success btn-sm px-3 py-1"
                              onClick={insertSubmit}
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
  insertTrailer,
  updateTrailer,
  getMovie,
})(TrailerForm);
