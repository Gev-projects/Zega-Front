// react
import React, { useState } from "react";

// third-party
import { Link, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// application
import Indicator from "./Indicator";
import { Person20Svg } from "../../svg";

import { useDispatch, useSelector } from "react-redux";

import { url } from "../../helper";
import { cartAddItemAfterLogin } from "../../store/cart";
import { cartRemoveItemAfterLogin } from "../../store/cart";

export default function IndicatorAccount() {
    const history = useHistory();
    const dispatch = useDispatch();

    const authenticated = useSelector((state) => state.customer.authenticated);
    const customer = useSelector((state) => state.customer);
    const cartToken = useSelector((state) => state.cartToken);
    const cart = useSelector((state) => state.cart);
    const selectedData = useSelector((state) => state.locale);

    const [email, SetEmail] = useState();
    const [pass, SetPass] = useState();
    const [open, setOpen] = useState(false);

    const handlerChange = (event) => {
        SetEmail(event.target.value);
    };

    const handlerPass = (e) => {
        SetPass(e.target.value);
    };

    const fetchToLogin = (event) => {
        event.preventDefault();

        let option = {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: pass,
            }),
        };
        if (checkEmail(email) && pass !== undefined) {
            fetch(url + "/api/customer/login?token=true", option)
                .then((responce) => responce.json())
                .then((res) => {
                    if (res.token && res.token !== "") {
                        dispatch({ type: "AUTHENTICATED", payload: true });
                        dispatch({ type: "CUSTOMER_TOKEN", payload: res.token });
                        dispatch({ type: "CUSTOMER_ID", payload: res.data.id });
                        history.push("/account/profile/");

                        fetch(`${url}/api/checkout/cart?token=${res.token}&api_token=${cartToken.cartToken}`)
                            .then((responce) => responce.json())
                            .then((resUser) => {
                                if (resUser) {
                                    submitCartData(resUser, res.token);
                                }
                            })
                            .catch((err) => console.error(err));
                    } else {
                        alert(res.error);
                    }
                });
        } else {
            alert("Type valid data");
        }
    };

    const submitCartData = (products, token) => {
        if (cart.items.length > 0 && products.data !== null) {
            cart.items.map((product) => {
                let pro = products.data.items.find((item) => item.product.id == product.product.id);
                if (pro == undefined) {
                    fetch(
                        `${url}/api/checkout/cart/add/${product.product.id}?product_id=${product.product.id}&quantity=${
                            product.quantity
                        }&api_token=${cartToken.cartToken}${token ? `&token=${token}` : ""}`,
                        { method: "POST" }
                    )
                        .then((responce) => responce.json())
                        // .then((res) => console.log(res))
                        .catch((err) => console.error(err));
                } else {
                    cartRemoveItemAfterLogin(product.id, pro.product.id, dispatch);
                }
            });
        } else if (cart.items.length > 0 && products.data === null) {
            cart.items.map((product) => {
                fetch(
                    `${url}/api/checkout/cart/add/${product.product.id}?product_id=${product.product.id}&quantity=${
                        product.quantity
                    }&api_token=${cartToken.cartToken}${token ? `&token=${token}` : ""}`,
                    { method: "POST" }
                )
                    .then((responce) => responce.json())
                    .then((res) => {})
                    .catch((err) => console.error(err));
            });
        }

        if (products.data !== null && products.data.items.length > 0) {
            products.data.items.map((product) => {
                cartAddItemAfterLogin(
                    product.product,
                    [],
                    product.quantity,
                    cartToken,
                    customer,
                    selectedData,
                    dispatch,
                    products
                );
            });
        }
    };

    const checkEmail = () => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return "true";
        }
        return "false";
    };

    const dropdown = (
        <div className="account-menu">
            <form className="account-menu__form">
                <div className="account-menu__form-title">
                    <FormattedMessage id="login.log.in" defaultMessage="Log in" />
                </div>
                <div className="form-group">
                    <label htmlFor="header-signin-email" className="sr-only">
                        <FormattedMessage id="tlogin.email.address" defaultMessage="e-mail address" />
                    </label>

                    <FormattedMessage id="global.email" defaultMessage="E-mail">
                        {(placeholder) => (
                            <input
                                id="header-signin-email"
                                type="email"
                                className="form-control form-control-lg f16"
                                onChange={handlerChange}
                                placeholder={placeholder}
                            />
                        )}
                    </FormattedMessage>
                </div>
                <div className="form-group">
                    <label htmlFor="header-signin-password" className="sr-only">
                        Գաղտնաբառ*
                    </label>
                    <div className="account-menu__form-forgot">
                        <FormattedMessage id="account.password" defaultMessage="Password">
                            {(placeholder) => (
                                <input
                                    id="header-signin-password"
                                    type="password"
                                    className="form-control form-control-lg f16"
                                    onChange={handlerPass}
                                    placeholder={placeholder}
                                />
                            )}
                        </FormattedMessage>

                        <Link
                            to="/forgot/password"
                            className="account-menu__form-forgot-link"
                            onClick={() => setOpen(!open)}
                        >
                            <FormattedMessage id="login.forgot.password" defaultMessage="Forgot password?" />
                        </Link>
                    </div>
                </div>
                <div className="form-group account-menu__form-button">
                    <button
                        onClick={fetchToLogin}
                        type="submit"
                        className="btn btn-orange btn-md login-drop-btn rounded-pill"
                    >
                        <FormattedMessage id="login-btn" defaultMessage="Log in" />
                    </button>
                </div>
                <div className="account-menu__form-link">
                    <Link to="/account/login" onClick={() => setOpen(!open)}>
                        <FormattedMessage id="create.account" defaultMessage="Create account" />
                    </Link>
                </div>
            </form>
            <div className="account-menu__divider" />
        </div>
    );

    const func = (bool) => {
        setOpen(bool);
    };

    return (
        <Indicator
            url="/account/profile"
            func={func}
            openEd={open}
            account={"account"}
            dropdown={!authenticated ? dropdown : ""}
            icon={<Person20Svg />}
        />
    );
}
