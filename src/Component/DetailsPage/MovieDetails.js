import React, { useState, useEffect } from "react";
import $ from "jquery";

import defaultUserPicture from "../assets/images/defaultUserPicture.jpg";
//image
import placeholderImage from "../assets/images/defaultUserPicture.jpg";

// antd
import { Popconfirm } from "antd";

//mui
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

//react-router-dom
import { useLocation } from "react-router-dom";

// slick-carousel

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//react-redux
import { connect, useSelector } from "react-redux";

//action
import {
  viewDetails,
  getComment,
  deleteComment,
} from "../../store/Movie/movie.action";

//html Parser
import parse from "html-react-parser";
import Slider from "react-slick";

import { useHistory } from "react-router-dom";

//react player
import ReactPlayer from "react-player";

//react-skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../assets/js/SkeletonColor";

//alert
import { permissionError } from "../../Util/Alert";
import { covertURl } from "../../Util/AwsFunction";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

const MovieDetails = (props) => {
  const location = useLocation();

  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [season, setSeason] = useState("");

  const [index, setIndex] = useState(0);
  const [showURLs, setShowURLs] = useState([]);
  const [showURLsRole, setShowURLsRole] = useState([]);

  const id = location.state;

  const history = useHistory();

  useEffect(() => {
    props.viewDetails(id);
    props.getComment(id);
  }, []);

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

  const { movieDetails, comment } = useSelector((state) => state.movie);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    setData(movieDetails ? movieDetails[0] : "");
    setComments(comment ? comment : "");
  }, [movieDetails, comment]);

  const [fetched, setFetched] = useState(false);
  const [showImage, setShowImage] = useState({
    thumbnailImage: "",
    image: "",
    trailerVideo: "",
  });

  useEffect(() => {
    if (
      movieDetails[0]?.IMDBid == null &&
      movieDetails[0]?.TmdbMovieId == null
    ) {
      const fetchData = async () => {
        const fileNameWithExtensionThumbnail = movieDetails[0]?.thumbnail
          ?.split("/")
          .pop();
        const { imageURL: thumbnailURL } = await covertURl(
          "movieThumbnail/" + fileNameWithExtensionThumbnail
        );
        const fileNameWithExtensionImage = movieDetails[0]?.image
          ?.split("/")
          .pop();
        const { imageURL } = await covertURl(
          "movieImage/" + fileNameWithExtensionImage
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
                "RoleImage/" + fileNameWithExtension
              );
              return imageURL;
            })
        );
        setShowURLsRole(urls);

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
      setShowImage({
        thumbnailImage: movieDetails[0]?.thumbnail,
        image: movieDetails[0]?.image,
        trailerVideo: movieDetails[0]?.trailer[0]?.videoUrl,
      });
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

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleDelete = (commentId) => {
    if (!hasPermission) return permissionError();
    props.deleteComment(commentId);
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", defaultUserPicture);
      // $(this).css({
      //   // Add CSS properties here
      //   width: "100px",
      //   height: "100px",
      //   border: "1px solid red",
      //   // Add more CSS properties as needed
      // });
    });
  });

  //update button
  const updateOpen = (data) => {
    sessionStorage.setItem("trailerId", data?._id);
    localStorage.setItem("updateMovieData1", JSON.stringify(data));
    history.push({ pathname: "/admin/movie/movie_form", state: data });
  };

  const videoData = data?.trailer || [];
  const videoTop = videoData[0];

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="row d-flex align-items-center">
                <div className="col-10">
                  <div class="iq-header-title">
                    <h4 class="card-title mb-3">Movie Details</h4>
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
                            className="img-fluid movie-web-thumbnail-image"
                          />
                        </div>
                        <div className="col-md-10 iq-item-product-left mt-4">
                          <h3>{data?.title}</h3>

                          <div className="row movie-web-details-font">
                            <div className="col-12 col-md-3">
                              <form>
                                <table>
                                  <tr
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <td
                                      className="py-2 mb-2  fw-bold"
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
                                      className="py-2 mb-2  fw-bold"
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
                                      className="py-2 mb-2  fw-bold"
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
                                      className="py-2 mb-2  fw-bold"
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
                                      className="py-2 mb-2 align-top fw-bold "
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
                      <div className="col-sm-12 product-description-details mt-5 pl-0">
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
                                  className="card mb-4"
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
                                    {/* <YouTube video={trailerValue?.key} autoplay /> */}
                                    {/* <video
                                  src={trailerValue?.videoUrl}
                                  type="video/mp4"
                                  controls
                                  style={{
                                    width: "98%",
                                    paddingBottom: "50px !important",
                                    // height: "430px",
                                    // width: "730px",
                                    // minHeight: "430px !important",
                                    // minWidth: "730px !important",
                                  }}
                                /> */}
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
                                      className="text-center pt-2 text-white text-capitalize"
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
                            {/* ---------  cast data shimmer -------  */}
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
                                                    color: "#ffff",
                                                  }}
                                                >
                                                  {cmt.fullName}
                                                </span>
                                                <small class="comment-date float-right d-flex">
                                                  <div className="commentTime">
                                                    {cmt.time}{" "}
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
                                    <p className="text-center text-white">
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

export default connect(null, {
  viewDetails,
  getComment,
  deleteComment,
})(MovieDetails);
