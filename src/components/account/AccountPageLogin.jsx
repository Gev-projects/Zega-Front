// react
import React, { useState, useRef, useEffect } from "react";

// third-party
import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";
// data stubs
import theme from "../../data/theme";
import { useHistory } from "react-router-dom";
import AccountLogin from "./AccountLogin";

export default function AccountPageLogin() {
    const [placeholders, Setplaceholders] = useState({
        mail: "block",
        password: "block",
        confirm: "block",
    });

    let mailRef = useRef();
    let passwordRef = useRef();
    let confirmRef = useRef();

    let toggleMailPlaceholder = function () {
        if (mailRef.current.value != "") {
            Setplaceholders({ mail: "none" });
        } else {
            Setplaceholders({ mail: "block" });
        }
    };

    let togglePasswordPlaceholder = function () {
        if (passwordRef.current.value != "") {
            Setplaceholders({ password: "none" });
        } else {
            Setplaceholders({ password: "block" });
        }
    };

    let toggleConfirmPlaceholder = function () {
        if (confirmRef.current.value != "") {
            Setplaceholders({ confirm: "none" });
        } else {
            Setplaceholders({ confirm: "block" });
        }
    };

    ///////////////////////////////////////////

    const [input, Setinput] = useState({});
    const history = useHistory();

    const breadcrumb = [
        { title: <FormattedMessage id="topbar.home" defaultMessage="Home" />, url: "" },
        { title: <FormattedMessage id="topbar.myAccount" defaultMessage="My account" />, url: "" },
    ];

    const checkEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return "true";
        }
        // SetError( [...error,[{'pass':'not equal'}]])
        return "false";
    };

    const comfirmPss = () => {
        return false;
    };

    const register = (event) => {
        event.preventDefault();

        checkEmail();
        comfirmPss();

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: input.email,
                password: input.password,
                password_confirmation: input.confirm_password,
            }),
        };

        fetch(url + "/api/customer/register", options)
            .then((responce) => responce.json())
            .then((res) => {
                if (res.message == "Your account has been created successfully.") {
                    history.push("/");
                } else {
                    if (res.email.length) {
                        alert(res.email[0]);
                    }

                    if (res.password.length) {
                        alert(res.password[0]);
                    }
                }
            });
        // .catch(err=>console.error(err,'a'));
    };

    const handleChange = (e) => {
        input[e.target.name] = e.target.value;
        Setinput(input);
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Login — ${theme.name}`}</title>
            </Helmet>

            <FormattedMessage id="topbar.myAccount" defaultMessage="My account">
                {(account) => <PageHeader header={account} breadcrumb={breadcrumb} />}
            </FormattedMessage>

            <div className="block">
                <div className="container p-0 login-container">
                    <div className="row">
                        <div className=" col-md-6 d-flex mt-4 mt-md-0">
                            <div className="card flex-grow-1 mb-0">
                                <div className="card-body p-5">
                                    <h3 className="card-title">
                                        <FormattedMessage id="login.sign.up" defaultMessage="Sign Up" />
                                    </h3>
                                    <form>
                                        <div className="form-group position-relative">
                                            <FormattedMessage id="topbar.email" defaultMessage="E-mail">
                                                {(placeholder) => (
                                                    <input
                                                        id="register-email"
                                                        name="email"
                                                        onChange={handleChange}
                                                        type="email"
                                                        className="form-control login-input"
                                                        // placeholder=   {placeholder}
                                                        ref={mailRef}
                                                        onInput={toggleMailPlaceholder}
                                                    />
                                                )}
                                            </FormattedMessage>
                                            <span
                                                className="mail-placeholder"
                                                style={{ display: `${placeholders.mail}` }}
                                            >
                                                Email<span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <div className="form-group position-relative">
                                            <FormattedMessage id="topbar.password" defaultMessage="Password">
                                                {(placeholder) => (
                                                    <input
                                                        id="register-password"
                                                        name="password"
                                                        type="password"
                                                        onChange={handleChange}
                                                        className="form-control login-input"
                                                        //  placeholder={placeholder}
                                                        ref={passwordRef}
                                                        onInput={togglePasswordPlaceholder}
                                                    />
                                                )}
                                            </FormattedMessage>
                                            <span
                                                className="password-placeholder"
                                                style={{ display: `${placeholders.password}` }}
                                            >
                                                Password<span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <div className="form-group position-relative">
                                            <FormattedMessage id="passwordConfirm" defaultMessage="Confirm password">
                                                {(placeholder) => (
                                                    <input
                                                        id="register-repat-password"
                                                        name="confirm_password"
                                                        type="password"
                                                        onChange={handleChange}
                                                        className="form-control login-input"
                                                        // placeholder={placeholder}
                                                        ref={confirmRef}
                                                        onInput={toggleConfirmPlaceholder}
                                                    />
                                                )}
                                            </FormattedMessage>
                                            <span
                                                className="password-placeholder"
                                                style={{ display: `${placeholders.confirm}` }}
                                            >
                                                Confirm Password<span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <button
                                            type="submit"
                                            onClick={register}
                                            className="btn btn-lg btn-orange login-button rounded-pill"
                                        >
                                            <FormattedMessage id="topbar.register" defaultMessage="Registration" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 d-flex">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <AccountLogin />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
