import React from "react";
import Navbar from "./Navbar";
import $ from "jquery";
import logo from "../assets/images/logo.png";
//MUI
import { makeStyles } from "@material-ui/core";
import FeaturedVideoOutlinedIcon from "@material-ui/icons/FeaturedVideoOutlined";

//react-router-dom
import { NavLink, useHistory } from "react-router-dom";

//Alert
import Swal from "sweetalert2";

//Redux - Action
import { UNSET_ADMIN } from "../../store/Admin/admin.type";
import { useDispatch } from "react-redux";


// icon
import liveTv from "../assets/images/liveTv.png"
import dashBoard from "../assets/images/dashboard.png"
import User from "../assets/images/User.png"
import movie from "../assets/images/movie.png"
import webSires from "../assets/images/Web Series.png"
import genre from "../assets/images/Genre.png"
import region from "../assets/images/Region.png"
import plan from "../assets/images/plan.png"
import profile from "../assets/images/profile.png"
import setting from "../assets/images/setting.png"
import Advertisement from "../assets/images/AdvertiseMent.png"
import helpCenter from "../assets/images/HelpCenter.png"
import purchaseHistory from "../assets/images/PurchaseHistory.png"; 
import logOut from "../assets/images/logout.png" 




const useStyles = makeStyles(() => ({
  navLink: {
    "&.active": {
      backgroundColor:" #4989F7",
      color: "#fff !important",
      fontWeight: 500,
      fontSize: 16,
    },
    "&.active i": {
      backgroundColor:" #4989F7",
      color: "#fff !important",
      fontWeight: 500,
    },
    "&.active i a span": {
      backgroundColor:" #4989F7",
      color: "#fff !important",
      fontWeight: 500,
    },
  },
}));

const handleClick = () => {
  $(".setting").toggleClass("active");
};

const handleRemove = () => {
  $(".setting").toggleClass("active");
};

const handleCollapse = () => {
  console.log("toggle1");
  $("body").toggleClass("sidebar-main");
  $(".wrapper-menu").toggleClass("open");
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch({ type: UNSET_ADMIN });
          history.push("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="iq-sidebar">
        <div className="iq-sidebar-logo d-flex justify-content-between">
          <NavLink to="/admin/dashboard">
            <div clssName="iq-light-logo">
              {/* <div className="iq-light-logo">
                <img src="images/logo.gif" className="img-fluid" alt />
              </div> */}
              <div className="iq-dark-logo ml-3">
                <img src={logo} className="img-fluid" alt />
              </div>
            </div>

            <span
              style={{ fontWeight: "600", fontSize: "30px", color: "#fff" }}
            >
              Mova
            </span>
          </NavLink>
          <div className="iq-menu-bt-sidebar">
            <div className="iq-menu-bt align-self-center">
              <div className="wrapper-menu">
                <div onClick={() => handleCollapse}>
                  <i className="ri-menu-3-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="sidebar-scrollbar">
          <div
            className="scroll-content"
            // style={{ transform: "translate3d(0px, -550px, 0px)" }}
          >
            <nav className="iq-sidebar-menu">
              <ul id="iq-sidebar-toggle" className="iq-menu">
             
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={`${classes.navLink} ` }
                  >
                    <img src={dashBoard} width="25px" height="25px"/>
                    <span className="pl-2">Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/user" className={`${classes.navLink}` }>
                    {/* className="iq-waves-effect"  */}
                    <img src={User} width="25px" height="25px"/>
                    <span className="pl-2">User</span>
                  </NavLink>
                </li>

          

                <li>
                  <NavLink to="/admin/movie" className={`${classes.navLink}`}>
                    {/* className="iq-waves-effect" */}
                    <img src={movie} width="25px" height="25px"/>
                    <span className="pl-2">Movie</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/web_series"
                    className={`${classes.navLink}`}
                  >
          
          <img src={webSires} width="25px" height="25px"/>
                    <span className="pl-2">Web Series</span>
                  </NavLink>
                </li>
         
                <li>
                  <NavLink to="/admin/live_tv" className={`${classes.navLink}`}>
                   <img src={liveTv} width="25px" height="25px"/>
                    <span className="pl-2">Live TV</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/region" className={`${classes.navLink}`}>
                  <img src={region} width="25px" height="25px"/>
                    <span  className="pl-2">Region</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/genre" className={`${classes.navLink}`}>
                  <img src={genre} width="25px" height="25px"/>
                    <span className="pl-2">Genre</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/premium_plan"
                    className={`${classes.navLink}`}
                  > <img src={plan} width="25px" height="25px"/>
                    
                    <span  className="pl-2">Plan</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/premium_plan_history"
                    className={`${classes.navLink}`}
                  >
                    <img src={purchaseHistory} width="25px" height="25px"/>
                    <span  className="pl-2">Purchase Plan History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/advertisement"
                    className={`${classes.navLink}`}
                  >
                     <img src={Advertisement} width="25px" height="25px"/>
                    <span className="pl-2">Advertisement</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/admin/help_center/faq"
                    className={`${classes.navLink}`}
                  >
                   <img src={helpCenter} width="25px" height="25px"/>
                    <span  className="pl-2">Help Center</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/setting" className={`${classes.navLink}`}>
                  <img src={setting} width="25px" height="25px"/>
                    <span  className="pl-2">Setting</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/admin/profile/admin_info"
                    className={`${classes.navLink}`}
                    onClick={handleRemove}
                  >
                     <img src={profile} width="25px" height="25px"/>
                    <span  className="pl-2">Profile</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/login"
                    className={`${classes.navLink}`}
                    onClick={logout}
                  > <img src={logOut} width="25px" height="25px"/>
                   
                    <span  className="pl-2">Log Out</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div
            className="scrollbar-track scrollbar-track-x"
            // style={{ display: "none" }}
            style={{ display: "block" }}
          >
            <div
              className="scrollbar-thumb scrollbar-thumb-x"
              style={{
                width: "260px",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            ></div>
          </div>
          <div
            className="scrollbar-track scrollbar-track-y"
            // style={{ display: "block" }}
            style={{ display: "none" }}
          >
            <div
              className="scrollbar-thumb scrollbar-thumb-y"
              style={{
                height: "235.982px",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            ></div>
          </div>

          <div className="p-3" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
