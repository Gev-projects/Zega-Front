// react
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";

export default function AccountForgotPassword(props) {
    const [success, setSuccess] = useState();
    const [errors, setErrors] = useState();

    const [input, Setinput] = useState();
    const handleChange = (e) => {
        Setinput(e.target.value);
    };

    const sedForgot = (event) => {
        event.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: input,
            }),
        };
        fetch(`${url}/api/customer/forgot-password`, options)
            .then((response) => response.json())
            .then((res) => {
                if (res.message) {
                    if (res.message.email) {
                        setErrors(res.message.email);
                    } else {
                        setSuccess(res.message);
                    }
                } else {
                    setErrors(res.error);
                }
            })
            .catch((error) => console.log(error));
    };


    return (
        <>
            <div
                className="container"
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    marginTop: "50px",
                }}
            >
                <div className=" col-md-6 d-flex mt-4 mt-md-0 forgot-pass-block">
                    <div className="card flex-grow-1 mb-0">
                        <div className="card-body p-5">
                            <h3 class="card-title">
                                <FormattedMessage id="email" defaultMessage="e-mail address" />
                            </h3>

                            <form>
                                <div class="form-group">
                                    <FormattedMessage id="email" defaultMessage="e-mail address">
                                        {(placeholder) => (
                                            <input
                                                onChange={handleChange}
                                                value={input}
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                class="form-control forgot-pass-input"
                                                placeholder={placeholder}
                                            />
                                        )}
                                    </FormattedMessage>

                                    {errors ? <div class="alert alert-danger">{errors}</div> : ""}
                                    <button
                                        type="submit"
                                        onClick={sedForgot}
                                        className="btn btn-primary mt-2 mt-md-3 mt-lg-5 f15 px-4 py-2"
                                    >
                                        <FormattedMessage id="send" defaultMessage="Send" />
                                    </button>

                                    {success ? (
                                        <div
                                            style={{
                                                marginTop: "20px",
                                                borderRadius: "4px",
                                            }}
                                            class="alert alert-success"
                                        >
                                            {success}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
