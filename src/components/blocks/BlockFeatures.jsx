// react
import React, { useState } from "react";

// third-party
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

// application
import { Fi24Hours48Svg, FiFreeDelivery48Svg, FiPaymentSecurity48Svg } from "../../svg";

export default function BlockFeatures(props) {
    const { layout } = props;

    return (
        <div className={`block block-features block-features--layout--${layout} d-sm-flex justify-content-center`}>
            <div className="block-features__list">
                <div className="block-features__item">
                    <div className="block-features__icon">
                        <FiFreeDelivery48Svg />
                    </div>
                    <div className="block-features__content">
                        <div className="block-features__title">
                            <FormattedMessage id="shipment" defaultMessage="Delivery" />
                        </div>
                        <div className="block-features__subtitle">
                            <FormattedMessage id="shipment" defaultMessage="in Armenian" />
                        </div>
                    </div>
                </div>
                {/* <div className="block-features__divider" /> */}
                <div className="block-features__item">
                    <div className="block-features__icon">
                        <Fi24Hours48Svg />
                    </div>
                    <div className="block-features__content">
                        <div className="block-features__title">
                            <FormattedMessage id="payment-method" defaultMessage="Payment method" />
                        </div>
                        <div className="block-features__subtitle">
                            <FormattedMessage
                                id="paymethods"
                                defaultMessage="Cash, American Express,ARCA, VISA, MasterCard"
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="block-features__divider" /> */}
                <div className="block-features__item">
                    <div className="block-features__icon">
                        <FiPaymentSecurity48Svg />
                    </div>
                    <div className="block-features__content">
                        <div className="block-features__title">
                            <FormattedMessage id="pay" defaultMessage="Payment" />
                        </div>
                        <div className="block-features__subtitle">
                            <FormattedMessage id="serviceTime" defaultMessage="Online service" />
                        </div>
                    </div>
                </div>
                {/* <div className="block-features__divider" /> */}
                {/* <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiTag48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">Hot Offers</div>
                            <div className="block-features__subtitle">Discounts up to 90%</div>
                        </div>
                    </div> */}
            </div>
        </div>
    );
}

BlockFeatures.propTypes = {
    layout: PropTypes.oneOf(["classic", "boxed"]),
};

BlockFeatures.defaultProps = {
    layout: "classic",
};
