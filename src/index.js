import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
//react-router-dom
import { BrowserRouter } from "react-router-dom";

//axios
import axios from "axios";

//react-redux
import { Provider } from "react-redux";

//Provider
import store from "./store/Provider";
import { OPEN_LOADER, CLOSE_LOADER } from "./store/Loader/loader.type";

//BaseUrl
import { baseURL } from "./Util/ServerPath";
axios.defaults.baseURL = baseURL;

//Spinner
axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: OPEN_LOADER });
    // Real Admin
    return req;
  },
  (error) => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_LOADER });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
    }
    store.dispatch({ type: CLOSE_LOADER });
    return Promise.reject(err);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <div className="dark">
      <App />
    </div>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
