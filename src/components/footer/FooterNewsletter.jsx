// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";

export default function FooterNewsletter() {
    const [email, Setemail] = useState();
    const [success, SetSuccess] = useState();
    const hnadlarChange = (event) => {
        Setemail(event.target.value);
    };

    const handlerClick = (event) => {
        event.preventDefault();

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            fetch(`${url}/api/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriber_email: email }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        SetSuccess({ message: data.success, class: "text-success" });
                    } else {
                        SetSuccess({ message: data.success, class: "text-danger" });
                    }
                })
                .catch((error) => console.error(error, "error"));
        } else {
            SetSuccess({ message: "Invalid Email", class: "text-danger" });
        }
    };
    return (
        <div className="footer-newsletter-container">
            <h5 className="footer-newsletter__title">
                <FormattedMessage id="footer.subscribe" defaultMessage="Subscribe" />
            </h5>

            <form action="" className="footer-newsletter__form">
                <label className="sr-only" htmlFor="footer-newsletter-address">
                    <FormattedMessage id="topbar.email" defaultMessage="E-mail" />
                </label>
                <FormattedMessage id="global.email" defaultMessage="E-mail">
                    {(placeholder) => (
                        <input
                            type="text"
                            onChange={hnadlarChange}
                            className="footer-newsletter__form-input form-control"
                            id="footer-newsletter-address"
                            placeholder={placeholder}
                        />
                    )}
                </FormattedMessage>
                {success ? (
                    <small id="passwordHelp" className={success.class}>
                        {success.message}
                    </small>
                ) : (
                    ""
                )}
                <button
                    onClick={handlerClick}
                    type="submit"
                    className="footer-newsletter__form-button btn btn-primary-fms  "
                >
                    <FormattedMessage id="footer.subscribe" defaultMessage="Subscribe" />
                </button>
            </form>
        </div>
    );
}
