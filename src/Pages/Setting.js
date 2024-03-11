import React, { useState, useEffect } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//react-router-dom
import { Link } from "react-router-dom";

//mui
import Switch from "@material-ui/core/Switch";

//action
import {
  getSetting,
  updateSetting,
  handleSwitch,
} from "../store/Setting/setting.action";
import { CLOSE_SETTING_TOAST } from "../store/Setting/setting.type";

//Alert
import { setToast } from "../Util/Toast";
import { warning, alert } from "../Util/Alert";
import { permissionError } from "../Util/Alert";

const Setting = (props) => {
  const dispatch = useDispatch();
  const [mongoId, setMongoId] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [razorPayKeyId, setRazorPayKeyId] = useState("");
  const [googlePlayEmail, setGooglePlayEmail] = useState("");
  const [googlePlayKey, setGooglePlayKey] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [razorSecretKey, setRazorSecretKey] = useState("");
  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [isAppActive, setIsAppActive] = useState(false);
  const [razorPaySwitch, setRazorPaySwitch] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [paymentGateway, setPaymentGateway] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [isIptvAPI, setIsIptvAPI] = useState(false);

  useEffect(() => {
    props.getSetting(); // eslint-disable-next-line
  }, []);

  const { setting, toast, toastData, actionFor } = useSelector(
    (state) => state.setting
  );

  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    // if (setting) {
    //   const data = setting?.paymentGateway?.map((data) => {
    //     return {
    //       name: data,
    //     };
    //   });

    setMongoId(setting._id);
    setPrivacyPolicyLink(setting.privacyPolicyLink);
    setPrivacyPolicyText(setting.privacyPolicyText);
    setGooglePlayEmail(setting.googlePlayEmail);
    setGooglePlayKey(setting.googlePlayKey);
    setStripePublishableKey(setting.stripePublishableKey);
    setStripeSecretKey(setting.stripeSecretKey);
    setRazorSecretKey(setting.razorSecretKey);
    setCurrency(setting.currency);
    setGooglePlaySwitch(setting.googlePlaySwitch);
    setStripeSwitch(setting.stripeSwitch);
    setIsAppActive(setting.isAppActive);
    setRazorPaySwitch(setting.razorPaySwitch);
    setPaymentGateway(setting.paymentGateway);
    setRazorPayKeyId(setting.razorPayId);
    setIsIptvAPI(setting.isIptvAPI);

    // setSelectedValue(data);
    // }
  }, [setting]);

  const handleSubmit = (e) => {
e.preventDefault()
    if (!hasPermission) return permissionError();

    const data = {
      razorPayId: razorPayKeyId,
      privacyPolicyLink,
      privacyPolicyText,
      googlePlayEmail,
      googlePlayKey,
      stripePublishableKey,
      stripeSecretKey,
      razorSecretKey,
      currency,
      paymentGateway,
    };

    props.updateSetting(mongoId, data);
  };

  const handleSwitch_ = (type) => {
    if (!hasPermission) return permissionError();
    props.handleSwitch(mongoId, type);
  };

  
  const handleGooglePlay = (type) => {
    if (!hasPermission) return permissionError();

    props.handleSwitch(mongoId, type);
  };

  //toast
  useEffect(() => {
    if (toast) {
      setToast(toastData, actionFor);
      dispatch({ type: CLOSE_SETTING_TOAST });
    }
  }, [toast, toastData, actionFor, dispatch]);

  return (
    <>
      <div id="content-page" className="content-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <h4 className="mb-3 mt-4">Payment Setting</h4>
              <div className="row mb-3">
                <div class="col-sm-6">
                  <div class="iq-card iq-mb-3 p-1">
                    <div class="iq-card-body card-background pr-0">
                      <div class="iq-card-title p-2">
                        <div className=" d-flex justify-content-between mb-3">
                          <h5 className=""> Stripe</h5>
                          <label class="switch ">
                            <Switch
                              onChange={() => handleSwitch_("stripe")}
                              checked={stripeSwitch}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </label>
                        </div>

                        <form>
                          <div class="mb-3">
                            <label
                              for="publishableKey"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Publishable Key
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="publishableKey"
                              value={stripePublishableKey}
                              onChange={(e) =>
                                setStripePublishableKey(e.target.value)
                              }
                            />
                          </div>
                          <div class="mb-3">
                            <label
                              for="secretKey"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Secret Key
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="secretKey"
                              value={stripeSecretKey}
                              onChange={(e) =>
                                setStripeSecretKey(e.target.value)
                              }
                            />
                          </div>
                          <div className="d-flex justify-content-end my-2 ">
                            <button
                              type="button"
                              class="btn dark-icon btn-primary"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                

                <div class="col-sm-6">
                  <div class="iq-card iq-mb-3 p-1">
                    <div class="iq-card-body card-background">
                      <div class="iq-card-title p-2">
                        <div className=" d-flex justify-content-between mb-3">
                          <h5 className=""> Razorpay</h5>
                          <label class="switch ">
                            <Switch
                              onChange={() => handleSwitch_("razorPay")}
                              checked={razorPaySwitch}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </label>
                        </div>

                        <form>
                          <div class="mb-3">
                            <label
                              for="publishableKey"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Razorpay key ID
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="publishableKey"
                              value={razorPayKeyId}
                              onChange={(e) => setRazorPayKeyId(e.target.value)}
                            />
                          </div>
                          <div class="mb-3">
                            <label
                              for="secretKey"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Secret Key
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="secretKey"
                              value={razorSecretKey}
                              onChange={(e) =>
                                setRazorSecretKey(e.target.value)
                              }
                            />
                          </div>
                          <div className="d-flex justify-content-end my-2">
                            <button
                              type="button"
                              class="btn btn-primary"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="iq-header-title">
                <h4
                  class="card-title dark"
                  style={{ color: "#8c91b6 !important", marginBottom: "14px" }}
                >
                  App Setting
                </h4>
              </div>
              <div className="row">
                <div class="col-sm-6">
                  <div class="iq-card iq-mb-3 mb-5 p-1">
                    <div class="iq-card-body card-background">
                      <div class="iq-card-title p-2">
                        <div className=" d-flex justify-content-between mb-3">
                          <h5>Is App Active</h5>
                          <label class="switch">
                            <Switch
                              onChange={() => handleSwitch_("app active")}
                              checked={isAppActive}
                              color="primary"
                              name="checkedB"
                              inputProps={{
                                "aria-label": "primary checkbox",
                              }}
                            />
                          </label>
                        </div>

                        <form>
                          <div class="mb-3">
                            <label
                              for="policyLink"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Privacy Policy Link
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="policyLink"
                              value={privacyPolicyLink}
                              onChange={(e) =>
                                setPrivacyPolicyLink(e.target.value)
                              }
                            />
                          </div>
                          <div class="mb-3">
                            <label
                              for="policyText"
                              class="form-label"
                              style={{ color: "#fdfdfd" }}
                            >
                              Privacy Policy Text
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="policyText"
                              value={privacyPolicyText}
                              onChange={(e) =>
                                setPrivacyPolicyText(e.target.value)
                              }
                            />
                          </div>
                          <div className="d-flex justify-content-end my-2">
                            <button
                              type="button"
                              class="btn dark-icon btn-primary"
                              // className="btn iq-pf-primary mb-3 mt-1"
                              // className="btn btn-setting mr-2"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  Setting
);
