// react
import React, { Component } from "react";

// third-party
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link, Redirect } from "react-router-dom";

// application
import Collapse from "../shared/Collapse";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import { Check9x7Svg } from "../../svg";

// data stubs
//import payments from "../../data/shopPayments";
import theme from "../../data/theme";

import { FormattedMessage, injectIntl } from "react-intl";

import { url } from "../../helper";
import ShippingAddress from "./ShippingAddress";
import ReactPixel from "react-facebook-pixel";
import { toast } from "react-toastify";
import { cartUpdateData } from "../../store/cart";
import ShippingMethod from "./ShippingMethod";
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = (errors) => {
    let arr = Object.values(errors);
    let isValid = true;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) {
            isValid = false;
        }
    }
    return isValid;
};

const phonenumber = RegExp(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/);

//const url='https://megalight-api.fidem.am';

class ShopPageCheckout extends Component {
    // payments = payments;

    constructor(props) {
        super(props);
        this.state = {
            customer: this.props.customer,
            cart: this.props.cart,
            loading: false,
            inputsValues: null,
            checkbox: false,
            token: this.props.token,
            locale: this.props.locale,
            payment: "cashondelivery",
            payments: null,
            inputsDataForParent: false,
            notes: "",
            fullName: "",
            lname: "",
            name: "",
            shippingMethod: "",
            shippingMethodRate: "",
            street: "",
            shipingStreet: "",
            shipingPhone: "",
            phone: "",
            email: "",
            country: "",
            states: "",
            city: "",
            apartment: "",
            postal: "",
            defaultAddress: true,
            newBillingAddress: false,

            billStreet: "",
            billPhone: "",
            billApartment: "",
            billCity: "",
            billPost: "",
            billCountry: "",
            billState: "",

            billCountryList: [],
            billCountryStates: [],
            isSelectedCustomAddress: false,
            pastOrders: [],
            addressOption: {},
            addCupone: "",
            errors: {
                fullName: "",
                name: "",
                lname: "",
                street: "",
                shipingStreet: "",
                shipingPhone: "",
                phone: "",
                email: "",
                country: "",
                city: "",
                apartment: "",
                postal: "",
            },
        };
    }

    componentDidMount() {
        ReactPixel.trackCustom("Checkout Page");
        fetch(`${url}/api/country-states?pagination=0`)
            .then((res) => res.json())
            .then((res) => this.setState({ billCountryStates: res }));

        fetch(`${url}/api/countries?pagination=0`)
            .then((res) => res.json())
            .then((res) => this.setState({ billCountryList: res.data }));

        fetch(`${url}/api/addresses?token=${this.state.customer.token}`)
            .then((res) => res.json())
            .then((res) => this.setState({ pastOrders: res.data }));

        fetch(url + `/api/payments?locale=${this.state.locale}`, { method: "GET" })
            .then((responce) => responce.json())
            .then((res) => {
                this.setState({ payments: res });
            })
            .catch((err) => console.error(err));
    }

    handlePaymentChange = (event) => {
        if (event.target.checked) {
            this.setState({ payment: event.target.value });
        }
    };

    setShipingMethod = (val) => {
        this.setState({ shippingMethod: val.value });
        this.setState({ shippingMethodRate: val.getAttribute("data-default_rate") });
    };

