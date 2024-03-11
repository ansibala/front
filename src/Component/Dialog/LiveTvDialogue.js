import { TablePagination } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TablePaginationActions from "../../Pages/Pagination";
import $ from "jquery";
import image from "../../Component/assets/images/login.jpg";
import noImage from "../../Component/assets/images/noImage.png";
import {
  getCountry,
  getLiveTvData,
  createLiveChannel,
  getFlag,
} from "../../store/LiveTv/liveTv.action";

import Select from "react-select";
const LiveTvDialogue = (props) => {
  const { loader } = useSelector((state) => state.loader);

  const { liveTv, country, flag } = useSelector((state) => state.liveTv);
  const [data, setData] = useState([]);
  const [country_, setCountry] = useState({
    value: "india",
    label: "india",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    props.getFlag();
    props.getCountry();
    props.getLiveTvData("india");
  }, []);

  useEffect(() => {
    props.getLiveTvData(country_.value);
  }, [country_]);

  useEffect(() => {
    setData(liveTv);
  }, [liveTv]);

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,

        backgroundColor: isSelected ? "#112935" : "#354a5c",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#112935"
              : "#354a5c"
            : undefined,
        },
        placeholder: (styles) => ({
          ...styles,
          color: "#fdfdfd",
        }),
      };
    },
  };

  const options = country?.map((countryData) => {
    return {
      value: countryData.countryName,
      label: countryData.countryName,
    };
  });

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handelCreateChannel = (data) => {
    const countriesData = country_.value;
    console.log(countries);
    var channelData = {
      channelId: data.channelId,
      channelName: data.channelName,
      streamURL: data.streamURL,
      channelLogo: data.channelLogo,
      country: countriesData,
    };
    props.createLiveChannel(channelData);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (value) {
      const data = liveTv.filter((data) => {
        return (
          data?.channelName?.toUpperCase()?.indexOf(value) > -1 ||
          data?.streamURL?.toUpperCase()?.indexOf(value) > -1 ||
          data?.country?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      setData(liveTv);
    }
  };

  // set default image
  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", noImage);
    });
  });

  const history = useHistory();
  const handlePrevious = () => {
    history.goBack();
  };
  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title row col-12 mb-3 pr-0">
                <div className="col-6 ">
                  <div class="iq-header-title mt-4">
                    <h4 class="card-title mb-0">Add Live TV </h4>
                  </div>
                </div>
                <div className="col-6  d-flex justify-content-end px-0">
                  <button
                    type="button"
                    className="btn iq-bg-primary btn-sm "
                    onClick={() => handlePrevious()}
                  >
                    {/* <i className="ri-pencil-fill" style={{ fontSize: "19px" }} /> */}
                    <i
                      class="fa-solid fa-angles-left  p-2"
                      style={{ fontSize: "19px", color: "#fdfdfd" }}
                    />
                  </button>
                </div>
              </div>
              <div className="iq-card mb-5 ">
                <div className="iq-card-header d-flex justify-content-between">
                  <div className="row w-100">
                    <div className="col-12 col-lg-6 my-3">
                      {" "}
                      <div class="dropdown show">
                        <Select
                          placeholder="Select Country"
                          defaultValue={country}
                          onChange={setCountry}
                          options={options}
                          styles={colourStyles}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6 my-3 d-flex justify-content-end">
                      {" "}
                      <div className="text-center sm">
                        <form class="mr-3 position-relative">
                          <div class="form-group mb-0">
                            <input
                              id="input-search"
                              type="search"
                              class="form-control"
                              placeholder="Search"
                              aria-controls="user-list-table"
                              onChange={handleSearch}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="iq-card-body">
                  <div className="table-responsive">
                    <div className="row justify-content-end">
                      <div className="col-sm-12 col-md-6">
                        <div
                          id="user_list_datatable_info"
                          className="dataTables_filter"
                        >
                          <form className="mr-3 position-relative">
                            {/* <div className="form-group mb-0">
                              <input
                                type="search"
                                className="form-control"
                                id="exampleInputSearch"
                                placeholder="Search"
                                aria-controls="user-list-table"
                                onChange={handleSearch}
                              />
                            </div> */}
                          </form>
                        </div>
                      </div>
                    </div>
                    <table
                      id="user-list-table"
                      className="table table-striped table-borderless mt-4"
                      role="grid"
                      aria-describedby="user-list-page-info"
                    >
                      <thead>
                        <tr className="text-center">
                          <th>ID</th>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Stream </th>
                          <th>Create Channel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((data, index) => {
                            return (
                              <>
                                <tr>
                                  <td className="pr-3 tableAlign">
                                    {index + 1}
                                  </td>
                                  <td className="pr-3">
                                    <img
                                      className="img-fluid mx-auto"
                                      style={{
                                        boxShadow:
                                          " rgba(105, 103, 103, 0) 0px 5px 15px 0px",
                                        border:
                                          "0.5px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: 10,
                                        objectFit: "cover",
                                        display: "block",
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      draggable="false"
                                      src={data?.channelLogo}
                                      alt="profile"
                                    />
                                  </td>
                                  {/* <td class="align-middle">
                            {" "}
                            <img
                              // className="shadow p-1 mb-2 bg-white rounded "
                              src={data?.image}
                              style={{
                                borderRadius: 8,
                                objectFit: "cover",
                              }}
                              height="65px"
                              width="65px"
                              alt=""
                            />
                          </td> */}
                                  <td className="pr-3 tableAlign">
                                    {data?.channelName}
                                    {/* {data?.title?.length > 10
                                      ? data?.title.slice(0, 10) + "...."
                                      : data?.title} */}
                                  </td>
                                  {/* {parse(
                                      `${
                                        data?.description?.length > 250
                                          ? data?.description.substr(0, 250) +
                                            "..."
                                          : data?.description
                                      }`
                                    )} */}
                                  <td className="pr-3 tableAlign">
                                    {/* <video
                                        // className="shadow bg-white rounded mt-2"
                                        src={data?.streamURL}
                                        height="120px"
                                        width="120px"
                                        type="video/mp4"
                                        controls
                                        style={{
                                          boxShadow:
                                            "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                          border:
                                            "2px solid rgba(41, 42, 72, 1)",
                                          borderRadius: 10,
                                          display: "block",
                                          objectFit: "cover",
                                        }}
                                        className="mx-auto"
                                      /> */}
                                    {data?.streamURL?.length > 25
                                      ? data?.streamURL.slice(0, 25) + "...."
                                      : data?.streamURL}
                                  </td>

                                  {/* <td>{data?.view}</td>

                                  <td>
                                    {dayjs(data?.createdAt).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td> */}
                                  <td className="pr-3 tableAlign">
                                    <button
                                      className="btn iq-bg-primary btn-sm"
                                      onClick={() => handelCreateChannel(data)}
                                    >
                                      <i class="ri-add-line align-bottom me-1 fs-6"></i>
                                      Add
                                    </button>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        {loader === false && data?.length === 0 && (
                          <tr>
                            <td colSpan="12" className="text-center">
                              No data Found!!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
                    // ActionsComponent={TablePaginationActions}
                  />
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
  getCountry,
  getLiveTvData,
  createLiveChannel,
  getFlag,
})(LiveTvDialogue);
