// react
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url } from "../../helper";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
const AccountPageNewAddresses = () => {
    const form = useRef(null);
    const customer = useSelector((state) => state.customer);
    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState(false);
    const [successData, setSuucessData] = useState();
    const [input, setInput] = useState({});

    useEffect(() => {
        let timer1;
        if (success || errors) {
            timer1 = setTimeout(() => {
                setErrors(false);
                setSuccess(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timer1);
        };
    }, [errors, success]);
    const handleChange = (e) => {
        input[e.target.name] = e.target.value;
        setInput(input);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let option = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: customer.token,
                first_name: input.first_name,
                last_name: input.last_name,
                address1: [input.address1],
                city: input.city,
                country: "AM",
                country_name: input.country,
                phone: input.phone,
                postcode: input.postcode,
                state: input.state || "Armenia",
            }),
        };

        fetch(`${url}/api/addresses/create`, option)
            .then((response) => response.json())
            .then((res) => {
                if (res.errors) {
                    setErrors(res.errors);
                } else {
                    setSuccess(true);
                    setSuucessData(res.message);
                    setInput({
                        first_name: "",
                        last_name: "",
                        address1: "",
                        city: "",
                        country_name: "",
                        postcode: "",
                        phone: "",
                        state: "",
                    });
                }
            });
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const ErrorsOutput = () => {
        const arr = [];
        for (let error in errors) {
            arr.push(<div>{errors[error]}</div>);
        }
        return arr;
    };
    return (
        <>
            {errors ? <div className="alert alert-danger">{ErrorsOutput()}</div> : ""}
            {success ? <div className="alert alert-success">{successData}</div> : ""}
            <form ref={form} onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="row no-gutters">
                        <div className="col-12 col-lg-10 col-xl-8">
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="checkout-first-name">
                                        <FormattedMessage id="account.firstName" defaultMessage="First name" />
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        name="first_name"
                                        value={input.first_name}
                                        defaultValue=""
                                        type="text"
                                        className="form-control f15"
                                        id="checkout-first-name"
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="checkout-last-name">
                                        <FormattedMessage id="checkout.lname" defaultMessage="Last name" />
                                    </label>
                                    <input
                                        value={input.last_name}
                                        defaultValue=""
                                        onChange={handleChange}
                                        name="last_name"
                                        type="text"
                                        className="form-control f15"
                                        id="checkout-last-name"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkout-street-address">
                                    <FormattedMessage id="street.address" defaultMessage="Street Address" />{" "}
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={input.address1}
                                    defaultValue=""
                                    name="address1"
                                    type="text"
                                    className="form-control f15"
                                    id="checkout-street-address"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkout-city">
                                    <FormattedMessage id="global.city" defaultMessage=" Town / City" />{" "}
                                </label>
                                <input
                                    onChange={handleChange}
                                    name="city"
                                    value={input.city}
                                    defaultValue=""
                                    type="text"
                                    className="form-control f15"
                                    id="checkout-city"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkout-state">
                                    <FormattedMessage id="state.country " defaultMessage="State / County" />{" "}
                                </label>
                                <input
                                    onChange={handleChange}
                                    defaultValue=""
                                    value={input.state}
                                    name="state"
                                    type="text"
                                    className="form-control f15"
                                    id="checkout-state"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkout-postcode">
                                    <FormattedMessage id="postcode.zip" defaultMessage="Postcode / ZIP" />
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={input.postcode}
                                    defaultValue=""
                                    name="postcode"
                                    type="text"
                                    className="form-control f15"
                                    id="checkout-postcode"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="checkout-phone">
                                        <FormattedMessage id="account.phone" defaultMessage=" Phone" />
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        value={input.phone}
                                        defaultValue=""
                                        name="phone"
                                        type="number"
                                        className="form-control f15"
                                        id="checkout-phone"
                                    />
                                </div>
                            </div>

                            <div className="form-group mt-3 mb-0">
                                <button className="btn btn-primary btn-lg f15" type="submit">
                                    <FormattedMessage id="save" defaultMessage="Save"></FormattedMessage>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AccountPageNewAddresses;
