import axios from "axios";

import {
  GET_DASHBOARD,
  GET_ANALYTIC,
  OPEN_DASHBOARD_TOAST,
  GET_COUNTRY_WISE_USER,
  MOVIE_SERIES_ANACLITIC_DATA,
} from "./dashboard.type";

//get dashboard
export const getDashboard = () => (dispatch) => {
  axios
    .get("dashboard/admin")
    .then((res) => {
      dispatch({ type: GET_DASHBOARD, payload: res.data.dashboard });
    })
    .catch((error) => console.log(error));
};

//get user Revenue analytic
export const getAnalytic = (type, start, end) => (dispatch) => {
  
  axios
    .get(
      `dashboard/userAnalytic?type=${type}&startDate=${start}&endDate=${end}`
    )
    .then((res) => {
      
      if (res.data.status) {
        console.log(res.data);
        dispatch({ type: GET_ANALYTIC, payload: res.data.analytic });
      } else {
        dispatch({
          type: OPEN_DASHBOARD_TOAST,
          payload: { data: res.data.message },
        });
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};

export const getMovieSeriesAnalytic = (chartType, start, end) => (dispatch) => {
  axios
    .get(
      `dashboard/movieAnalytic?type=${chartType}&startDate=${start}&endDate=${end}`
    )
    .then((res) => {
      if (res.data.status) {
        console.log(res.data);

        dispatch({
          type: MOVIE_SERIES_ANACLITIC_DATA,
          payload: res.data.analytic,
        });
      } else {
        dispatch({
          type: OPEN_DASHBOARD_TOAST,
          payload: { data: res.data.message },
        });
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });
};
//Get countryWise user
export const getCountryWiseUser = () => (dispatch) => {
  axios
    .get("user/countryWiseUser")
    .then((res) => {
      console.log("countryUser----", res.data);
      dispatch({ type: GET_COUNTRY_WISE_USER, payload: res.data.user });
    })
    .catch((error) => console.log(error));
};
