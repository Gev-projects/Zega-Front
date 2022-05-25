// react
import React, { useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import Indicator from "./Indicator";
import { Cart20Svg, Cross10Svg } from "../../svg";
import { cartRemoveItem } from "../../store/cart";
import { url } from "../../services/utils";
import { urlLink } from "../../helper";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

function IndicatorCart(props) {
    const cartToken = useSelector((state) => state.cartToken);
    const customer = useSelector((state) => state.customer);
    const { cart, cartRemoveItem } = props;
    const [open, setOpen] = useState(false);

    let dropdown;
    let totals;

    const items = cart.items.map((item) => {
        let image;
        let cartItemId;

        for (var i = 0; i < cart.cartItems.length; i++) {
            if (cart.cartItems[i].productID === item.product.id) {
                cartItemId = cart.cartItems[i].cartItemId;
                break;
            }
        }

        if (item.product.images && item.product.images.length) {
            image = (
                <div className="product-image dropcart__product-image">
                    <Link to={url.product(item.product)} className="product-image__body">
                        <img
                            className="product-image__img product-small-img"
                            src={item.product.base_image.original_image_url}
                            alt=""
                        />
                    </Link>
                </div>
            );
        }

        const removeButton = (
            <AsyncAction
                action={() => cartRemoveItem(item.id, cartItemId, cartToken, customer)}
                render={({ run, loading }) => {
                    const classes = classNames("dropcart__product-remove btn btn-light btn-sm btn-svg-icon", {
                        "btn-loading": loading,
                    });

                    return (
                        <button type="button" onClick={run} className={classes}>
                            <Cross10Svg />
                        </button>
                    );
                }}
            />
        );

        // const itemPrice = item && item.price ? item.price.split('.')[0] : 0;
        const itemPrice = item.product.formated_special_price
            ? item.product.formated_special_price
            : item.product.formated_price;

        return (
            <div key={item.id} className="dropcart__product">
                {image}
                <div className="dropcart__product-info">
                    <div className="dropcart__product-name">
                        <Link to={url.product(item.product)}>{item.product.name}</Link>
                    </div>
                    {/* {options} */}
                    <div className="dropcart__product-meta">
                        <span className="dropcart__product-quantity">{item.quantity}</span>
                        {" × "}
                        <span className="dropcart__product-price">
                            <Currency value={itemPrice} />
                        </span>
                    </div>
                </div>
                {removeButton}
            </div>
        );
    });

    if (cart.quantity) {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__products-list">{items}</div>

                <div className="dropcart__totals">
                    <table>
                        <tbody>
                            {totals}
                            <tr>
                                <th>
                                    <FormattedMessage id="global.total.l" defaultMessage="Total" />{" "}
                                </th>
                                <td>
                                    <Currency value={cart.total} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="dropcart__buttons">
                    <Link
                        className="btn btn-secondary btn btn-primary-fms"
                        to="/shop/cart"
                        onClick={() => setOpen(!open)}
                    >
                        <FormattedMessage id="dropcart-cart-btn" defaultMessage="Cart" />
                    </Link>
                    <Link
                        className="btn btn-orange rounded-pill btn btn-primary-fms "
                        to="/shop/checkout"
                        onClick={() => setOpen(!open)}
                    >
                        <FormattedMessage id="dropcart-checkout-btn" defaultMessage="Checkout" />
                    </Link>
                </div>
            </div>
        );
    } else {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__empty">
                    <FormattedMessage id="cart.yourCartIsEmpty" defaultMessage="Your cart is empty!" />
                </div>
            </div>
        );
    }

    const func = (bool) => {
        setOpen(bool);
    };

    return (
        <Indicator
            url="/shop/cart"
            func={func}
            openEd={open}
            open={open}
            dropdown={dropdown}
            value={cart.quantity}
            icon={<Cart20Svg />}
        />
    );
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = {
    cartRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
