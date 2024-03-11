import React, { useState, useEffect } from "react";

// material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Tooltip,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";

//Alert
import { permissionError } from "../../Util/Alert";

//action
import {
  createNewPremiumPlan,
  editPremiumPlan,
} from "../../store/PremiumPlan/plan.action";
import { CLOSE_PREMIUM_PLAN_DIALOG } from "../../store/PremiumPlan/plan.type";

const PremiumPlanDialog = (props) => {
  const dispatch = useDispatch();

  const hasPermission = useSelector((state) => state.admin.admin.flag);
  const { dialog: open, dialogData } = useSelector(
    (state) => state.premiumPlan
  );

  // const hasPermission = useSelector((state) => state.admin.admin.flag);
  const [name, setName] = useState("");
  const [premiumPlanId, setPremiumPlanId] = useState("");
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("");
  const [dollar, setDollar] = useState("");
  const [tag, setTag] = useState("");
  const [productKey, setProductKey] = useState("");
  const [planBenefit, setPlanBenefit] = useState("");

  const [error, setError] = useState({
    validity: "",
    dollar: "",
    productKey: "",
    planBenefit: "",
  });

  useEffect(() => {
    if (dialogData) {
      setPremiumPlanId(dialogData._id);
      setValidity(dialogData.validity);
      setValidityType(dialogData.validityType);
      setDollar(dialogData.dollar);
      setTag(dialogData.tag);
      setProductKey(dialogData.productKey);
      setName(dialogData.name);
      setPlanBenefit(dialogData.planBenefit);
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        validity: "",
        dollar: "",
        productKey: "",
        planBenefit: "",
      });
      setPremiumPlanId("");
      setValidity("");
      setValidityType("");
      setTag("");
      setDollar("");
      setProductKey("");
      setName("");
      setPlanBenefit("");
    },
    [open]
  );

  const handleClose = () => {
    dispatch({ type: CLOSE_PREMIUM_PLAN_DIALOG });
  };

  const handleSubmit = () => {
    if (!hasPermission) return permissionError();
    if (!validity || !dollar || !productKey || !planBenefit || !name) {
      const error = {};
      if (!name) error.name = "Name is required!";
      if (!validity) error.validity = "Validity is required!";
      if (!dollar) error.dollar = "Dollar is required!";
      if (!productKey) error.productKey = "Product Key is required!";
      if (!planBenefit) error.planBenefit = "Plan Benefit is required!";

      return setError({ ...error });
    } else {
      const validityValid = isNumeric(validity);
      if (!validityValid) {
        return setError({ ...error, validity: "Invalid Validity!!" });
      }
      const dollarValid = isNumeric(dollar);
      if (!dollarValid) {
        return setError({ ...error, dollar: "Invalid Dollar!!" });
      }
      const data = {
        validity,
        validityType: validityType ? validityType : "month",
        dollar,
        tag,
        productKey,
        name,
        planBenefit,
      };

      if (premiumPlanId) {
        props.editPremiumPlan(premiumPlanId, data);
      } else {
        props.createNewPremiumPlan(data);
      }
      handleClose();
    }
  };

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogData ? <h5>Edit Premium Plan</h5> : <h5>Add Premium Plan</h5>}
        </DialogTitle>

        {/* <IconButton
          style={{
            position: "absolute",
            right: 0,
            color: "#b7b5b9",
          }}
        > */}
        <Tooltip title="Close">
          <Cancel
            className="cancelButton"
            style={{
              position: "absolute",
              top: "23px",
              right: "15px",
              color: "#fff",
            }}
            onClick={handleClose}
          />
        </Tooltip>

        {/* </IconButton> */}
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control form-control-line"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: "name is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      />
                      {error.name && (
                        <div className="ml-2 mt-1">
                          {error.name && (
                            <div className="pl-1 text__left">
                             {error.name && (
                        <span className="error">{error.name}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 text-white">
                        Validity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="1"
                        value={validity}
                        onChange={(e) => {
                          setValidity(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              validity: "Validity is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              validity: "",
                            });
                          }
                        }}
                      />
                      {error.validity && (
                        <div className="ml-2 mt-1">
                          {error.validity && (
                            <div className="pl-1 text__left">
                                   {error.validity && (
                        <span className="error">{error.validity}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 text-white">
                        Validity Type
                      </label>
                      <select
                        name="type"
                        className="form-control form-control-line"
                        id="type"
                        value={validityType}
                        onChange={(e) => {
                          setValidityType(e.target.value);
                        }}
                      >
                        <option value="month" selected>
                          Month
                        </option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="mb-2 styleForTitle text-white">
                        Product Key
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="android.test.purchased"
                        value={productKey}
                        onChange={(e) => {
                          setProductKey(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              productKey: "Product Key is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              productKey: "",
                            });
                          }
                        }}
                      />
                      {error.productKey && (
                        <div className="ml-2 mt-1">
                          {error.productKey && (
                            <div className="pl-1 text__left">
                                  {error.productKey && (
                        <span className="error">{error.productKey}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 text-white">
                        Amount(in '$')
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        required=""
                        min="0"
                        placeholder="10"
                        value={dollar}
                        onChange={(e) => {
                          setDollar(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              dollar: "Dollar is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              dollar: "",
                            });
                          }
                        }}
                      />
                      {error.dollar && (
                        <div className="ml-2 mt-1">
                          {error.dollar && (
                            <div className="pl-1 text__left">
                                  {error.dollar && (
                        <span className="error">{error.dollar}</span>
                      )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 my-2">
                      <label className="styleForTitle mb-2 text-white">
                        Tag
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="20%"
                        value={tag}
                        onChange={(e) => {
                          setTag(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 my-2">
                      <label className="float-left styleForTitle text-white">
                        Plan Benefit
                      </label>
                      <textarea
                        class="form-control"
                        placeholder="Plan Benefit"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        value={planBenefit}
                        onChange={(e) => {
                          setPlanBenefit(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              planBenefit: "Plan Benefit is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              planBenefit: "",
                            });
                          }
                        }}
                      ></textarea>

                      {error.planBenefit && (
                        <div className="pl-1 text-left">
                              {error.planBenefit && (
                        <span className="error">{error.planBenefit}</span>
                      )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <div>
          <hr className=" dia_border w-100"></hr>
        </div>
        <DialogActions>
          <button
            type="button"
            className="btn btn-danger btn-sm px-3 py-1 mb-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          {dialogData ? (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm px-3 py-1 mr-3 mb-3"
              onClick={handleSubmit}
            >
              Insert
            </button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default connect(null, { createNewPremiumPlan, editPremiumPlan })(
  PremiumPlanDialog
);
