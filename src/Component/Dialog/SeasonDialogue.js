import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { CLOSE_SEASON_DIALOG } from "../../store/Season/season.type";
import {
  updateSeason,
  CreateSeason,
  getSeason,
} from "../../store/Season/season.action";
import { getMovieCategory } from "../../store/Movie/movie.action";

//Alert
import { permissionError } from "../../Util/Alert";
import { covertURl, uploadFile } from "../../Util/AwsFunction";

const SeasonDialogue = (props) => {
  const {
    dialog: open,
    dialogData,
    season,
  } = useSelector((state) => state.season);
  const { movie: movieList } = useSelector((state) => state.movie);
  const movieTitle = localStorage.getItem("seriesTitle");
  const tvSeriesId = sessionStorage.getItem("tvSeriesId");

  const tmdbId = JSON.parse(localStorage.getItem("updateMovieData"));
  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const [name, setName] = useState("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [episodeCount, setEpisodeCount] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [movie, setMovie] = useState("");
  const [resUrl, setResUrl] = useState("");

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch({ type: CLOSE_SEASON_DIALOG });
  };

  //useEffect for getmovie
  useEffect(() => {
    props.getMovieCategory();
  }, []);

  useEffect(
    () => () => {
      setName("");
      setEpisodeCount("");
      setReleaseDate("");
      setImage("");
      setImagePath("");
      setSeasonNumber("");
      setMovie("");
      setError({
        releaseDate: "",
        episodeCount: "",
        seasonNumber: "",
        movie: "",
        image: "",
      });
    },
    [open]
  );
  useEffect(() => {
    if (tmdbId.IMDBid == null && tmdbId.TmdbMovieId == null) {
      const fetchData = async () => {
        const fileNameWithExtensionThumbnail = dialogData?.image
          ?.split("/")
          .pop();
        const { imageURL } = await covertURl(
          "seasonImage/" + fileNameWithExtensionThumbnail
        );

        setImagePath(imageURL);
      };
      fetchData();
    } else {
      setImagePath(dialogData?.image);
    }

    setName(dialogData?.name);
    setName(dialogData?.name);
    setEpisodeCount(dialogData?.episodeCount);
    setReleaseDate(dialogData?.releaseDate);
    setSeasonNumber(dialogData?.seasonNumber);
    setMovie(dialogData?.movie?._id);
  }, [dialogData]);

  const submitUpdate = () => {
    if (!hasPermission) return permissionError();
    if (
      !releaseDate ||
      !episodeCount ||
      episodeCount < 0 ||
      !seasonNumber ||
      seasonNumber < 0 ||
      !name ||
      movie === "selectSeries"
    ) {
      const error = {};
      if (!name) error.name = "Name IS Required !";
      if (!releaseDate) error.releaseDate = "Release Date Is Required !";
      if (!episodeCount) error.episodeCount = "episodeCount Is Required !";
      if (episodeCount < 0) error.episodeCount = "Episode Count Is Invalid  !";
      if (!seasonNumber) error.seasonNumber = "season Number Is Required !";
      if (seasonNumber < 0) error.seasonNumber = "season Number  Is Invalid  !";
      if (image.length === 0) error.image = "Image Is Required !";

      error.movie = "Series Is Required !";
      return setError({ ...error });
    } else {
      if (dialogData) {
        if (resUrl) {
          
          let objData = {
            name,
            seasonNumber,
            episodeCount,
            releaseDate,
            movieId: tmdbId?._id,
            image: resUrl,
          };
          props.updateSeason(objData, dialogData._id);
        } else {
          let objData = {
            name,
            seasonNumber,
            episodeCount,
            releaseDate,
            movieId: tmdbId?._id,
          };
          props.updateSeason(objData, dialogData._id);
        }
      } else {
        
        let objData = {
          name,
          seasonNumber,
          episodeCount,
          releaseDate,
          movieId: tmdbId?._id,
          image: resUrl,
        };
        props.CreateSeason(objData);
      }

      handleClose();
    }
  };
  //  Image Load fffff

  let folderStructureMovieImage = "mova/seasonImage";
  const imageLoad = async (event) => {
    
    setImage(event.target.files[0]);

    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResUrl(resDataUrl);
    setImagePath(imageURL);
  };
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Season</h5> : <h5>Add Season</h5>}
        </DialogTitle>

        <Tooltip title="Close">
          <Cancel
            className="cancelButton"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>
        {/* </IconButton> */}
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Name</label>
                      <input
                        type="text"
                        placeholder="Name"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: "name is Required!",
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
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Season Number
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="02"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={seasonNumber}
                        onChange={(e) => {
                          setSeasonNumber(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              seasonNumber: "season Number is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              seasonNumber: "",
                            });
                          }
                        }}
                      />
                      {error.seasonNumber && (
                        <div className="pl-1 text-left">
                          {error.seasonNumber && (
                            <span className="error">{error.seasonNumber}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Episode Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={episodeCount}
                        onChange={(e) => {
                          setEpisodeCount(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              episodeCount: "EpisodeCount is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              episodeCount: "",
                            });
                          }
                        }}
                      />
                      {error.episodeCount && (
                        <div className="pl-1 text-left">
                          {error.episodeCount && (
                            <span className="error">{error.episodeCount}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">
                        Release Date
                      </label>
                      <input
                        type="date"
                        placeholder="YYYY-MM-DD"
                        // className="form-control form-control-line"
                        className="form-control"
                        required
                        value={releaseDate}
                        onChange={(e) => {
                          setReleaseDate(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              releaseDate: "Release Date is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              releaseDate: "",
                            });
                          }
                        }}
                      />
                      {error.releaseDate && (
                        <div className="pl-1 text-left">
                          {error.releaseDate && (
                            <span className="error">{error.releaseDate}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label htmlFor="earning ">Web Series</label>
                      {/* <select
                        name="session"
                        value={movie}
                        className="form-control"
                        onChange={(e) => {
                          setMovie(e.target.value);
                          if (
                            !e.target.value ||
                            e.target.value === "selectSeries"
                          ) {
                            return setError({
                              ...error,
                              movie: "Series is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              movie: "",
                            });
                          }
                        }}
                      >
                        <option>--Select Series--</option>

                        <option value={tvSeriesId}>{movieTitle}</option>
                      </select> */}{" "}
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control form-control-line"
                        value={movieTitle}
                      />
                      {/* {error.movie && (
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
                      )} */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle">Image</label>
                      <input
                        type="file"
                        id="customFile"
                        className="form-control pt-0 pl-0 pb-0"
                        accept="image/png, image/jpeg ,image/jpg"
                        required=""
                        onChange={imageLoad}
                        // style={{
                        //   paddingTop: "0px !important",
                        //   paddingBottom: "0px !important",
                        //   paddingLeft: "0px !important",
                        // }}
                      />
                      {image.length === 0 ? (
                        <div className="pl-1 text-left">
                          {error.image && (
                            <span className="error">{error.image}</span>
                          )}
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
                              border: "0.5px solid rgba(255, 255, 255, 0.2)",
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
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100 mt-0"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={submitUpdate}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default connect(null, { CreateSeason, updateSeason, getMovieCategory })(
  SeasonDialogue
);
