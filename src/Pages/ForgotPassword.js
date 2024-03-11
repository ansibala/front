//react
import React, { useState } from "react";

// routing
import { Link } from "react-router-dom";

//login form logo
import logo from "../Component/assets/images/logo.png";

// action
import { sendEmail } from "../store/Admin/admin.action";

//redux
import { connect } from "react-redux";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    //Validation
    if (!email) {
      const error = {};
      if (!email) error.email = "Email is required !";

      return setError({ ...error });
    }
    const content = {
      email: email,
    };

    props.sendEmail(content);

    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  return (
    <>
      <div className="sign section--bg sign-one-bg">
        <div className="bg-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="sign__content">
                  <form action="#" className="sign__form">
                    <a href="index.html" className="sign__logo">
                      <img src={logo} width="70px" height="70px" alt />
                    </a>
                    <div className="sign__group">
                      <label
                        for="useremail"
                        className="form-label fs-5 text-primary"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              email: "Email is required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              email: "",
                            });
                          }
                        }}
                      />
                      {error.email && (
                        <span style={{ color: "red" }}>{error.email}</span>
                      )}
                    </div>

                    <button
                      className="sign__btn"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Send Email
                    </button>

                    <span className="sign__text">
                      <Link
                        to="/login"
                        className="fw-semibold text-decoration-underline fs-5 justify-content-center"
                      >
                        Back to Login Page?
                      </Link>
                      {/* <a href="forgot.html">Forgot password?</a> */}
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { sendEmail })(ForgotPassword);
