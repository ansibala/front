import react, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

//action
import { viewDetails, getComment } from "../../store/TvSeries/tvSeries.action";

//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";
import { useHistory } from "react-router-dom";

//html Parser
import parse from "html-react-parser";
import Slider from "react-slick";

//react player
import ReactPlayer from "react-player";

//react-skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../assets/js/SkeletonColor";

//react-router-dom
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// antd
import { Popconfirm } from "antd";

//alert
import { permissionError } from "../../Util/Alert";
import { covertURl } from "../../Util/AwsFunction";
import { OPEN_DIALOG } from "../../store/TvSeries/tvSeries.type";

const WebSeriesDetail = (props) => {
  const location = useLocation();

  const [data, setData] = useState([]);
  const [showURLsRole, setShowURLsRole] = useState([]);
  const [showEpisodeImage, setShowEpisodeImage] = useState([]);
  const [showURLs, setShowURLs] = useState([]);
  const [comments, setComments] = useState([]);
  const [showImage, setShowImage] = useState({
    thumbnailImage: "",
    image: "",
    trailerVideo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const urls = await Promise.all(
        comments.map(async (item) => {
          const fileNameWithExtension = item.userImage.split("/").pop();
          const { imageURL } = await covertURl(
            "userImage/" + fileNameWithExtension
          );
          return imageURL;
        })
      );
      setShowURLs(urls);
    };
    fetchData();
  }, [comments]);

  const id = location.state;

  useEffect(() => {
    props.viewDetails(id);
    props.getComment(id);
  }, []);

  const { movieDetails, comment } = useSelector((state) => state.series);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    setData(movieDetails ? movieDetails[0] : "");
    setComments(comment ? comment : "");
  }, [movieDetails, comment]);

  useEffect(() => {
    if (movieDetails && movieDetails.length > 0) {
      if (
        movieDetails[0]?.IMDBid == null &&
        movieDetails[0]?.TmdbMovieId == null
      ) {
        const fetchData = async () => {
          const fileNameWithExtensionThumbnail = movieDetails[0]?.thumbnail
            ?.split("/")
            .pop();
          const { imageURL: thumbnailURL } = await covertURl(
            "seriesThumbnail/" + fileNameWithExtensionThumbnail
          );
          const fileNameWithExtensionImage = movieDetails[0]?.image
            ?.split("/")
            .pop();
          const { imageURL } = await covertURl(
            "seriesImage/" + fileNameWithExtensionImage
          );

          const fileNameWithExtensionTrailerVideo =
            movieDetails[0]?.trailer[0]?.videoUrl?.split("/").pop();
          const { imageURL: trailerVideoURL } = await covertURl(
            "trailerVideo/" + fileNameWithExtensionTrailerVideo
          );

          const urls = await Promise.all(
            movieDetails[0]?.role?.length > 0 &&
              movieDetails[0]?.role?.map(async (item) => {
                const fileNameWithExtension = item?.image.split("/").pop();
                const { imageURL } = await covertURl(
                  "seriesRole/" + fileNameWithExtension
                );
                return imageURL;
              })
          );

          setShowURLsRole(urls);

          const episodeUrls = await Promise.all(
            movieDetails[0]?.episode?.length > 0 &&
              movieDetails[0]?.episode?.map(async (item) => {
                const fileNameWithExtension = item?.image.split("/").pop();
                const { imageURL: episodeImage } = await covertURl(
                  "episodeImage/" + fileNameWithExtension
                );
                return episodeImage;
              })
          );
          setShowEpisodeImage(episodeUrls);

          setShowImage({
            thumbnailImage: thumbnailURL,
            image: imageURL,
            trailerVideo: trailerVideoURL,
          });
        };

        fetchData();
        const interval = setInterval(fetchData, 1000 * 60);
        return () => clearInterval(interval);
      } else {
        const data = movieDetails[0]?.role?.map((items) =>
          items.image == "https://www.themoviedb.org/t/p/originalnull"
            ? placeholderImage
            : items?.image
        );
        setShowURLsRole(data);

        const episodeData = movieDetails[0]?.episode?.map((items) =>
          items.image == "https://www.themoviedb.org/t/p/originalnull"
            ? placeholderImage
            : items?.image
        );
        setShowEpisodeImage(episodeData);

        setShowImage({
          thumbnailImage: movieDetails[0]?.thumbnail,
          image: movieDetails[0]?.image,
          trailerVideo: movieDetails[0]?.trailer[0]?.videoUrl,
        });
      }
    }
  }, [movieDetails]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  const settings2 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 889,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: true,
        },
      },

      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  const handleDelete = (commentId) => {
    if (!hasPermission) return permissionError();
    props.deleteComment(commentId);
  };
  //Cast Slider Setting
  const castSliderShimmer = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  //Episode Slider Setting

  const episodeSliderShimmer = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 889,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 679,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dispatch = useDispatch();
  const history = useHistory();

  //update button
  const updateOpen = (data) => {
    dispatch({ type: OPEN_DIALOG, payload: data });
    localStorage.setItem("updateMovieData", JSON.stringify(data));
    sessionStorage.setItem("tvSeriesId", data._id);
    history.push("/admin/web_series/series_form");
  };

  // set default image
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function handleError() {
      const defaultImage = placeholderImage;
      img.src = defaultImage;
      img.alt = "default";
    });
  });
  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="row d-flex align-items-center">
                <div className="col-10">
                  <div class="iq-header-title">
                    <h4 class="card-title mb-3">Web Series Details</h4>
                  </div>
                </div>
                <div className="col-2 px-4">
                  <button
                    type="button"
                    className="btn iq-bg-primary btn-sm float-right "
                    onClick={() => updateOpen(data)}
                  >
                    <i
                      className="ri-pencil-fill"
                      style={{ fontSize: "19px" }}
                    />
                  </button>
                </div>
              </div>
              <div className="iq-card">
                <div
                  className="iq-card-body profile-page p-0 "
                  style={{ padding: "0px !important" }}
                >
                  <div className="profile-header">
                    <div className="cover-container">
                      <img
                        src={showImage?.image}
                        alt="profile-bg"
                        className="img-fluid posterImage"
                      />
                    </div>
                    <div
                      className="profile-info "
                      style={{ paddingBottom: "0px !important" }}
                    >
                      <div className="row">
                        <div className="col-md-2 iq-item-product-left thumbnailPoster d-flex justify-content-start">
                          <img
                            src={showImage?.thumbnailImage}
                            alt="profile-img"
                            className="img-fluid"
                            width="200"
                            style={{ borderRadius: "10px" }}
                          />
                        </div>
                        <div className="col-md-10 iq-item-product-left mt-3">
                          <h3>{data?.title}</h3>

                          <div className="row movie-web-details-font">
                            <div className="col-12 col-md-3">
                              <form>
                                <table>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Year
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td>{data?.year}</td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      RunTime
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">
                                      {data?.runtime} min
                                    </td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Type
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">{data?.type}</td>
                                  </tr>

                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989F7" }}
                                    >
                                      Regin
                                    </td>
                                    <td
                                      className="py-2 mb-2 "
                                      style={{ color: "#4989F7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 ">
                                      {data?.region?.name}
                                    </td>
                                  </tr>
                                </table>
                              </form>
                            </div>
                            <div className="col-12 col-md-9">
                              <from>
                                <table>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 fw-bold"
                                      style={{ color: "#4989f7" }}
                                    >
                                      Genre
                                    </td>
                                    <td
                                      className="py-2 mb-2"
                                      style={{ color: "#4989f7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2">
                                      {data?.genre?.map((genreData) => {
                                        return genreData?.name + ",";
                                      })}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2 align-top fw-bold"
                                      style={{ color: "#4989f7" }}
                                    >
                                      Description
                                    </td>
                                    <td
                                      className="py-2 mb-2 align-top"
                                      style={{ color: "#4989f7" }}
                                    >
                                      &nbsp;:&nbsp;&nbsp;
                                    </td>
                                    <td className="py-2 mb-2 description-text">
                                      {parse(`${data?.description}`)}
                                    </td>
                                  </tr>
                                </table>
                              </from>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 product-description-details mt-4 pl-0">
                        <h4
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <span className="moviedata">Trailer</span>
                        </h4>

                        <Slider {...settings}>
                          {data?.trailer?.map((trailerValue, index) => {
                            return (
                              <>
                                <div
                                  className="card"
                                  style={{
                                    margin: " 5px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <div
                                    className="card-body"
                                    style={{
                                      padding: "0px",
                                      borderRadius: "10px",
                                      // height: "340px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "250px",
                                      }}
                                    >
                                      <ReactPlayer
                                        url={
                                          trailerValue.videoType === 1
                                            ? showImage?.trailerVideo
                                            : trailerValue.videoUrl
                                        }
                                        className="react-player img-fluid"
                                        playing={false}
                                        width="100%"
                                        height="100%"
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>

                                    <p
                                      className="mt-3 text-center mb-0"
                                      style={{
                                        color: "#fdfdfd",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {trailerValue?.type}
                                    </p>
                                    <p
                                      className="text-center pt-2  text-white text-capitalize"
                                      style={{ marginBottom: "13px" }}
                                    >
                                      {trailerValue?.name?.length > 50
                                        ? trailerValue?.name.substr(0, 40) +
                                          "..."
                                        : trailerValue?.name}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </Slider>
                      </div>
                      {/* --------- episode ---------- */}

                      <div className="col-sm-12 product-description-details mt-4">
                        <h4
                          style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <span className="moviedata">Episode</span>
                        </h4>

                        <Slider {...episodeSliderShimmer}>
                          {data.episode?.length > 0 ? (
                            data.episode.map((trailerValue, index) => {
                              return (
                                <div
                                  className="card"
                                  style={{
                                    margin: " 5px",
                                    borderRadius: "10px",
                                  }}
                                  key={index} // Ensure to add a unique key to each element
                                >
                                  <div
                                    className="card-body"
                                    style={{
                                      padding: "0px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <div>
                                      <div className="card__pic">
                                        <img
                                          src={showEpisodeImage[index]}
                                          alt=""
                                          width="100%"
                                          height="220px"
                                          style={{
                                            borderRadius: "10px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {/* <YouTube video={trailerValue?.key} autoplay /> */}

                                    <div className="px-2">
                                      <h6 className="pt-3">
                                        {trailerValue?.name}
                                      </h6>
                                      <div className="mb-3 text-white">
                                        <span className="mr-1">
                                          Episode No :
                                        </span>
                                        <span style={{ color: "#fdfdfd" }}>
                                          {trailerValue?.episodeNumber}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <Skeleton
                              style={{
                                height: "300px",
                                objectFit: "cover",
                                width: "100%",
                              }}
                              className="card__pic"
                              containerClassName="avatar-skeleton"
                              baseColor={colors.baseColor}
                              highlightColor={colors.highlightColor}
                            />
                          )}
                        </Slider>
                      </div>

                      {/* --------------cast------------- */}

                      <div className="mb-5">
                        {data?.role?.length > 0 ? (
                          <>
                            <div className="d-flex justify-content-between">
                              <div className="d-flex">
                                <h4
                                  style={{
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    marginLeft: "18px",
                                  }}
                                >
                                  <span className="moviedata">Cast</span>
                                </h4>
                              </div>
                            </div>

                            <Slider {...settings2}>
                              {data?.role?.map((roleData_, index) => {
                                return (
                                  <>
                                    <div style={{ margin: " 20px" }}>
                                      <a
                                        className="card"
                                        href={() => false}
                                        style={{ borderRadius: "10px" }}
                                      >
                                        <div className="card__preview img-fluid">
                                          <img
                                            className="roleImage"
                                            src={showURLsRole[index]}
                                            draggable={false}
                                            alt="Cast"

                                            // style={{
                                            //   borderRadius: "50%",
                                            //   objectFit: "cover",
                                            //   maxWidth: "100%",
                                            //   maxHeight: "100%",
                                            // }}

                                            // onLoad={() => setLoading(true)}
                                          />
                                          <div className="card__body">
                                            <div className="row ml-0">
                                              <div className="col-12">
                                                <div className="card__user justify-content-center">
                                                  <div className="card__ava">
                                                    <img
                                                      style={{
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                        height: "20px",
                                                      }}
                                                      draggable={false}
                                                      className="card__pic"
                                                      alt=""
                                                    />
                                                  </div>

                                                  <div>
                                                    <h6>{roleData_.name}</h6>

                                                    <p
                                                      style={{
                                                        color: "#fdfdfd",
                                                      }}
                                                    >
                                                      {roleData_.position}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  </>
                                );
                              })}
                            </Slider>
                          </>
                        ) : (
                          <>
                            <div className="collection__head ">
                              <div
                                className="collection__title h5"
                                style={{ color: "#fdfdfd" }}
                              >
                                Cast
                              </div>
                            </div>
                            <div className="d-flex">
                              <Slider {...castSliderShimmer}>
                                <div
                                  className="py-4"
                                  style={{ margin: "20px" }}
                                >
                                  <a
                                    className="card"
                                    href={() => false}
                                    style={{
                                      width: "295px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <div className="card__preview">
                                      <div className="card__pic">
                                        <Skeleton
                                          style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            width: "100%",
                                          }}
                                          className="card__pic"
                                          containerClassName="avatar-skeleton"
                                          baseColor={colors.baseColor}
                                          highlightColor={colors.highlightColor}
                                        />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div
                                  className="p-4"
                                  style={{ margin: "0px 20px" }}
                                >
                                  <a
                                    className="card"
                                    href={() => false}
                                    style={{
                                      width: "295px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <div className="card__preview">
                                      <div className="card__pic">
                                        <Skeleton
                                          style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            width: "100%",
                                          }}
                                          className="card__pic"
                                          containerClassName="avatar-skeleton"
                                          baseColor={colors.baseColor}
                                          highlightColor={colors.highlightColor}
                                        />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div
                                  className="p-4"
                                  style={{ margin: " 20px" }}
                                >
                                  <a
                                    className="card"
                                    href={() => false}
                                    style={{
                                      width: "295px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <div className="card__preview">
                                      <div className="card__pic">
                                        <Skeleton
                                          style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            width: "100%",
                                          }}
                                          className="card__pic"
                                          containerClassName="avatar-skeleton"
                                          baseColor={colors.baseColor}
                                          highlightColor={colors.highlightColor}
                                        />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div
                                  className="p-4"
                                  style={{ margin: " 20px" }}
                                >
                                  <a
                                    className="card"
                                    href={() => false}
                                    style={{
                                      width: "295px",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <div className="card__preview">
                                      <div className="card__pic">
                                        <Skeleton
                                          style={{
                                            height: "180px",
                                            objectFit: "cover",
                                            width: "100%",
                                          }}
                                          className="card__pic"
                                          containerClassName="avatar-skeleton"
                                          baseColor={colors.baseColor}
                                          highlightColor={colors.highlightColor}
                                        />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </Slider>
                            </div>
                          </>
                        )}
                      </div>

                      {/*-------- comment ------- */}
                      <div className="col-sm-12" style={{ marginTop: "18px" }}>
                        <div className="post">
                          <div id="myGroup">
                            <div class="post-actions">
                              {/* <ul class="list-unstyled">
                              <li>
                                <a
                                  class="like-btn collapsed"
                                  data-toggle="collapse"
                                  href="#collapseComment"
                                  role="button"
                                  aria-expanded="true"
                                  aria-controls="collapseComment"
                                > */}
                              <h4 className="productpage_title mb-4 mt-3">
                                <span className="moviedata">Comments</span>
                              </h4>
                              {/* </a>
                              </li>
                            </ul> */}
                            </div>
                            <div class="post-comments">
                              {/* <div
                              class="collapse"
                              id="collapseComment"
                              data-parent="#myGroup"
                              style={{ maxHeight: "100%" }}
                            > */}
                              <div class="row">
                                <div
                                  class="col-12"
                                  // style={{
                                  //   flex: "0 0 auto",
                                  //   width: "100%",
                                  // }}
                                >
                                  {comments?.length > 0 ? (
                                    comments.map((cmt, index) => {
                                      return (
                                        <>
                                          <div class="post-comm post-padding d-flex justify-content-center align-items-start">
                                            <div className="commentImage">
                                              <img
                                                src={showURLs[index]}
                                                className="rounded-circle img-fluid avatar-40"
                                                alt=""
                                                // onClick={() =>
                                                //   handleUserInfo(comment.user)
                                                // }
                                              />
                                            </div>
                                            <div class="comment-container">
                                              <span class="comment-author pointer-cursor text-capitalize">
                                                <span
                                                  // onClick={() =>
                                                  //   handleUserInfo(
                                                  //     comment.user
                                                  //   )
                                                  // }
                                                  style={{
                                                    color: "#fdfdfd ",
                                                  }}
                                                >
                                                  {cmt.fullName}
                                                </span>
                                                <small class="comment-date float-right d-flex">
                                                  <div className="commentTime">
                                                    {cmt.time}
                                                  </div>
                                                  <div>
                                                    <Popconfirm
                                                      title="Are you sure to delete this comment?"
                                                      onConfirm={() =>
                                                        handleDelete(cmt._id)
                                                      }
                                                      // onCancel={cancel}
                                                      okText="Yes"
                                                      cancelText="No"
                                                      placement="top"
                                                    >
                                                      <i
                                                        className="ri-delete-bin-6-line text-danger comment-delete pointer-cursor pl-2 mb-4"
                                                        style={{
                                                          fontSize: "16px",
                                                        }}
                                                      ></i>
                                                    </Popconfirm>
                                                  </div>
                                                </small>
                                              </span>
                                              <span className="pointer-cursor">
                                                {cmt.comment}
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })
                                  ) : (
                                    <p className="text-center">
                                      No Comment Yet!!
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
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

export default connect(null, { viewDetails, getComment })(WebSeriesDetail);
