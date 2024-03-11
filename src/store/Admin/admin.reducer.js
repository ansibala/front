//Token and Key
import setToken from "../../Util/setToken";
import setDevKey from "../../Util/setDevKey";
import jwt_decode from "jwt-decode";
import { devKey } from "../../Util/ServerPath";

//Types
import {
  SET_ADMIN,
  UNSET_ADMIN,
  SET_LOGIN_ERROR,
  CLEAR_LOGIN_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_NAME,
  OPEN_ADMIN_TOAST,
  CLOSE_ADMIN_TOAST,
  FORGOT_PASSWORD,
} from "./admin.type";

//Define initialStates
const initialState = {
  isAuth: false,
  admin: {},
  toast: false,
  toastData: null,
  actionFor: null,
  password: {},
};

const adminReducer = (state = initialState, action) => {
  let decoded;

  switch (action.type) {
    //Set admin
    case SET_ADMIN:
      if (action.payload) {
        decoded = jwt_decode(action.payload);
      }
      setToken(action.payload);
      setDevKey(devKey);
      sessionStorage.setItem("token", action.payload);
      sessionStorage.setItem("key", devKey);

      return {
        ...state,
        isAuth: true,
        admin: decoded,
        flag: decoded,
      };

    //unset admin
    case UNSET_ADMIN:
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("key");
      setDevKey(null);
      setToken(null);
      return {
        ...state,
        isAuth: false,
        admin: {},
      };

    //Update admin Profile
    case UPDATE_PROFILE:
      return {
        ...state,
        admin: {
          ...state,
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          flag: action.payload.flag,
        },
      };

    //Update Admin Name
    case UPDATE_PROFILE_NAME:
      return {
        ...state,
        admin: action.payload,
      };

    //Open admin Toast
    case OPEN_ADMIN_TOAST:
      
      return {
        ...state,
        toast: true,
        toastData: action.payload.data || null,
        actionFor: action.payload.for || null,
      };

    //Close admin Toast
    case CLOSE_ADMIN_TOAST:
      return {
        ...state,
        toast: false,
        toastData: null,
        actionFor: null,
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };

    default:
      return state;
  }
};

export default adminReducer;
