import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";

export default function ShippingAddress({ passOption, callback, state }) {
    const [defaultAddress, setDefaultAddress] = useState(true);
    const [newAddress, setNewAddress] = useState(false);
    const [newAddressInputs, setNewAddressInputs] = useState("none");
    const [countryList, setCountryList] = useState();
    const [countryStates, setCountryStates] = useState();

    function addNew() {
        setDefaultAddress(false);
        setNewAddress(true);
        setNewAddressInputs("block");
        passOption({});
    }

    function setDefault(id) {
        const selectedAddress = state.pastOrders.filter((e) => e.id === id)[0];

        if (selectedAddress) {
            passOption(selectedAddress);
        }
        setDefaultAddress(true);
        setNewAddress(false);
        setNewAddressInputs("none");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        callback(name, value);
    };

    useEffect(() => {
        fetch(`${url}/api/country-states?pagination=0`)
            .then((res) => res.json())
            .then((res) => setCountryStates(res));
    }, []);

    useEffect(() => {
        fetch(`${url}/api/countries?pagination=0`)
            .then((res) => res.json())
            .then((res) => setCountryList(res.data.reverse()));
    }, []);

    let selectCountry;
    let selectState;
    let countryCode;

    if (countryList) {
        selectCountry = (
            <div className="select-container">
                <select className="checkout-select checkout-input" name="country" onChange={handleChange}>
                    <FormattedMessage id="checkout.country" defaultMessage="Select Country">
                        {(placeholder) => (
                            <option selected="true" disabled="disabled">
                                {placeholder}
                            </option>
                        )}
                    </FormattedMessage>
                    {countryList.map((option) => {
                        return <option value={option.name}>{option.name}</option>;
                    })}
                </select>
            </div>
        );
    }

    if (countryList && state.country) {
        for (let i = 0; i <= countryList.length; i++) {
            if (countryList[i] && countryList[i].name == state.country) {
                countryCode = countryList[i].code;
            }
        }
    }

    if (countryCode && countryStates && countryStates.data && countryStates.data[countryCode]) {
        selectState = (
            <div className="form-group col-12 col-md-6">
                <div className="select-container">
                    <select className="checkout-select checkout-input" name="states" onChange={handleChange}>
                        <option selected="true" disabled="disabled">
                            Select State
                        </option>
                        {countryStates.data[countryCode].map((option) => (
                            <option value={option.default_name}>{option.default_name}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    } else {
        selectState = "";
    }

    let pastAddresses = state.pastOrders.map((address) => (
        <span key={address.id} className="input-radio__body my-2">
            <input
                type="radio"
                className="input-radio__input"
                name="addressOption"
                // value={state.checkout_shipping_old_address}
                // checked={defaultAddress}
                onClick={() => {
                    setDefault(address.id);
                }}
            />

            <span className="input-radio__circle mr-3" />
            <span className="payment-methods__item-title">
                <span> {address.city}, </span>
                <span> {address.address1}, </span>
                <span> {address.postcode}, </span>
                <span>
                    {" "}
                    ( {address.first_name} {address.last_name} ){" "}
                </span>
            </span>
        </span>
    ));

    return (
        <div className="m-4">
            {state.customer.authenticated && state.pastOrders && state.pastOrders.length > 0 ? (
                <>
                    <div className="checkout-card-title m-0">
                        <FormattedMessage id="shipping-title" defaultMessage="Shipping address" />
                    </div>

                    {pastAddresses}

                    <span className="input-radio__body my-2">
                        <input
                            type="radio"
                            className="input-radio__input"
                            // name="checkout_shipping_method"
                            name="addressOption"
                            // value="default address"
                            checked={newAddress}
                            onChange={addNew}
                        />

                        <span className="input-radio__circle mr-3" />
                        <span className="payment-methods__item-title">
                            <FormattedMessage id="addNewAdress" defaultMessage="Add new addsress " />
                        </span>
                    </span>
                </>
            ) : (
                <div className="checkout-card-title-fms">
                    <FormattedMessage id="shipping-title" defaultMessage="Shipping address" />
                </div>
            )}
            <div
                className="row"
                style={{
                    display:
                        state.customer.authenticated && state.pastOrders && state.pastOrders.length > 0
                            ? newAddressInputs
                            : "block",
                }}
            >
                <div className="">
                    <form>
                        <div className="form-group col-12 col-md-6 my-2 my-md-4">
                            <FormattedMessage id="account.firstName" defaultMessage="First name">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.fullName}
                                        type="text"
                                        name="fullName"
                                        className="form-control checkout-input"
                                        id="checkout-first-name"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>

                            {state.errors.fullName.length > 0 && (
                                <span className="alert-danger">
                                    {" "}
                                    <FormattedMessage id="name.error" defaultMessage="Name field is required" />
                                </span>
                            )}
                        </div>
                        <div className="form-group col-12 col-md-6 my-2 my-md-4">
                            <FormattedMessage id="checkout.lname" defaultMessage="Last name">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.lname}
                                        type="text"
                                        name="lname"
                                        className="form-control checkout-input"
                                        id="checkout-first-name"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>
                            {state.errors.lname.length > 0 && (
                                <span className="alert-danger">
                                    {" "}
                                    <FormattedMessage id="errors.lname" defaultMessage="Surname field is required" />
                                </span>
                            )}
                        </div>

                        <div className="form-group col-12 col-md-12">
                            <FormattedMessage id="global.address" defaultMessage="Address">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.street}
                                        name="street"
                                        type="text"
                                        className="form-control checkout-input"
                                        id="checkout-street"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>

                            {state.errors.street.length > 0 && (
                                <span className="alert-danger">
                                    <FormattedMessage id="address.error" defaultMessage="Address field is required" />
                                </span>
                            )}
                        </div>

                        <div className="form-group col-12 col-md-6">
                            <FormattedMessage id="checkout-apartment" defaultMessage="Apartment, suite">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.apartment}
                                        type="text"
                                        name="apartment"
                                        className="form-control checkout-input"
                                        // id="apartment"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>
                            {state.errors.apartment.length > 0 && (
                                <span className="alert-danger">
                                    {" "}
                                    <FormattedMessage
                                        id="errors.apartment"
                                        defaultMessage="Apartment field is required"
                                    />
                                </span>
                            )}
                        </div>

                        <div className="form-group col-12 col-md-6">
                            <FormattedMessage id="global.city" defaultMessage="City">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.city}
                                        type="text"
                                        name="city"
                                        className="form-control checkout-input"
                                        id="checkout-city"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>

                            {state.errors.city.length > 0 && (
                                <span className="alert-danger">
                                    {" "}
                                    <FormattedMessage id="errors.city" defaultMessage="City field is required" />
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="form-group col-12 col-md-6">
                                {selectCountry}
                                {state.errors.country.length > 0 && (
                                    <span className="alert-danger">
                                        {" "}
                                        <FormattedMessage
                                            id="errors.country"
                                            defaultMessage="Country field is required"
                                        />
                                    </span>
                                )}
                            </div>

                            {/*<div className="form-group col-12 col-md-6 my-2 my-md-4">*/}
                            {selectState}

                            {/*{state.errors.country.length > 0 &&*/}
                            {/*<span className='alert-danger'> <FormattedMessage id="errors.country" defaultMessage="Երկիր դաշտը պարտադիր է" /></span>}*/}
                            {/*</div>*/}

                            <div className="form-group col-12 col-md-6">
                                <FormattedMessage id="checkout.post" defaultMessage="Postal code">
                                    {(placeholder) => (
                                        <input
                                            onChange={handleChange}
                                            value={state.postal}
                                            name="postal"
                                            type="text"
                                            className="form-control checkout-input"
                                            id="checkout-post"
                                            placeholder={placeholder}
                                        />
                                    )}
                                </FormattedMessage>
                                {state.errors.postal.length > 0 && (
                                    <span className="alert-danger">
                                        <FormattedMessage id="postal.error" defaultMessage="Postal code is required" />
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="form-group col-12 col-md-6">
                            <FormattedMessage id="global.phoneNumber" defaultMessage="Phone">
                                {(placeholder) => (
                                    <input
                                        onChange={handleChange}
                                        value={state.phone}
                                        name="phone"
                                        type="text"
                                        className="form-control checkout-input"
                                        id="checkout-phone"
                                        placeholder={placeholder}
                                    />
                                )}
                            </FormattedMessage>
                            {state.errors.phone.length > 0 && (
                                <span className="alert-danger">
                                    <FormattedMessage id="phone.error" defaultMessage="Phone field is required" />
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
