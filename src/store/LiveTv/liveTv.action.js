import * as ActionType from "./liveTv.type";
import { baseURL, devKey } from "../../Util/ServerPath";
import axios from "axios";
import { Toast } from "../../Util/Toast_";
import { useHistory } from "react-router-dom";

export const getCountry = () => (dispatch) => {
  axios
    .get("countryLiveTV")
    .then((res) => {
      console.log(res.data.country);
      dispatch({
        type: ActionType.GET_COUNTRY,
        payload: res.data.countryLiveTV,
      });
    })
    .catch((error) => console.log(error));
};

export const getLiveTvData = (country) => (dispatch) => {
  
  console.log("country", country);
  //   const request = {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json", key: devKey },
  //   };
  //   fetch(
  //     `${baseURL}countryLiveTV/getStoredetails?countryName=${country}`,
  //     request
  //   )
  //     .then((response) => response.json())
  //     .then((res) => {
  //       console.log(res);
  //       dispatch({ type: ActionType.GET_LIVE_TV, payload: res });
  //     })
  //     .catch((error) => console.log(error));

  axios
    .get(`countryLiveTV/getStoredetails?countryName=${country}`)
    .then((res) => {
      console.log(res.data.streamData);
      dispatch({ type: ActionType.GET_LIVE_TV, payload: res.data.streamData });
    })
    .catch((error) => console.log(error));
};

// create live channel
export const createLiveChannel = (data) => (dispatch) => {
  
  axios
    .post("stream/create", data)
    .then((res) => {
     
      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);

      
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// admin CreateLiveChannel Get
export const getAdminCreateLiveTv = () => (dispatch) => {
  axios
    .get("stream")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: ActionType.GET_LIVE_TV_CREATE_BY_ADMIN,
        payload: res.data.stream,
      });
    })
    .catch((error) => console.log(error));
};

// edit live tv channel

export const updateLiveTvChannel = (id, formData) => (dispatch) => {
  axios
    .patch(`stream/update?streamId=${id}`, formData)
    .then((res) => {
      console.log(res.data.stream);
      if (res.data.status) {
        Toast("success", res.data.message);
        dispatch({
          type: ActionType.EDIT_LIVETV_CHANNEL,
          payload: { data: res.data.stream, id: id },
        });
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

export const deleteLiveChannel = (id) => (dispatch) => {
  axios
    .delete(`stream/delete?streamId=${id}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: ActionType.DELETE_LIVETV_CHANNEL, payload: id });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

// create manual live tv

// create live channel
export const createManualLiveChannel = (data) => (dispatch) => {
  
  axios
    .post("stream/manualCreate", data)
    .then((res) => {
      
      console.log(res.data);
      if (res.data.status) {
        dispatch({ type: ActionType.CREATE_LIVE_TV, payload: res.data.stream });
        Toast("success", res.data.message);
      } else {
        Toast("error", res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFlag = () => (dispatch) => {

  axios
    .get("flag")
    .then((res) => {
    
      console.log(res.data);
      dispatch({type:ActionType.GET_FLAG ,payload:res.data.flag})
    })
    .catch((error) => {
      console.log(error);
    });
};