    getCartCustomer = () => {
        if (this.state.customer && this.state.customer.token) {
            fetch(`${url}/api/checkout/cart?token=` + this.state.customer.token, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((res) => {
                    if (!res.data.coupon_code) {
                        this.setState({ addCupone: "" });
                    }
                    this.props.cartUpdateData({
                        total: res.data.base_grand_total,
                        coupon_code: res.data.coupon_code,
                        coupon_discount: res.data.base_discount,
                    });
                });
        }
    };
    addCuponeCode = (methods) => {
        //  this.getCartCustomer();
        const requestOptions = {
            method: methods,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.addCupone,
                token: this.state.customer.token,
            }),
        };
        if (this.state.addCupone || methods == "DELETE") {
            fetch(`${url}/api/checkout/cart/coupon`, requestOptions)
                .then((response) => response.json())
                .then((res) => {
                    if (res.message) {
                        if (res.success) {
                            toast.success(`${res.message}`);
                            this.props.cartUpdateData({
                                coupon_name: res.CouponName,
                            });

                            this.getCartCustomer();
                        } else {
                            toast.error(`${res.message}`);
                        }
                    }
                })
                .catch((error) => console.log(error));
        }
    };
    renderTotals() {
        const { cart } = this.props;

        if (cart.extraLines.length <= 0) {
            return null;
        }
        const extraLines = cart.extraLines.map((extraLine, index) => (
            <tr key={index}>
                <th>{extraLine.title}</th>
                <td>
                    <Currency value={extraLine.price} />
                </td>
            </tr>
        ));

        return (
            <React.Fragment>
                <tbody className="checkout__totals-subtotals">
                    <tr>
                        <th>Subtotal</th>
                        <td>
                            <Currency value={cart.subtotal} />
                        </td>
                    </tr>
                    {extraLines}
                </tbody>
            </React.Fragment>
        );
    }
    renderCupone() {
        return (
            <div className="coupon-code">
                <div className="coupon-code__list">
                    <input
                        type="text"
                        name="couponcode"
                        value={this.props.cart.coupon_code ? this.props.cart.coupon_code : this.state.addCupone}
                        className="form-control checkout-input"
                        id="coupon-code"
                        placeholder="Coupon Code"
                        onChange={(e) => {
                            this.setState({ addCupone: e.target.value });
                        }}
                    />
                    <button
                        type="submit"
                        onClick={
                            this.props.cart.coupon_code
                                ? () => {
                                      this.addCuponeCode("DELETE");
                                  }
                                : () => {
                                      this.addCuponeCode("POST");
                                  }
                        }
                        className="coupon-code-button-apply"
                    >
                        {/* <FormattedMessage id="Apply" defaultMessage="Apply" /> */}
                        {this.props.cart.coupon_code ? (
                            <FormattedMessage id="Remove" defaultMessage="Remove" />
                        ) : (
                            <FormattedMessage id="Apply" defaultMessage="Apply" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
    renderCuponeName() {
        let couponname = this.props.cart.coupon_code ? <th>{this.props.cart.coupon_name}</th> : "";
        let coupondiscount = this.props.cart.coupon_code ? <th>-{this.props.cart.coupon_discount}</th> : "";
        return (
            <tr>
                {couponname}
                {coupondiscount}
            </tr>
        );
    }

    renderCart() {
        const { cart } = this.props;
        const items = cart.items.map((item) => (
            <tr key={item.id}>
                <td>{`${item.product.name} × ${item.quantity}`}</td>
                <td>
                    <Currency value={item.total} />
                </td>
            </tr>
        ));

        return (
            <table className="checkout__totals">
                {/*<thead className="checkout__totals-header">*/}
                {/*    <tr>*/}
                {/*        <th>*/}
                {/*            <FormattedMessage id="product" defaultMessage="Ապրանք" />*/}
                {/*        </th>*/}
                {/*        <th>*/}
                {/*            <FormattedMessage id="total" defaultMessage="Ընդհանուր" />*/}
                {/*        </th>*/}
                {/*    </tr>*/}
                {/*</thead>*/}
                <tbody className="checkout__totals-products">
                    {items}
                    <tr>
                        <td>
                            <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                        </td>
                        <td>
                            <Currency value={cart.subtotal} />
                        </td>
                    </tr>
                </tbody>
                {/*{this.renderTotals()} */}
                <tfoot className="checkout__totals-footer">
                    {/* <tr>
                            <th>
                                <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                            </th>
                            <th>
                                <Currency value={cart.subtotal} />
                            </th>
                        </tr> */}
                    <tr>
                        <th>
                            <FormattedMessage id="tax" defaultMessage="Tax" />
                        </th>
                        <th> {cart.tax} </th>
                    </tr>
                    <tr>
                        <th>
                            {this.state.shippingMethodRate ? (
                                <FormattedMessage id="shipping" defaultMessage="shipping" />
                            ) : (
                                ""
                            )}
                        </th>
                        <th>
                            {this.state.shippingMethodRate ? <Currency value={this.state.shippingMethodRate} /> : ""}
                        </th>
                        {/* {cart.extraLines[0].price} */}
                    </tr>
                    <tr>
                        <td colspan="2">{this.renderCupone()}</td>
                    </tr>
                    {this.renderCuponeName()}
                    <tr>
                        <th>
                            <FormattedMessage id="total" defaultMessage="Total" />
                        </th>
                        <th>
                            <Currency value={cart.total} />
                        </th>
                    </tr>
                </tfoot>
            </table>
        );
    }

    renderPaymentsList() {
        const { payment: currentPayment } = this.state;
        if (this.state.payments) {
            const payments = this.state.payments.map((payment) => {
                const renderPayment = ({ setItemRef, setContentRef }) => (
                    <li className="payment-methods__item" ref={setItemRef}>
                        <label className="payment-methods__item-header">
                            <span className="payment-methods__item-radio input-radio">
                                <span className="input-radio__body">
                                    <input
                                        type="radio"
                                        className="input-radio__input"
                                        name="checkout_payment_method"
                                        value={payment.method}
                                        checked={currentPayment === payment.method}
                                        onChange={this.handlePaymentChange}
                                    />

                                    <span className="input-radio__circle" />
                                </span>
                            </span>
                            <span className="payment-methods__item-title">
                                {payment.title}
                                <br />
                                {currentPayment == "moneytransfer" && payment.method == "moneytransfer"
                                    ? payment.description
                                    : ""}
                            </span>
                        </label>
                        <div className="payment-methods__item-container" ref={setContentRef}>
                            <img
                                style={{
                                    margin: "auto",
                                    display: "block",
                                    width: "200px",
                                }}
                                src={payment.img}
                                alt=""
                            />
                        </div>
                    </li>
                );

                return (
                    <Collapse
                        key={payment.method}
                        open={currentPayment === payment.method}
                        toggleClass="payment-methods__item--active"
                        render={renderPayment}
                    />
                );
            });

            return (
                <div className="payment-methods">
                    <div className="payment-method-title">
                        <FormattedMessage id="payment-method" defaultMessage="Payment method" />
                    </div>
                    <ul className="payment-methods__list">{payments}</ul>
                </div>
            );
        }
    }

    // openAddress() {
    //     this.setState({ ShippingAddress: !this.state.ShippingAddress });
    // }

    openBillingAddress() {
        this.setState({ newBillingAddress: true });
    }

    closeBillingAddress() {
        this.setState({ newBillingAddress: false });
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;

        let errors = this.state.errors;
        this.setState({ [name]: value });
    };

    onclick = (event) => {
        this.setState({ checkbox: !this.state.checkbox });
    };

    chacking = (resolve) => {
        const { fullName, lname, email, street, phone, country, city, apartment, postal } = this.state;
        let object = {};

        if (email === "" || validEmailRegex.test(this.state.email) == false) {
            object.email = "Email is not valid!";
        }
        if (fullName === "") {
            object.fullName = "Full Name must be 3 characters long!";
        }
        if (lname === "") {
            object.lname = "Last Name must be 3 characters long!";
        }
        if (email === "" || validEmailRegex.test(this.state.email) == false) {
            object.email = "Email is not valid!";
        }

        if (street === "") {
            object.street = "Street is not valid!";
        }

        if (apartment === "") {
            object.apartment = "Apartment is not valid!";
        }

        if (postal === "") {
            object.postal = "Postal code is not valid!";
        }

        if (country === "") {
            object.country = "Country is not valid!";
        }

        if (city === "") {
            object.city = "City is not valid!";
        }

        if (phone === "" || phonenumber.test(this.state.phone) == false) {
            object.phone = "Phone is not valid!";
        }

        if (Object.keys(object).length > 0) {
            this.setState(
                {
                    errors: {
                        ...this.state.errors,
                        ...object,
                    },
                },
                () => {
                    resolve();
                }
            );
        }
        if (Object.keys(this.state.addressOption).length > 0) {
            this.setState({
                street: this.state.addressOption.address1[0],
                fullName: this.state.addressOption.first_name,
                lname: this.state.addressOption.last_name,
                city: this.state.addressOption.city,
                country: this.state.addressOption.country,
                states: this.state.state || "no state",
                postal: this.state.addressOption.postcode,
                phone: this.state.addressOption.phone,
                email: this.state.email,
                apartment: this.state.addressOption.apartment,
                errors: {
                    street: "",
                    fullName: "",
                    lname: "",
                    city: "",
                    country: "",
                    states: "",
                    postal: "",
                    phone: "",
                    apartment: "",
                    email: this.state.email ? "" : "Invalid Email",
                },
            });
        }
        resolve();
        // errors.lname =
        //     this.state.lname === ''
        //         ? 'Full Name must be 3 characters long!' : ''
        //
        // errors.email =
        //     validEmailRegex.test(this.state.email)
        //         ? ''
        //         : 'Email is not valid!';
        //
        // errors.street =
        //     this.state.street === ''
        //         ? 'Full Name must be 5 characters long!'
        //         : '';
        //
        // errors.phone =
        //     phonenumber.test(this.state.phone)
        //         ? ""
        //         : 'Phone is not valid!'

        // if (this.state.ShippingAddress) {
        //
        //     errors.name =
        //         this.state.name < 5
        //             ? 'Full Name must be 3 characters long!' : ''
        //     errors.shipingStreet =
        //         this.state.shipingStreet.length < 5
        //             ? 'Street must be 5 characters long!'
        //             : '';
        //
        //     errors.shipingPhone =
        //         this.state.shipingStreet.length < 5
        //             ? 'Street must be 5 characters long!'
        //             : '';
        //     this.setState({ errors });
        //
        // }
        //
        // this.setState({ errors });
    };

    destroyCart() {
        let local = localStorage.getItem("state");
        let obj = JSON.parse(local);
        delete obj.cart;

        localStorage.setItem("state", JSON.stringify(obj));
    }

    requestOrder() {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        let shippingDetalies, options, options_payment, save_shipping;
        if (this.state.ShippingAddress) {
            shippingDetalies = {
                address1: this.state.shipingStreet,
                name: this.state.name,
                phone: this.state.shipingPhone,
            };
        }

        // const billing = {
        //     use_for_shipping: true,
        //     address1: street,
        //     email: this.state.email,
        //     first_name: this.state.fullName,
        //     last_name: this.state.lname,
        //     city: this.state.city,
        //     country: "AM",
        //     state: "Yerevan",
        //     postcode: "75017",
        //     phone: this.state.phone,
        //     company_name: 'FIdem',
        // }
        //
        // if (this.state.ShippingAddress) {
        //     let street1 = this.state.shipingStreet
        //     if (typeof street1 == 'string')
        //         street1 = [street1]
        //     shipping = {
        //         email: this.state.shipingEmail,
        //         last_name: this.state.shipingLname,
        //         city: this.state.shipingCity,
        //         first_name: this.state.name,
        //         country: "AM",
        //         state: "Yerevan",
        //         postcode: "75017",
        //         // company_name: '',
        //         address1: street1,
        //         phone: this.state.shipingPhone
        //     }

        let billing;
        {
            Object.keys(this.state.addressOption).length > 0
                ? (billing = {
                      use_for_shipping: true,
                      save_as_address: true,
                      address1: [this.state.addressOption.address1[0]],
                      email: this.state.email,
                      first_name: this.state.addressOption.first_name,
                      last_name: this.state.addressOption.last_name,
                      city: this.state.addressOption.city,
                      country: this.state.addressOption.country,
                      state: this.state.state || "np state",
                      postcode: this.state.addressOption.postcode,
                      phone: this.state.addressOption.phone,
                      apartment: this.state.addressOption.apartment,
                      company_name: "",
                  })
                : (billing = {
                      use_for_shipping: true,
                      save_as_address: true,
                      address1: [this.state.street],
                      email: this.state.email,
                      first_name: this.state.fullName,
                      last_name: this.state.lname,
                      city: this.state.city,
                      country: this.state.country,
                      state: this.state.state || "np state",
                      postcode: this.state.postal,
                      phone: this.state.phone,
                      apartment: this.state.apartment,
                      company_name: "",
                  });
        }

        const shipping = {
            address1: [this.state.shipingStreet],
            name: this.state.name,
            phone: this.state.shipingPhone,
        };

        if (this.state.customer.token) {
            options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    billing: billing,
                    shipping: shipping,
                    api_token: this.state.token.cartToken,
                    token: this.state.customer.token,
                }),
            };
            options_payment = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    payment: { method: this.state.payment },
                    api_token: this.state.token.cartToken,
                    token: this.state.customer.token,
                }),
            };

            save_shipping = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    shipping_method: this.state.shippingMethod,
                    api_token: this.state.token.cartToken,
                    token: this.state.customer.token,
                }),
            };
        } else {
            options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    billing: billing,
                    shipping: shipping,
                    api_token: this.state.token.cartToken,
                }),
            };
            options_payment = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    payment: { method: this.state.payment },
                    api_token: this.state.token.cartToken,
                }),
            };

            save_shipping = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    shipping_method: this.state.shippingMethod,
                    api_token: this.state.token.cartToken,
                }),
            };
        }

        fetch(url + "/api/checkout/save-address", options)
            .then((response) => {
                if (response.ok) {
                    fetch(url + "/api/checkout/save-shipping", save_shipping)
                        .then((res) => {
                            if (res.ok) {
                                fetch(url + "/api/checkout/save-payment", options_payment)
                                    .then((rsponce) => {
                                        if (rsponce.ok) {
                                            let body;
                                            if (this.state.customer.token) {
                                                body = {
                                                    api_token: this.state.token.cartToken,
                                                    token: this.state.customer.token,
                                                    description: this.state.notes,
                                                    // shipping_method: this.state.shippingMethod,
                                                };
                                            } else {
                                                body = {
                                                    api_token: this.state.token.cartToken,
                                                    description: this.state.notes,
                                                    // shipping_method: this.state.shippingMethod,
                                                };
                                            }

                                            fetch(url + "/api/checkout/save-order", {
                                                method: "POST",
                                                headers: headers,
                                                body: JSON.stringify(body),
                                            })
                                                .then((res) => res.json())
                                                .then((res) => {
                                                    if (res.success) {
                                                        if (res.redirect_url) {
                                                            this.destroyCart();
                                                            window.location = res.redirect_url;
                                                        } else {
                                                            this.destroyCart();
                                                            window.location = "/thanks?orderID=" + res.order.id;
                                                        }
                                                    }
                                                })
                                                .catch((err) => console.log(err, "err"));
                                        }
                                    })
                                    .then((res) => {
                                        console.log(res, "lplplpl");
                                    });
                            }
                        })
                        .catch((err) => console.log(err, "err"));
                }
            })

            .catch((err) => console.log(err, "err"));

        //   return <Redirect to="/thanks" />;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        new Promise((resolve) => {
            this.setState({ loading: true });
            this.chacking(resolve);
        }).then(() => {
            if (validateForm(this.state.errors)) {
                this.requestOrder();
            } else {
                this.setState({ loading: false });
            }
        });
    };

    getInputsDataForParent = (name, value) => {
        this.setState({
            [name]: value,
        });
        this.setState({
            errors: {
                ...this.state.errors,
                [name]: "",
            },
        });
    };

    chosenAddress = (obj) => {
        this.setState({
            addressOption: { ...obj },
        });
    };

    render() {
        let selectCountry;
        let selectState;
        let countryCode;

        if (this.state.billCountryList) {
            selectCountry = (
                <div className="form-group col-12 col-md-6 px-0">
                    <select
                        name="billCountry"
                        className="checkout-input checkout-select-billing"
                        onChange={this.handleChange}
                    >
                        <option selected="true" disabled="disabled">
                            Select Country
                        </option>
                        {this.state.billCountryList.map((option) => (
                            <option value={option.name}>{option.name}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (this.state.billCountryList && this.state.billCountry) {
            for (let i = 0; i <= this.state.billCountryList.length; i++) {
                if (this.state.billCountryList[i] && this.state.billCountryList[i].name == this.state.billCountry) {
                    countryCode = this.state.billCountryList[i].code;
                }
            }
        }

        if (countryCode && this.state.billCountryStates.data && this.state.billCountryStates.data[countryCode]) {
            selectState = (
                <div className="form-group col-12 col-md-12 px-0">
                    <select
                        name="states"
                        className="checkout-input checkout-select-billing"
                        onChange={this.handleChange}
                    >
                        <option selected="true" disabled="disabled">
                            Select State
                        </option>
                        {this.state.billCountryStates.data[countryCode].map((option) => (
                            <option value={option.default_name}>{option.default_name}</option>
                        ))}
                    </select>
                </div>
            );
        } else {
            selectState = "";
        }

        ///////////////////////////////////////////////////////////////////////////
        const { cart } = this.props;
        const { errors } = this.state;
        const { locale } = this.props;

        if (cart.items.length < 1) {
            return <Redirect to="cart" />;
        }

        const breadcrumb = [
            { title: "Home", url: "" },
            { title: "Shopping Cart", url: "/shop/cart" },
            { title: "Checkout", url: "" },
        ];

        return (
            <React.Fragment>
                <Helmet></Helmet>

                <PageHeader />

                <div className="checkout block">
                    <div className="container">
                        <h3 className="checkout-page-title">
                            <FormattedMessage id="checkout" defaultMessage="Checkout" />
                        </h3>

                        <div className="row ">
                            <div className="col-12 col-lg-6 col-xl-7">
                                <div className="card mb-lg-0">
                                    {/*<form>*/}
                                    {/*    <div className="card-body p-2">*/}
                                    {/*        <div className="col-12">*/}
                                    {/*<div className="row">*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="checkout.nam" defaultMessage="Անուն">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.fullName}*/}
                                    {/*                type="text"*/}
                                    {/*                name='fullName'*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-first-name"*/}
                                    {/*                placeholder="Name"*/}
                                    {/*            />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.fullName.length > 0 &&*/}
                                    {/*        <span className='alert-danger'> <FormattedMessage id="name.error" defaultMessage="Անուն դաշտը պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="checkout.lnam" defaultMessage="Ազգանուն">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.lname}*/}
                                    {/*                type="text"*/}
                                    {/*                name='lname'*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-first-name"*/}
                                    {/*                placeholder="Surname"*/}
                                    {/*            />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.fullName.length > 0 &&*/}
                                    {/*        <span className='alert-danger'> <FormattedMessage id="errors.lname" defaultMessage="Ազգանուն դաշտը պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="checkout-country" defaultMessage="Երկիր">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.country}*/}
                                    {/*                type="text"*/}
                                    {/*                name='country'*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-country"*/}
                                    {/*                placeholder="Country"*/}
                                    {/*            />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.country.length > 0 &&*/}
                                    {/*        <span className='alert-danger'> <FormattedMessage id="errors.country" defaultMessage="Երկիր դաշտը պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="checkout-city" defaultMessage="Քաղաք">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.city}*/}
                                    {/*                type="text"*/}
                                    {/*                name='city'*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-city"*/}
                                    {/*                placeholder="City"*/}
                                    {/*            />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.city.length > 0 &&*/}
                                    {/*        <span className='alert-danger'> <FormattedMessage id="errors.city" defaultMessage="Քաղաք դաշտը պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}

                                    {/*    <div className="form-group col-12 my-4">*/}

                                    {/*        <FormattedMessage id="checkout.address" defaultMessage="Հասցե">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.street}*/}
                                    {/*                name="street"*/}
                                    {/*                type="text"*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-street"*/}
                                    {/*                placeholder={placeholder} />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}

                                    {/*{errors.street.length > 0 &&*/}
                                    {/*<span className='alert-danger'><FormattedMessage id="address.error" defaultMessage="Հասցե դաշտը պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="topbar.email" defaultMessage="էլ․ Հասցե">*/}
                                    {/*    */}
                                    {/*            {(placeholder) => <input*/}
                                    {/*                value={this.state.email}*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                type="email"*/}
                                    {/*                name="email"*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-email"*/}
                                    {/*                placeholder={placeholder}*/}
                                    {/*            />*/}
                                    {/*    */}
                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.email.length > 0 &&*/}
                                    {/*        <span className='alert-danger'> <FormattedMessage id="email.error" defaultMessage="էլ․ Հասցե պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*    <div className="form-group col-12 col-md-6 my-2 my-md-4">*/}

                                    {/*        <FormattedMessage id="checkout.phone" defaultMessage="Հեռախոս">*/}

                                    {/*            {(placeholder) => <input*/}
                                    {/*                onChange={this.handleChange}*/}
                                    {/*                value={this.state.phone}*/}

                                    {/*                name="phone"*/}
                                    {/*                type="text"*/}
                                    {/*                className="form-control checkout-input"*/}
                                    {/*                id="checkout-phone"*/}
                                    {/*                placeholder={placeholder} />*/}

                                    {/*            }*/}
                                    {/*        </FormattedMessage>*/}
                                    {/*        {errors.phone.length > 0 &&*/}
                                    {/*        <span className='alert-danger'><FormattedMessage id="phone.error" defaultMessage="Հեռ։  պարտադիր է" /></span>}*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</form>*/}

                                    <div className="form-group col-12 col-md-12 my-md-5 px-4">
                                        <div className="checkout-card-title checkout-log-in-fms">
                                            <FormattedMessage
                                                id="checkout-contact-info"
                                                defaultMessage="Contact information"
                                            />
                                            <div className="already-have-account-fms">
                                                <span className="alreadyHaveAnAccount">
                                                    <FormattedMessage
                                                        id="reg.alreadyHaveAnAccount"
                                                        defaultMessage="Already have an account?"
                                                    />
                                                </span>
                                                <Link className="link-underline" to="/account/login">
                                                    <FormattedMessage id="log.in" defaultMessage="Log In" />
                                                </Link>
                                            </div>
                                        </div>
                                        <span>
                                            {/* <span style={{ color: "red" }}>*</span> */}
                                            <FormattedMessage id="global.email" defaultMessage="E-mail">
                                                {(placeholder) => (
                                                    <input
                                                        value={this.state.email}
                                                        onChange={(e) =>
                                                            this.getInputsDataForParent("email", e.target.value)
                                                        }
                                                        type="email"
                                                        name="email"
                                                        className="form-control checkout-input"
                                                        id="checkout-email"
                                                        placeholder={placeholder}
                                                    />
                                                )}
                                            </FormattedMessage>
                                        </span>
                                        {errors.email.length > 0 && (
                                            <span className="alert-danger">
                                                <FormattedMessage
                                                    id="account.error.email"
                                                    defaultMessage="E-mail is required"
                                                />
                                            </span>
                                        )}
                                    </div>

                                    {/*<div className="card-divider" />*/}

                                    <ShippingAddress
                                        passOption={this.chosenAddress}
                                        callback={this.getInputsDataForParent}
                                        state={this.state}
                                    />

                                    {/*<div className="card-divider" />*/}

                                    <div className="card-body p-4">
                                        <h3 className="checkout-card-title-fms">
                                            <FormattedMessage id="checkout.billing" defaultMessage="Billing address" />
                                        </h3>

                                        {/*<div className="form-group">*/}
                                        {/*    <div className="form-check" >*/}
                                        {/*        <span onClick={this.openAddress.bind(this)} className="form-check-input input-check">*/}
                                        {/*            <span className="input-check__body">*/}

                                        {/*                <input*/}

                                        {/*                    className="input-check__input"*/}
                                        {/*                    type="checkbox"*/}
                                        {/*                    id="checkout-different-address" />*/}

                                        {/*                <span className="input-check__box" />*/}
                                        {/*                <Check9x7Svg className="input-check__icon" />*/}
                                        {/*            </span>*/}
                                        {/*        </span>*/}
                                        {/*        <label className="color-lightgray ml-2" >*/}
                                        {/*            My billing address is different from shipping address*/}
                                        {/*            <FormattedMessage id="chekout.shippingDifferent" defaultMessage="Իմ վճարման հասցեն տարբերվում է պատվերի հասցեից:" />*/}
                                        {/*        </label>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        <span className="input-radio__body">
                                            <input
                                                type="radio"
                                                className="input-radio__input"
                                                name="checkout_billing_method"
                                                // value="default address"
                                                checked={!this.state.newBillingAddress}
                                                onChange={this.closeBillingAddress.bind(this)}
                                            />

                                            <span className="input-radio__circle mr-3" />
                                            <span className="payment-methods__item-title payment-methods__item-title-fms">
                                                <FormattedMessage
                                                    id="checkout-samebilling"
                                                    defaultMessage="Same as shipping address"
                                                />
                                            </span>
                                        </span>

                                        <span className="input-radio__body my-2">
                                            <input
                                                type="radio"
                                                className="input-radio__input"
                                                name="checkout_billing_method"
                                                // value="default address"
                                                // checked={this.state.newBillingAddress}
                                                onChange={this.openBillingAddress.bind(this)}
                                            />

                                            <span className="input-radio__circle mr-3" />
                                            <span className="payment-methods__item-title payment-methods__item-title-fms">
                                                <FormattedMessage
                                                    id="checkout-billingdifferent "
                                                    defaultMessage="Use a different billing address"
                                                />
                                            </span>
                                        </span>

                                        {this.state.newBillingAddress ? (
                                            <>
                                                {/*<div className="form-group ">*/}

                                                {/*    <FormattedMessage id="checkout.name" defaultMessage="Անուն">*/}

                                                {/*        {(placeholder) => <input*/}
                                                {/*            onChange={this.handleChange}*/}
                                                {/*            type="text"*/}
                                                {/*            name="name"*/}
                                                {/*            value={this.state.name}*/}
                                                {/*            className="form-control checkout-input"*/}
                                                {/*            id="checkout-first-name"*/}
                                                {/*            placeholder={placeholder}*/}
                                                {/*        />*/}

                                                {/*        }*/}
                                                {/*    </FormattedMessage>*/}

                                                {/*    {errors.name.length > 0 &&*/}
                                                {/*        <span className='alert-danger'> <FormattedMessage id="name.error" defaultMessage="Անուն դաշտը պարտադիր է" /></span>}*/}
                                                {/*</div>*/}

                                                <div className="form-group col-12 col-md-6 px-0">
                                                    <FormattedMessage
                                                        id="checkout.address"
                                                        defaultMessage="Apartment, suite"
                                                    >
                                                        {(placeholder) => (
                                                            <input
                                                                onChange={this.handleChange}
                                                                type="text"
                                                                name="shipingStreet"
                                                                value={this.state.shipingStreet}
                                                                className="form-control checkout-input"
                                                                id="checkout-street-address"
                                                                placeholder={placeholder}
                                                            />
                                                        )}
                                                    </FormattedMessage>

                                                    {/*{errors.shipingStreet.length > 0 &&*/}
                                                    {/*    <span className='alert-danger'>*/}
                                                    {/*        <FormattedMessage*/}
                                                    {/*         id="shipingStreet.error"*/}
                                                    {/*        defaultMessage="Առաքման հասցե պարտադիր է" />*/}
                                                    {/*  </span>}*/}
                                                </div>

                                                <div className="form-group col-12 col-md-6 px-0">
                                                    <FormattedMessage id="checkout.phone" defaultMessage="Phone">
                                                        {(placeholder) => (
                                                            <input
                                                                onChange={this.handleChange}
                                                                value={this.state.shipingPhone}
                                                                name="shipingPhone"
                                                                type="text"
                                                                className="form-control checkout-input"
                                                                id="checkout-phone"
                                                                placeholder={placeholder}
                                                            />
                                                        )}
                                                    </FormattedMessage>
                                                    {/*{errors.shipingPhone.length > 0 &&*/}
                                                    {/*    <span className='alert-danger'><FormattedMessage id="phone.error" defaultMessage="Հեռ։  պարտադիր է" /></span>}*/}
                                                </div>

                                                <div className="form-group col-12 col-md-6 px-0">
                                                    <FormattedMessage
                                                        id="checkout.billApartment"
                                                        defaultMessage="Apartment"
                                                    >
                                                        {(placeholder) => (
                                                            <input
                                                                onChange={this.handleChange}
                                                                value={this.state.billingApartment}
                                                                name="billingApartment"
                                                                type="text"
                                                                className="form-control checkout-input"
                                                                // id="checkout-phone"
                                                                placeholder={placeholder}
                                                            />
                                                        )}
                                                    </FormattedMessage>
                                                </div>

                                                <div className="form-group col-12 col-md-6 px-0">
                                                    <FormattedMessage id="checkout.billCity" defaultMessage="City">
                                                        {(placeholder) => (
                                                            <input
                                                                onChange={this.handleChange}
                                                                value={this.state.billingCity}
                                                                name="billingCity"
                                                                type="text"
                                                                className="form-control checkout-input"
                                                                // id="checkout-phone"
                                                                placeholder={placeholder}
                                                            />
                                                        )}
                                                    </FormattedMessage>
                                                </div>

                                                <div className="form-group col-12 col-md-6 px-0">
                                                    <FormattedMessage
                                                        id="checkout.billPost"
                                                        defaultMessage="Postal code"
                                                    >
                                                        {(placeholder) => (
                                                            <input
                                                                onChange={this.handleChange}
                                                                value={this.state.billingPost}
                                                                name="billingPost"
                                                                type="text"
                                                                className="form-control checkout-input"
                                                                // id="checkout-phone"
                                                                placeholder={placeholder}
                                                            />
                                                        )}
                                                    </FormattedMessage>
                                                </div>

                                                {selectCountry}
                                                {selectState}
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        <ShippingMethod
                                            setShipingMethod={this.setShipingMethod}
                                            shippingMethod={this.state.shippingMethod}
                                            locale={this.state.locale}
                                        />

                                        <div className="form-group">
                                            <label
                                                htmlFor="checkout-comment"
                                                className=" color-lightgray-comm-fms checkout-comment-margin "
                                            >
                                                <FormattedMessage id="blog.add.comment" defaultMessage="Comment" />
                                                {/*<FormattedMessage id="checkout.notes" defaultMessage="Մեկնաբանություն" />*/}
                                            </label>
                                            <textarea
                                                onChange={this.handleChange}
                                                name="notes"
                                                id="checkout-comment"
                                                className="form-control checkout-comment"
                                                rows="4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                                <div className="card mb-0 p-4">
                                    <div className="card-body card-body-fms">
                                        <h3 className="checkout-card-title">
                                            <FormattedMessage id="order" defaultMessage="Your order" />
                                        </h3>

                                        {this.renderCart()}

                                        {this.renderPaymentsList()}
                                        <div className="checkout__agree form-group">
                                            <div className="form-check">
                                                <span className="form-check-input input-check">
                                                    <span className="input-check__body">
                                                        <input
                                                            onClick={this.onclick}
                                                            className="input-check__input"
                                                            type="checkbox"
                                                            id="checkout-terms"
                                                        />
                                                        <span className="input-check__box" />
                                                        <Check9x7Svg className="input-check__icon" />
                                                    </span>
                                                </span>
                                                <label className="form-check-label" htmlFor="checkout-terms">
                                                    <span className="agree-privacy-text">
                                                        <Link to={"/page/about-us"}>
                                                            <FormattedMessage
                                                                id="privacy.police"
                                                                defaultMessage="I agree with Privacy Policy"
                                                            />
                                                        </Link>
                                                    </span>
                                                    <Link to="site/terms">
                                                        {/*<FormattedMessage id="order.term" defaultMessage="Ես կարդացել և համաձայն եմ դրանց հետևյալ կայքերի և պայմանների հետ" />*/}
                                                    </Link>
                                                    <span style={{ color: "orange" }}>*</span>
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={this.handleSubmit}
                                            type="submit"
                                            style={{ width: "50%", fontSize: "18px" }}
                                            className={
                                                !this.state.loading
                                                    ? "btn pt-0 btn-primary btn-primary-fms"
                                                    : "btn btn-primary  btn-primary-fms btn-loading"
                                            }
                                        >
                                            <FormattedMessage id="order-button" defaultMessage="Pay" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    locale: state.locale,
    token: state.cartToken,
    customer: state.customer,
});

const mapDispatchToProps = (dispatch) => ({
    cartUpdateData: (data) => dispatch(cartUpdateData(data)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout));
