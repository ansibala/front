import axios from "axios";

import {
  GET_SETTING,
  UPDATE_SETTING,
  OPEN_SETTING_TOAST,
  SWITCH_ACCEPT,
} from "./setting.type";
import { setToast } from "../../Util/Toast";
import { Toast } from "../../Util/Toast_";

export const getSetting = () => (dispatch) => {
  axios
    .get("setting")
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_SETTING, payload: res.data.setting });
        // dispatch({
        //   type: OPEN_SETTING_TOAST,
        //   payload: { data: "Inserted Successfully ✔", for: "insert" },
        // });
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const updateSetting = (mongoId, data) => (dispatch) => {
  axios
    .patch(`setting/update?settingId=${mongoId}`, data)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: GET_SETTING, payload: res.data.setting });
        dispatch({
          type: OPEN_SETTING_TOAST,
          payload: { data: "Updated Successfully ✔", for: "update" },
        });
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};

export const handleSwitch = (mongoId, type, value) => (dispatch) => {
  axios
    .patch(`setting?settingId=${mongoId}&type=${type}`)
    .then((res) => {
      if (res.data.status) {
        dispatch({ type: SWITCH_ACCEPT, payload: res.data.setting });
        dispatch({
          type: OPEN_SETTING_TOAST,
          payload: {},
        });
        Toast(
          "success",
          `${type === "IptvAPI" ? "Live TV" : type} is ${
            value !== true ? "Active" : "Enable"
          } `
        );
      } else {
        console.log("error", res.data.message);
      }
    })
    .catch((error) => console.log("error", error.message));
};
