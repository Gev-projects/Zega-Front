// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// data stubs
import theme from "../../data/theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { url } from "../../helper";
import BlockLoader from "../blocks/BlockLoader";

import { FormattedMessage } from "react-intl";

export default function AccountPageAddresses() {
    const customer = useSelector((state) => state.customer);
    const [address, setAddress] = useState();
    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});

    const handleChange = (e) => {
        input[e.target.name] = e.target.value;
        setInput(input);
    };
    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;

        if (customer.token) {
            fetch(url + `/api/addresses?pagination=0&token=` + customer.token, { single: single })
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
    }, [customer.token, message]);

    if (!address) {
        return <BlockLoader />;
    }

    const removeAddress = (event, id) => {
        event.preventDefault();

        if (customer.token) {
            let option = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: customer.token,
                }),
            };
            fetch(`${url}/api/addresses/${id}`, option)
                .then((responce) => responce.json())
                .then((res) => {
                    setMessage(res.message + id);
                })
                .catch((err) => console.error(err));
        }
    };

    const addresses = address.map((address) => (
        <React.Fragment key={address.id}>
            <div className="addresses-list__item card address-card">
                {address.default && (
                    <div className="address-card__badge">
                        <FormattedMessage id="default" defaultMessage="Text" />
                    </div>
                )}

                <div className="address-card__body">
                    <div className="address-card__name">{`${address.first_name} ${address.last_name}`}</div>
                    <div className="address-card__row">
                        {address.country_name}
                        <br />
                        {address.postcode},{address.city}
                        <br />
                        {address.address1[0]}
                    </div>
                    <div className="address-card__row">
                        <div className="address-card__row-title">
                            <FormattedMessage id="phone" defaultMessage="Tel. number:" />
                        </div>
                        <div className="address-card__row-content">{address.phone}</div>
                    </div>

                    <div className="address-card__footer">
                        <Link to={`/account/addresses/${address.id}`}>
                            <FormattedMessage id="edit" defaultMessage="Edit" />
                        </Link>
                        &nbsp;&nbsp;
                        <a href="/" onClick={(event) => removeAddress(event, address.id)}>
                            <FormattedMessage id="remove" defaultMessage="Remove" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="addresses-list__divider" />
        </React.Fragment>
    ));

    return (
        <div className="addresses-list">
            <Helmet>
                <title>{`Address List — ${theme.name}`}</title>
            </Helmet>

            <Link to="/account/addresses/new" className="addresses-list__item addresses-list__item--new">
                <div className="addresses-list__plus" />
                <div className="btn btn-orange rounded-pill f15 btn-primary-fms ">
                    <FormattedMessage id="addnew" defaultMessage="Add new" />
                </div>
            </Link>
            <div className="addresses-list__divider" />
            {addresses}
        </div>
    );
}
