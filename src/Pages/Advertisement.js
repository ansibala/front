import React, { useState, useEffect } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  getAdvertise,
  updateAdvertise,
  advertisementSwitch,
} from "../store/Advertisement/advertisement.action";

//mui
import Switch from "@material-ui/core/Switch";

//Toast
import { setToast } from "../Util/Toast";

//Alert
import { permissionError } from "../Util/Alert";

//type
import { CLOSE_ADS_TOAST } from "../store/Advertisement/advertisement.type";

const Advertisement = (props) => {
  const dispatch = useDispatch();
  const { advertisement, toast, toastData, actionFor } = useSelector(
    (state) => state.advertisement
  );

  const [data, setData] = useState("");
  const [industrialId, setIndustrialId] = useState("");
  const [bannerId, setBannerId] = useState("");
  const [nativeId, setNativeId] = useState("");
  const [mongoId, setMongoId] = useState("");
  const [reward, setReward] = useState("");
  const [industrialIdIos, setIndustrialIdIos] = useState("");
  const [bannerIdIos, setBannerIdIos] = useState("");
  const [nativeIdIos, setNativeIdIos] = useState("");
  const [rewardIos, setRewardIos] = useState("");

  const [show, setShow] = useState(false);

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    props.getAdvertise();
  }, []);

  useEffect(() => {
    setData(advertisement);
  }, [advertisement]);

  useEffect(() => {
    setIndustrialId(advertisement?.interstitial);
    setMongoId(advertisement?._id);
    setBannerId(advertisement?.banner);
    setNativeId(advertisement?.native);
    setReward(advertisement?.reward);
    setIndustrialIdIos(advertisement?.interstitialIos);
    setMongoId(advertisement?._id);
    setBannerIdIos(advertisement?.bannerIos);
    setNativeIdIos(advertisement?.nativeIos);
    setRewardIos(advertisement?.rewardIos);
    setShow(advertisement?.isGoogleAdd);
  }, [advertisement]);

  const handleSubmit = () => {
    let data = {
      interstitial: industrialId,
      native: nativeId,
      banner: bannerId,
      interstitialIos: industrialIdIos,
      nativeIos: nativeIdIos,
      bannerIos: bannerIdIos,
      reward,
      rewardIos,
    };
    if (!hasPermission) return permissionError();
    props.updateAdvertise(data, mongoId);
  };
  const handleChangeShow = () => {
    if (!hasPermission) return permissionError();
    props.advertisementSwitch(mongoId);
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_ADS_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div class="row mt-3">
                <div class="col-sm-12 col-md-6 px-0"> <div class="iq-header-title my-3 ml-4">
                <h4 class="card-title dark ">Advertisement</h4>
              </div></div>
                <div class="col-sm-12 col-md-6 pr-5">
                <div className=" d-flex justify-content-end mb-3 pt-3">
                          <h5>Google Ads</h5>
                          <label class="switch">
                            <Switch
                              onChange={handleChangeShow}
                              checked={show}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </label>
                        </div>
                </div>
              </div>
             
              <div className="row">
                <div class="col-sm-12">
                  <div className="iq-card">
                    <div className="iq-card-body">
                      <form className="form-horizontal form-material px-3">
                       
                       
                        <div className="row">
                          <div className="col-lg-6   ">
                            <div className="form-group card-background p-4">
                              <div className="row">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Interstitial Id(Android)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={industrialId}
                                    onChange={(e) => {
                                      setIndustrialId(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Native Id(Android)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={nativeId}
                                    onChange={(e) => {
                                      setNativeId(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Banner Id(Android)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={bannerId}
                                    onChange={(e) => {
                                      setBannerId(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* <div className="row mt-3">
                          <div className="col-md-12">
                            <span
                              className="form-control-label"
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                              }}
                            >
                              Reward(Android)
                            </span>
                            <input
                              type="text"
                              id="input-username"
                              className="form-control mt-2"
                              value={reward}
                              onChange={(e) => {
                                setReward(e.target.value);
                              }}
                            />
                          </div>
                        </div> */}
                            </div>
                          </div>
                          <div className="col-lg-6 ">
                            <div className="form-group card-background p-4">
                              <div className="row">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Interstitial Id(IOS)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={industrialIdIos}
                                    onChange={(e) => {
                                      setIndustrialIdIos(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Native Id(IOS)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={nativeIdIos}
                                    onChange={(e) => {
                                      setNativeIdIos(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-md-12">
                                  <span
                                    className="form-control-label adsData"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 17,
                                    }}
                                  >
                                    Banner Id(IOS)
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={bannerIdIos}
                                    onChange={(e) => {
                                      setBannerIdIos(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* <div className="row mt-3">
                          <div className="col-md-12">
                            <span
                              className="form-control-label"
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                              }}
                            >
                              Reward(IOS)
                            </span>
                            <input
                              type="text"
                              id="input-username"
                              className="form-control mt-2"
                              value={rewardIos}
                              onChange={(e) => {
                                setRewardIos(e.target.value);
                              }}
                            />
                          </div>
                        </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div
                            className="col-sm-12 mt-3"
                            style={{ textAlign: "end" }}
                          >
                            <button
                              className="btn mx-auto mx-md-0 mt-2 text-white px-4 dark-icon btn-primary"
                              type="button"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
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
  getAdvertise,
  updateAdvertise,
  advertisementSwitch,
})(Advertisement);
