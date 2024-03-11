import React, { useState, useEffect } from "react";

//react-redux
import { useSelector } from "react-redux";
import { connect } from "react-redux";

//component
import PurchasePremiumPlan from "../Component/Table/History/PurchasePremiumPlan";

//action
import { premiumPlanHistory } from "../store/PremiumPlan/plan.action";

//jquery
import $ from "jquery";

//dayjs
import dayjs from "dayjs";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Date Range Picker
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//Pagination
import Pagination from "../Pages/Pagination";

const UserHistory = (props) => {
  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user"));

  const { history, totalPlan } = useSelector((state) => state.premiumPlan);

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker2").removeClass("show");
    });
  }, []);

  useEffect(() => {
    props.premiumPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL"); // eslint-disable-next-line
  }, [rowsPerPage, activePage]);

  useEffect(() => {
    props.premiumPlanHistory(
      user._id,
      activePage,
      rowsPerPage,
      startDate,
      startDate
    ); // eslint-disable-next-line
  }, [activePage, rowsPerPage]);

  useEffect(() => {
    setData(history);
  }, [history]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker2").removeClass("show");
    setData(history);
  }, [date, history]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const getAllHistory = () => {
    setActivePage(1);
    setStartDate("");
    setEndDate("");
    $("#datePicker2").removeClass("show");
    // props.vipPlanHistory(null, activePage, rowsPerPage, startDate, endDate);
    props.premiumPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
  };

  const collapsedDatePicker = () => {
    $("#datePicker2").toggleClass("collapse");
  };

  //Apply button function for analytic
  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);

    props.premiumPlanHistory(user._id, activePage, rowsPerPage, start, end);
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");
    setStartDate("");
    setEndDate("");
    props.premiumPlanHistory(user._id, activePage, rowsPerPage, "ALL", "ALL");
  };
  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="iq-header-title">
                <h4 class="card-title">{user?.fullName}'s History</h4>
              </div>
              <div className="iq-card mb-5" id="card">
                <div className="iq-card-header pb-0">
                  <div className="row my-3">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                      <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                        <button
                          className="btn btn-primary mr-1"
                          onClick={getAllHistory}
                        >
                          All
                        </button>
                        {/* <button
                          className="collapsed btn btn-primary"
                          value="check"
                          data-toggle="collapse"
                          data-target="#datePicker2"
                          onClick={collapsedDatePicker}
                        >
                          Analytics
                          <ExpandMoreIcon />
                        </button> */}
                        {/* <p style={{ paddingLeft: 10 }} className="my-2 ">
                          {sDate !== "ALL" && sDate + " to " + eDate}
                        </p> */}
                        <div>
                          <DateRangePicker
                            initialSettings={{
                              autoUpdateInput: false,
                              locale: {
                                cancelLabel: "Clear",
                              },
                              maxDate: new Date(),

                              buttonClasses: ["btn btn-dark"],
                            }}
                            onApply={handleApply}
                            onCancel={handleCancel}
                          >
                            <input
                              readOnly
                              type="text"
                              class="btn dark-icon btn-primary"
                              value="Analytics"
                              style={{
                                width: 120,
                                background: "#673ab7",
                                color: "#ffff",
                              }}
                            />
                          </DateRangePicker>
                        </div>
                        {startDate === "" || endDate === "" ? (
                          ""
                        ) : (
                          <div className="dateShow ml-4 fs-5 text-white fw-bold mt-2">
                            <span className="mr-2">{startDate}</span>
                            <span className="mr-2">To</span>
                            <span>{endDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right mt-3 mt-lg-0 mt-xl-0"></div>
                    <div
                      id="datePicker2"
                      className="collapse mt-5 pt-3 pl-5 ml-5"
                      aria-expanded="false"
                    >
                      {/* <div className="container table-responsive">
                        <div key={JSON.stringify(date)}>
                          <DateRangePicker
                            onChange={(item) => {
                              setDate([item.selection]);
                              const dayStart = dayjs(
                                item.selection.startDate
                              ).format("YYYY-MM-DD");
                              const dayEnd = dayjs(
                                item.selection.endDate
                              ).format("YYYY-MM-DD");
                              setActivePage(1);
                              setsDate(dayStart);
                              seteDate(dayEnd);
                              props.premiumPlanHistory(
                                null,
                                activePage,
                                rowsPerPage,
                                sDate,
                                eDate
                              );
                            }}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                            direction="horizontal"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="iq-card-body">
                  <PurchasePremiumPlan data={data} />
                  <Pagination
                    activePage={activePage}
                    rowsPerPage={rowsPerPage}
                    userTotal={totalPlan}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                  />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { premiumPlanHistory })(UserHistory);
