// react
import React, { useRef, useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { url } from "../../helper";
import { cartAddItemAfterLogin } from "../../store/cart";
import { cartRemoveItemAfterLogin } from "../../store/cart";
export default function AccountLogin() {
    const [placeholders, Setplaceholders] = useState({
        mail: "block",
        password: "block",
    });

    let mailRef = useRef();
    let passwordRef = useRef();

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

    const history = useHistory();
    const dispatch = useDispatch();
    const cartToken = useSelector((state) => state.cartToken);
    const cart = useSelector((state) => state.cart);
    const selectedData = useSelector((state) => state.locale);
    const customer = useSelector((state) => state.customer);

    const [email, SetEmail] = useState();
    const [pass, SetPass] = useState();

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
                        history.push("/account/dashboard/");

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

    return (
        <form className="p-5">
            <h3 className="card-title">
                <FormattedMessage id="log.in" defaultMessage="Sign In" />
            </h3>
            <div className="form-group position-relative">
                <FormattedMessage id="global.email" defaultMessage="E-mail">
                    {(placeholder) => (
                        <input
                            id="header-signin-email"
                            type="email"
                            className="form-control login-input"
                            onChange={handlerChange}
                            // placeholder={placeholder}
                            ref={mailRef}
                            onInput={toggleMailPlaceholder}
                        />
                    )}
                </FormattedMessage>
                <span className="password-placeholder" style={{ display: `${placeholders.mail}` }}>
                    Email<span style={{ color: "red" }}>*</span>
                </span>
            </div>
            <div className="form-group position-relative">
                <div className="account-menu__form-forgot">
                    <FormattedMessage id="topbar.password" defaultMessage="Password">
                        {(placeholder) => (
                            <input
                                id="header-signin-password"
                                type="password"
                                className="form-control login-input"
                                onChange={handlerPass}
                                // placeholder={placeholder}
                                ref={passwordRef}
                                onInput={togglePasswordPlaceholder}
                            />
                        )}
                    </FormattedMessage>
                    <span className="password-placeholder" style={{ display: `${placeholders.password}` }}>
                        Password<span style={{ color: "red" }}>*</span>
                    </span>
                    <Link to="/forgot/password" className="account-menu__form-forgot-link mt-4">
                        <FormattedMessage id="login.forgot.password" defaultMessage="Forgot password?" />
                    </Link>
                </div>
            </div>
            <div className="form-group account-menu__form-button">
                <button
                    onClick={fetchToLogin}
                    type="submit"
                    className="btn btn-lg btn-orange login-button rounded-pill float-left"
                >
                    <FormattedMessage id="log-in-btn" defaultMessage="Log in" />
                </button>
            </div>
        </form>
    );
}
