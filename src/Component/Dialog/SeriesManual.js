import React, { useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { DialogActions, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import EditIcon from "@material-ui/icons/Edit";
import { getRegion } from "../../store/Region/region.action";
import Paper from "@material-ui/core/Paper";
import { getGenre } from "../../store/Genre/genre.action";
import card from "../assets/images/1.png";
import thumb from "../assets/images/5.png";
import { useState } from "react";
import UploadProgress from "../../Pages/UploadProgress";
import SunEditor from "suneditor-react";
import Multiselect from "multiselect-react-dropdown";
import { connect, useSelector } from "react-redux";
import { useEffect } from "react";
import { createManualSeries } from "../../store/TvSeries/tvSeries.action";

//mui
import GetAppIcon from "@material-ui/icons/GetApp";
import AddIcon from "@material-ui/icons/Add";

//Alert
import { permissionError } from "../../Util/Alert";
import { uploadFile } from "../../Util/AwsFunction";
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

const SeriesManual = (props) => {
  const ref = useRef();
  const imageRef = useRef();
  const classes = useStyles1();
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("Premium");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [trailerVideoUrl, setTrailerVideoUrl] = useState("");
  const [trailerVideoPath, setTrailerVideoPath] = useState("");
  const [trailerImage, setTrailerImage] = useState([]);
  const [trailerImagePath, setTrailerImagePath] = useState("");
  const [trailerVideoType, setTrailerVideoType] = useState("");
  const [trailerName, setTrailerName] = useState("");
  const [trailerType, setTrailerType] = useState("");
  const [trailerVideo, setTrailerVideo] = useState([]);
  const [data, setData] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [genres, setGenres] = useState([]);
  const [image, setImage] = useState("");
  const [gerenData, setGerenData] = useState([]);
  const [showURL, setShowURL] = useState({
    thumbnailImageShowImage: "",
    seriesImageShowURL: "",
    movieVideoShowURl: "",
    trailerImageShowURL: "",
    trailerVideoShowURL: "",
  });
  const [resURL, setResURL] = useState({
    thumbnailImageResURL: "",
    seriesImageResURL: "",
    movieVideoResURL: "",
    trailerImageResURL: "",
    trailerVideoResURL: "",
  });

  const [error, setError] = useState({
    title: "",
    description: "",
    type: "",
    year: "",
    country: "",
    genres: [],

    trailerVideoUrl: "",
    trailerVideoType: "",
    trailerName: "",
    trailerType: "",
  });

  //get country list
  const [countries, setCountries] = useState([]);
  const { region } = useSelector((state) => state.region);
  const { seriesDetailsTmdb } = useSelector((state) => state.series);
  const { genre } = useSelector((state) => state.genre);

  const hasPermission = useSelector((state) => state.admin.admin.flag);
  useEffect(() => {
    props.getRegion();
    props.getGenre();
  }, []);

  //Set Data after Getting
  useEffect(() => {
    setCountries(region);
  }, [region]);

  //get genre list
  const [genreData, setGenreData] = useState([]);

  //Set Data after Getting
  useEffect(() => {
    setGenreData(genre);
  }, [genre]);

  const dialogData = JSON.parse(localStorage.getItem("updateMovieData"));

  const history = useHistory();
  const handleClose = () => {
    localStorage.removeItem("updateMovieData");
    if (dialogData) {
      history.goBack();
    } else {
      history.replace("/admin/web_series");
    }
  };

  let folderStructureMovieImage = "mova/seriesImage";

  //  Image Load
  const imageLoad = async (event) => {
    setImage(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureMovieImage
    );

    setResURL({ ...resURL, seriesImageResURL: resDataUrl });
    setShowURL({ ...showURL, seriesImageShowURL: imageURL });
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
    setShowURL({ ...showURL, thumbnailImageShowImage: imageURL });
  };

  //Trailer Video Load
  let folderStructureTrailerVideo = "mova/trailerVideo";
  const trailerVideoLoad = async (event) => {
    setTrailerVideo(event.target.files[0]);
    const { resDataUrl, imageURL } = await uploadFile(
      event.target.files[0],
      folderStructureTrailerVideo
    );

    setResURL({ ...resURL, trailerVideoResURL: resDataUrl });
    setShowURL({ ...showURL, trailerVideoShowURL: imageURL });
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

  // open dialogue
  useEffect(
    () => () => {
      setGenres([]);
      setCountry("");
      setTitle("");
      setTrailerName("");
      setTrailerType("");
      setDescription("");
      setYear("");
      setImage([]);
      setImagePath("");
      setTrailerImage([]);
      setTrailerImagePath("");
      setThumbnail("");
      setTrailerVideo([]);
      setTrailerVideoPath("");
      setType("");
      setYoutubeUrl("");
      setTrailerVideoType("");
      setTrailerVideoUrl("");
      setError({
        title: "",
        trailerName: "",
        trailerType: "",
        description: "",
        year: "",
        country: "",
        genres: "",
        image: "",
        trailerImage: "",
        thumbnail: "",
        type: "",
        runtime: "",
        trailerVideoType: "",
        videoType: "",
      });
    },
    [dialogData]
  );

  const handleSubmit = () => {
    if (!hasPermission) return permissionError();
    if (
      !title ||
      !description ||
      type === "selectType" ||
      !type ||
      !year ||
      !country ||
      !genres ||
      !trailerVideoType ||
      !trailerName ||
      !trailerType ||
      (trailerVideoType == 0 && !trailerVideoUrl)
    ) {
      let error = {};
      if (!title) error.title = "title is required";
      if (!description) error.description = "description is required";
      if (type === "selectType" || !type) error.type = "type is required";
      if (!year) error.year = "year is required";
      if (!country) error.country = "region is required";

      if (trailerVideoType == 0 && !trailerVideoUrl)
        error.trailerVideoUrl = "Trailer video url is required";
      if (!trailerVideoType)
        error.trailerVideoType = "Trailer video type is required";
      if (image.length === 0) error.image = "image is required";
      if (thumbnail.length === 0) error.thumbnail = "Thumbnail is required";
      if (trailerImage.length === 0)
        error.trailerImage = "Trailer image is required";
      if (!trailerName) error.trailerName = "Trailer name is required";
      if (!trailerType) error.trailerType = "Trailer type is required";
      if (genres.length === 0) error.genres = "Genre Is Required";
      return setError({ ...error });
    } else {
      let objData = {
        title,
        description,
        year,
        type,
        region: country,
        genre: genres,
        trailerName,
        trailerVideoType,
        trailerType,
        image: resURL?.seriesImageResURL,
        thumbnail: resURL?.thumbnailImageResURL,
        trailerImage: resURL?.trailerImageResURL,
        trailerVideoUrl:
          trailerVideoType == 0 ? trailerVideoUrl : resURL?.trailerVideoResURL,
      };
      props.createManualSeries(objData);
      history.push("/admin/web_series");
    }
  };
  const handleClick = () => {
    ref.current.click();
  };
  const handleClickImage = () => {
    imageRef.current.click();
  };

  const genreId = seriesDetailsTmdb?.genre?.map((id) => {
    return id;
  });

  // useEffect(() => {
  //   setGenres(genreId);
  // }, [seriesDetailsTmdb]);

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    genres.push(selectedItem?._id);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setGenres(selectedList.map((data) => data._id));
  }

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row my-3">
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
                  <div class="iq-card mx-3">
                    <div class="iq-card-header d-flex justify-content-between">
                      <div class="iq-header-title d-flex align-items-center">
                        <MovieFilterIcon
                          className="mr-2"
                          style={{ fontSize: "30px", color: "#fff" }}
                        />

                        <h4 class="card-title my-0">Insert Web Ssries</h4>
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

              <div class="iq-header-title">
                {/* <h4 class="card-title mb-3">Movie</h4> */}
              </div>

              <div className="iq-card mb-5">
                <div className="iq-card-body">
                  <div className="row my-4">
                    <div className="col-md-6 iq-item-product-left">
                      <div className="iq-image-container px-3">
                        <div className="iq-product-cover">
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

                          <div class="my-4">

                          <label
                            htmlFor="description"
                            className="styleForTitle mt-3 movieForm"
                          >
                            Description
                          </label>
                          {dialogData ? (
                            <SunEditor
                              value={description}
                              setContents={description}
                              ref={editor}
                              height={346}
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
                          ) : (
                            <SunEditor
                              //   value={movieDetailsTmdb?.description}
                              //   setContents={movieDetailsTmdb?.description}
                              //   ref={editor}
                              height={346}
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
                          )}

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
                              {dialogData ? (
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
                              ) : (
                                <input
                                  type="date"
                                  placeholder="YYYY-MM-DD"
                                  className="form-control form-control-line"
                                  Required
                                  min="1950"
                                  //   value={movieDetailsTmdb?.year}
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
                              )}

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
                            <div className="col-md-6 my-2 ">
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
                              {dialogData ? (
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
                              ) : (
                                <select
                                  name="type"
                                  className="form-control form-control-line selector"
                                  id="type"
                                  value={type}
                                  onChange={(e) => {
                                    setType(e.target.value);

                                    if (e.target.value === "selectType") {
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
                                  <option value="selectType">
                                    Select Type
                                  </option>
                                  <option value="Free">Free</option>
                                  <option value="Premium">Premium</option>
                                </select>
                              )}

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
                              ) : (
                                <Multiselect
                                  options={genre} // Options to display in the dropdown
                                  selectedValues={seriesDetailsTmdb?.genre} // Preselected value to persist in dropdown
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
                              )}

                              {genres?.length === 0 && (
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
                              )}
                            </div>
                          </div>
                          {dialogData ? (
                            <>
                              <div className="row">
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
                                    {/* {countries.map((data) => {
                                      return (
                                        <option value={data._id}>
                                          {data.name}
                                        </option>
                                      );
                                    })} */}
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
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 iq-item-product-right"style={{borderLeft: "0.5px solid rgba(255, 255, 255, 0.3)"}}>
                      <div className="product-additional-details">
                        <div >
                        <label className="mt-3 movieForm">Thumbnail</label>


                    

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
                     


<div class="my-4">

                        <label className="mt-3 movieForm">Image</label>
                        

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
                                src={showURL?.seriesImageShowURL}
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
                              {showURL?.seriesImageShowURL ? (
                                <img
                                  alt=""
                                  src={showURL?.seriesImageShowURL}
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
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pl-3">
                    <h4 className="card-title ml-0">Trailer</h4>
                    <div style={{border: "0.5px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "10px" ,padding:"10px 22px"}}>

                    <div className="row my-4" >
                      <div className="col-md-6 my-2">
                        <label className="float-left styleForTitle movieForm">
                          Trailer Name
                        </label>
                        <input
                          type="text"
                          placeholder="Trailer Name"
                          className="form-control form-control-line"
                          Required
                          value={trailerName}
                          onChange={(e) => {
                            setTrailerName(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                trailerName: "Trailer Name is Required!",
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

                      <div className="col-md-6 my-2">
                        <label className="float-left styleForTitle movieForm">
                          Trailer Video Type
                        </label>
                        <select
                          type="text"
                          placeholder="Trailer Name"
                          className="form-control form-control-line"
                          Required
                          value={trailerVideoType}
                          onChange={(e) => {
                            setTrailerVideoType(e.target.value);

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                trailerVideoType:
                                  "Trailer Video Type is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                trailerVideoType: "",
                              });
                            }
                          }}
                        >
                          <option value="select Trails">
                            Select Trailer Video Type
                          </option>
                          <option value="0">Youtube Url </option>
                          <option value="1">File (MP4/MOV/MKV/WEBM)</option>
                        </select>
                        {error.trailerVideoType && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
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
                    <div className="row my-4">
                      <div className="col-md-6 my-2">
                        <label className="float-left styleForTitle movieForm">
                          Trailer Image
                        </label>
                        <input
                          type="file"
                          id="customFile"
                          placeholder="https://www.youtube.com"
                          className="form-control form-control-line"
                          onChange={trailerImageLoad}
                        />
                        {showURL?.trailerImageShowURL && (
                          <img
                            src={showURL?.trailerImageShowURL}
                            height="100px"
                            width="100px"
                            alt="app"
                            style={{
                              boxShadow:" rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                              border: "0.5px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "10px",
                              marginTop: "10px",
                              float: "left",
                            }}
                          />
                        )}

                        {error.trailerImage && (
                          <div className="pl-1 text-left">
                            <Typography
                              variant="caption"
                              style={{
                                fontFamily: "Circular-Loom",
                                color: "#ee2e47",
                              }}
                            >
                              {error.trailerImage}
                            </Typography>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 my-2">
                        <label className="float-left styleForTitle movieForm">
                          Trailer Video Url
                        </label>
                        <div>
                          {trailerVideoType == 0 && (
                            <>
                              <input
                                type="text"
                                // id="link"
                                placeholder="Link"
                                class="form-control"
                                value={trailerVideoUrl}
                                onChange={(e) => {
                                  setTrailerVideoUrl(e.target.value);
                                  if (!e.target.value) {
                                    return setError({
                                      ...error,
                                      trailerVideoUrl:
                                        "Trailer Video Url is Required!",
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

                              {showURL?.trailerVideoShowURL && (
                                <>
                                  <video
                                    height="100px"
                                    width="100px"
                                    controls
                                    alt="app"
                                    src={showURL?.trailerVideoShowURL}
                                    style={{
                                      boxShadow:" rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                      border: "0.5px solid rgba(255, 255, 255, 0.2)",
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
                          {/* {error.trailerVideoUrl && (
                            <div className="pl-1 text-left">
                              <Typography
                                variant="caption"
                                style={{
                                  fontFamily: "Circular-Loom",
                                  color: "#ee2e47",
                                }}
                              >
                                {error.trailerVideoUrl}
                              </Typography>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="row my-4">
                      <div className="col-12">
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

                            if (!e.target.value) {
                              return setError({
                                ...error,
                                trailerType: "Trailer Type is Required!",
                              });
                            } else {
                              return setError({
                                ...error,
                                trailerType: "",
                              });
                            }
                          }}
                        >
                          <option value="select Trails">
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
                  <UploadProgress data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRegion, getGenre, createManualSeries })(
  SeriesManual
);
