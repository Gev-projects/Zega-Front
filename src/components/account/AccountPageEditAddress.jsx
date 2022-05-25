// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { url } from "../../helper";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

export default function AccountPageEditAddress({ id }) {
    const customer = useSelector((state) => state.customer);
    const [address, setAddress] = useState();
    const [success, setSuccess] = useState(false);
    const [successData, setSuucessData] = useState();
    const [errors] = useState();

    const [input, setInput] = useState({});

    const handleChange = (e) => {
        input[e.target.name] = e.target.value;
        setInput(input);
    };
    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;
        if (id.addressId && customer.token) {
            fetch(url + `/api/addresses/${id.addressId}?token=` + customer.token, { single: single })
                .then((responce) => responce.json())
                .then((res) => {
                    if (res.data) {
                        setAddress(res.data);
                    }
                })
                .catch((err) => console.error(err));
        }

        return function cleaup() {
            abortController.abort();
        };
    }, [id.addressId]);

    const handleClick = (event) => {
        event.preventDefault();
        let option = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: customer.token,
                first_name: input.first_name || address.first_name,
                last_name: input.last_name || address.last_name,
                id: id.addressId,
                address1: [input.address1 || address.address1[0]],
                city: input.city || address.city,
                country: "AM",
                country_name: input.country || address.country,
                phone: input.phone || address.phone,
                postcode: input.postcode || address.postcode,
                state: input.state || address.state,
            }),
        };
        fetch(`${url}/api/addresses/${id.addressId}`, option)
            .then((response) => response.json())
            .then((res) => {
                setSuccess(true);
                setSuucessData(res.message);
            });
    };

    if (!address) return true;

    const ErrorsOutput = () => {
        const arr = [];
        for (let error in errors) {
            arr.push(<div>{errors[error]}</div>);
        }
        return arr;
    };
    return (
        <div className="card">
            <Helmet>
                <title>{`Edit Address — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>
                    <FormattedMessage id="editAddress" defaultMessage="Edit Address" />
                </h5>
            </div>

            {errors ? <div class="alert alert-danger">{ErrorsOutput()}</div> : ""}

            {success ? <div class="alert alert-success">{successData}</div> : ""}
            <div className="card-divider" />
            <div className="card-body">
                <div className="row no-gutters">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-first-name">
                                    <FormattedMessage id="name" defaultMessage="Name" />
                                </label>
                                <input
                                    onChange={handleChange}
                                    name="first_name"
                                    value={input.first_name}
                                    defaultValue={address.first_name}
                                    type="text"
                                    className="form-control"
                                    id="checkout-first-name"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-last-name">
                                    <FormattedMessage id="lname" defaultMessage="Surname" />
                                </label>
                                <input
                                    value={input.last_name}
                                    defaultValue={address.last_name}
                                    onChange={handleChange}
                                    name="last_name"
                                    type="text"
                                    className="form-control"
                                    id="checkout-last-name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-company-name">
                                <FormattedMessage id="company" defaultMessage="Company name" />{" "}
                                <span className="text-muted">
                                    ({<FormattedMessage id="optional" defaultMessage="Optional" />})
                                </span>
                            </label>
                            <input
                                onChange={handleChange}
                                value={input.company_name}
                                defaultValue={address.company_name}
                                name="company_name"
                                type="text"
                                className="form-control"
                                id="checkout-company-name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkout-street-address">
                                <FormattedMessage id="streetAddress" defaultMessage="Address" />
                            </label>
                            <input
                                onChange={handleChange}
                                value={input.address1}
                                defaultValue={address.address1[0]}
                                name="address1"
                                type="text"
                                className="form-control"
                                id="checkout-street-address"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="checkout-city">
                                {" "}
                                <FormattedMessage id="сity" defaultMessage="City" />
                            </label>
                            <input
                                onChange={handleChange}
                                name="city"
                                value={input.city}
                                defaultValue={address.city}
                                type="text"
                                className="form-control"
                                id="checkout-city"
                            />
                        </div>
                        {/* <div className="form-group">
                            <label htmlFor="checkout-state">State</label>
                            <input
                                onChange={handleChange}
                                value={input.state}
                                defaultValue={address.state}
                                name='state'
                                type="text"
                                className="form-control"
                                id="checkout-state"
                            />
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="checkout-postcode">
                                <FormattedMessage id="postcode" defaultMessage="Postal code" />
                            </label>
                            <input
                                onChange={handleChange}
                                value={input.postcode}
                                defaultValue={address.postcode}
                                name="postcode"
                                type="text"
                                className="form-control"
                                id="checkout-postcode"
                            />
                        </div>

                        <div className="form-row">
                            {/* <div className="form-group col-md-6">
                                <label htmlFor="checkout-email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="checkout-email"
                                    placeholder="Email address"
                                />
                            </div> */}
                            <div className="form-group col-md-6">
                                <label htmlFor="checkout-phone">
                                    <FormattedMessage id="phone" defaultMessage="Tel։" />
                                </label>
                                <input
                                    onChange={handleChange}
                                    value={input.phone}
                                    defaultValue={address.phone}
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                    id="checkout-phone"
                                />
                            </div>
                        </div>

                        <div className="form-group mt-3 mb-0">
                            <button onClick={handleClick} className="btn btn-primary" type="button">
                                <FormattedMessage id="save" defaultMessage="Save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
