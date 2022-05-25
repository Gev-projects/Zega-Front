// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { url } from "../../helper";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export default function AccountPageProfile() {
    const customer = useSelector((state) => state.customer);
    const [address, setAddress] = useState();
    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState(false);
    const [successData, setSuucessData] = useState();
    const [input, setInput] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        input[e.target.name] = e.target.value;
        setInput(input);
    };
    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;
        if (customer.token) {
            fetch(url + "/api/customer/get?token=" + customer.token, { single: single })
                .then((responce) => responce.json())
                .then((res) => {
                    if (res) {
                        setAddress(res.data);
                    }
                })
                .catch((err) => console.error(err));
        }

        return function cleaup() {
            abortController.abort();
        };
    }, [customer.token]);

    if (!address) {
        return "";
    }
    const handleClick = (event) => {
        event.preventDefault();
        setLoading(true);
        let option = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                token: customer.token,
                first_name: input.first_name !== undefined ? input.first_name : address.first_name,
                last_name: input.last_name !== undefined ? input.last_name : address.last_name,
                email: input.email !== undefined ? input.email : address.email,
                password: input.password,
                password_confirmation: input.password_confirmation,
                gender: input.gender !== undefined ? input.gender : address.gender,
                phone: input.phone !== undefined ? input.phone : address.phone,
                date_of_birth: null,
            }),
        };

        fetch(`${url}/api/customer/profile`, option)
            .then((response) => response.json())
            .then((res) => {
                setLoading(false);
                if (res.errors) {
                    setErrors(res.errors);
                } else {
                    setSuccess(true);
                    setSuucessData(res.message);
                }
            });
    };

    const ErrorsOutput = () => {
        const arr = [];
        for (let error in errors) {
            arr.push(<div>{errors[error]}</div>);
        }
        return arr;
    };
    return (
        <div className="card input-fields-parent">
            <Helmet>
                <title>{`Profile — ${theme.name}`}</title>
            </Helmet>

            {/*<div className="card-header px-5">*/}
            {/*    <h5>*/}
            {/*        <FormattedMessage id="editProfile" defaultMessage="Edit account" />*/}
            {/*    </h5>*/}
            {/*</div>*/}
            {errors ? <div className="alert alert-danger">{ErrorsOutput()}</div> : ""}

            {success ? <div className="alert alert-success">{successData}</div> : ""}
            {/*<div className="card-divider" />*/}
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12">
                        <div className="form-group col-12 col-xs-6 col-sm-6 input-paddings">
                            <label className="account-input-title" htmlFor="profile-first-name">
                                <FormattedMessage id="reg.firstname" defaultMessage="Name" />
                            </label>
                            <input
                                id="profile-first-name"
                                name="first_name"
                                onChange={handleChange}
                                defaultValue={address ? address.first_name : ""}
                                value={input.first_name}
                                type="text"
                                className="form-control border-input-light f16"
                            />
                        </div>
                        <div className="form-group col-12 col-xs-6 col-sm-6 input-paddings">
                            <label className="account-input-title" htmlFor="profile-last-name">
                                <FormattedMessage id="reg.surname" defaultMessage="Surname" />{" "}
                            </label>
                            <input
                                id="profile-last-name"
                                name="last_name"
                                onChange={handleChange}
                                defaultValue={address ? address.last_name : ""}
                                value={input.last_name}
                                type="text"
                                className="form-control border-input-light f16"
                            />
                        </div>

                        {/*<div className="form-group col-12 col-xs-6 col-sm-6">*/}
                        {/*    <label className="account-input-title" htmlFor="checkout-country">*/}
                        {/*        <FormattedMessage id="gender" defaultMessage="Gender" />*/}
                        {/*    </label>*/}
                        {/*    <select*/}
                        {/*        defaultValue={address ? address.gender : ""}*/}
                        {/*        value={input.gender}*/}
                        {/*        name="gender"*/}
                        {/*        id="checkout-country"*/}
                        {/*        className="form-control form-control-select2 f16"*/}
                        {/*        onChange={handleChange}*/}
                        {/*    >*/}
                        {/*        <option></option>*/}
                        {/*        <FormattedMessage id="male" defaultMessage="Male">*/}
                        {/*            {(message) => <option value={"male"}>{message}</option>}*/}
                        {/*        </FormattedMessage>*/}
                        {/*        <FormattedMessage id="female" defaultMessage="Female">*/}
                        {/*            {(message) => <option value={"female"}>{message}</option>}*/}
                        {/*        </FormattedMessage>*/}
                        {/*    </select>*/}
                        {/*</div>*/}
                        <div className="form-group col-12 col-xs-6 col-sm-6 input-paddings">
                            <label className="account-input-title" htmlFor="profile-email">
                                <FormattedMessage id="global.email" defaultMessage="E-mail" />
                            </label>
                            <input
                                onChange={handleChange}
                                name="email"
                                defaultValue={address ? address.email : ""}
                                value={input.email}
                                id="profile-email"
                                type="email"
                                className="form-control border-input-light f16"
                            />
                        </div>
                        {/*<div className="form-group col-12 col-xs-6 col-sm-6">*/}
                        {/*    <label className="account-input-title" htmlFor="profile-phone">*/}
                        {/*        <FormattedMessage id="phone" defaultMessage="Tel։" />*/}
                        {/*    </label>*/}
                        {/*    <input*/}
                        {/*        onChange={handleChange}*/}
                        {/*        defaultValue={address ? address.phone : ""}*/}
                        {/*        value={input.phone}*/}
                        {/*        name="phone"*/}
                        {/*        id="profile-phone"*/}
                        {/*        type="text"*/}
                        {/*        className="form-control f16"*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="form-group col-12 col-xs-6 col-sm-6 input-paddings">
                            <label
                                className="account-input-title"
                                htmlFor="password-current"
                                // className="password-responsive"
                            >
                                <FormattedMessage id="account.password" defaultMessage="Password" />
                            </label>
                            <input
                                onChange={handleChange}
                                value={input.password}
                                name="password"
                                type="password"
                                className="form-control border-input-light f16"
                                id="password-current"
                            />
                        </div>
                        {/*<div className="form-group col-12 col-xs-6 col-sm-6">*/}
                        {/*    <label className="account-input-title" htmlFor="password-new">*/}
                        {/*        <FormattedMessage id="passwordConfirmation" defaultMessage="Confirm password" />*/}
                        {/*    </label>*/}
                        {/*    <input*/}
                        {/*        onChange={handleChange}*/}
                        {/*        value={input.password_confirmation}*/}
                        {/*        name="password_confirmation"*/}
                        {/*        type="password"*/}
                        {/*        className="form-control f16"*/}
                        {/*        id="password-new"*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="col-12 col-xs-6 col-sm-12 account-save-profile">
                            <button
                                onClick={handleClick}
                                type="button"
                                className={
                                    !loading
                                        ? "btn btn-primary f16 btn-primary-fms"
                                        : "btn btn-primary btn-primary-fms  f16"
                                }
                            >
                                <FormattedMessage id="personal-save-btn" defaultMessage="Save changes" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
