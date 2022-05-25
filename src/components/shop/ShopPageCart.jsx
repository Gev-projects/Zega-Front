// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import InputNumber from "../shared/InputNumber";
import PageHeader from "../shared/PageHeader";
import { cartRemoveItem, cartUpdateQuantities } from "../../store/cart";
import { Cross12Svg } from "../../svg";
import { Trash, ArrowBackSvg } from "../../svg";
import { BackArrow } from "../../svg";
import { url } from "../../services/utils";

// data stubs
import theme from "../../data/theme";
import { urlLink } from "../../helper";

class ShopPageCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /** example: [{itemId: 8, value: 1}] */
            quantities: [],
            cartToken: this.props.cartToken,
            customer: this.props.customer,
        };
    }
    getItemQuantity(item) {
        const { quantities } = this.state;
        const quantity = quantities.find((x) => x.itemId === item.id);
        return quantity ? quantity.value : item.quantity;
    }

    handleChangeQuantity = (item, quantity, cartItem) => {
        this.setState((state) => {
            const stateQuantity = state.quantities.find((x) => x.itemId === item.id);

            if (!stateQuantity) {
                state.quantities.push({ itemId: item.id, value: quantity, cartItem: cartItem });
            } else {
                stateQuantity.value = quantity;
            }

            return {
                quantities: state.quantities,
            };
        });
    };

    cartNeedUpdate() {
        const { quantities } = this.state;
        const { cart } = this.props;

        return (
            quantities.filter((x) => {
                const item = cart.items.find((item) => item.id === x.itemId);

                return item && item.quantity !== x.value && x.value !== "";
            }).length > 0
        );
    }

    renderItems() {
        const { cart, cartRemoveItem } = this.props;
        return cart.items.map((item, index) => {
            let image;
            let options;
            let id;
            const maxQty = this.props.bOrder ? 50000 : item.product.qty;
            if (item.product.images && item.product.images.length > 0) {
                id = cart.items[index].cartItemId;

                image = (
                    <div className="product-image">
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

            if (item.options.length > 0) {
                options = (
                    <ul className="cart-table__options">
                        {item.options.map((option, index) => (
                            <li key={index}>{`${option.optionTitle}: ${option.valueTitle}`}</li>
                        ))}
                    </ul>
                );
            }

            let cartItemId;

            for (var i = 0; i < cart.cartItems.length; i++) {
                if (cart.cartItems[i].productID === item.product.id) {
                    cartItemId = cart.cartItems[i].cartItemId;
                    break;
                }
            }

            const removeButton = (
                <AsyncAction
                    action={() => cartRemoveItem(item.id, cartItemId, this.state.cartToken, this.state.customer)}
                    render={({ run, loading }) => {
                        const classes = classNames("btn btn-light btn-sm btn-svg-icon", {
                            "btn-loading": loading,
                        });

                        return (
                            <button type="button" onClick={run} className={classes}>
                                {/*<Cross12Svg />*/}
                                <Trash />
                            </button>
                        );
                    }}
                />
            );

            return (
                <tr key={item.id} className="cart-table__row">
                    <td className="cart-table__column cart-table__column--image">{image}</td>
                    <td className="cart-table__column cart-table__column--product">
                        <Link to={url.product(item.product)} className="cart-table__product-name">
                            {item.product.name}
                        </Link>
                        {options}
                    </td>
                    <td className="cart-table__column cart-table__column--price">
                        <Currency value={item.price} />
                    </td>

                    <td className="cart-table__column cart-table__column--quantity" data-title="Quantity">
                        <InputNumber
                            onChange={(quantity) => this.handleChangeQuantity(item, quantity, cart.items[0].id)}
                            value={this.getItemQuantity(item)}
                            min={1}
                            max={maxQty}
                        />
                    </td>
                    <td className="cart-table__column cart-table__column--total" data-title="Total">
                        <Currency value={item.total} />
                    </td>
                    <td className="cart-table__column cart-table__column--remove">{removeButton}</td>
                </tr>
            );
        });
    }

    renderTotals() {
        const { cart } = this.props;

        return (
            <React.Fragment>
                <thead className="cart__totals-header">
                    <tr>
                        <th>Subtotal</th>
                        <td>
                            <Currency value={cart.subtotal} />
                        </td>
                    </tr>
                </thead>
                <tbody className="cart__totals-body"></tbody>
            </React.Fragment>
        );
    }

    renderCart() {
        const { cart, cartUpdateQuantities } = this.props;
        const { quantities } = this.state;

        const updateCartButton = (
            <AsyncAction
                action={() =>
                    cartUpdateQuantities(quantities, cart.cartItems, this.state.customer, this.state.cartToken)
                }
                render={({ run, loading }) => {
                    const classes = classNames("btn  rounded-pill  update-cart-button-fms", {
                        "btn-loading": loading,
                    });

                    return (
                        <button type="button" onClick={run} className={classes} disabled={!this.cartNeedUpdate()}>
                            <FormattedMessage id="global.updateCart" defaultMessage="Update Cart" />
                        </button>
                    );
                }}
            />
        );

        return (
            <div className="cart block mt-0">
                <div className="container cart-page-container">
                    <table className="cart__table cart-table">
                        <thead className="cart-table__head">
                            <tr className="cart-table__row">
                                <th className="cart-table__column cart-table__column--image">
                                    <FormattedMessage id="wishList.image" defaultMessage="Image" />
                                </th>
                                <th className="cart-table__column cart-table__column--product">
                                    <FormattedMessage id="global.product" defaultMessage="Product" />
                                </th>
                                <th className="cart-table__column cart-table__column--price">
                                    <FormattedMessage id="global.price" defaultMessage="Price" />
                                </th>
                                <th className="cart-table__column cart-table__column--quantity">
                                    <FormattedMessage id="global.quantity" defaultMessage="Quantity" />
                                </th>
                                <th className="cart-table__column cart-table__column--total">
                                    <FormattedMessage id="global.total" defaultMessage="Total" />
                                </th>
                                <th className="cart-table__column cart-table__column--remove" aria-label="Remove" />
                            </tr>
                        </thead>
                        <tbody className="cart-table__body">{this.renderItems()}</tbody>
                    </table>
                    <div className="cart__actions">
                        <div className="cart__buttons">
                            <div className="continue--arrow">
                                <ArrowBackSvg className="continue--arrow" />
                                <Link to="/" className="continue-shopping-title">
                                    <FormattedMessage id="continue-shopping" defaultMessage="Continue Shopping" />
                                </Link>
                            </div>
                            {updateCartButton}
                        </div>
                    </div>

                    <div className="row justify-content-end pt-5 mr-1 shopping-cart-mobile-fms ">
                        <div className="shopping-cart-totals">
                            <div className="card">
                                <div className="card-body">
                                    {/* <h3 className="card-title">Cart Totals</h3> */}

                                    <table className="cart__totals">
                                        {/*  {this.renderTotals()} */}
                                        <tfoot className="cart__totals-footer">
                                            <tr>
                                                <th>
                                                    {" "}
                                                    <FormattedMessage
                                                        id="total.price"
                                                        defaultMessage="Total Price"
                                                    />{" "}
                                                </th>
                                                <td>
                                                    <Currency value={cart.total} />
                                                </td>
                                            </tr>

                                            <tr>
                                                <th>
                                                    {" "}
                                                    <FormattedMessage id="tax" defaultMessage="Tax" />{" "}
                                                </th>
                                                <td>{cart.tax}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FormattedMessage id="global.total.l" defaultMessage="Total" />
                                                </th>
                                                <td>
                                                    <Currency value={cart.total} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" className="cart__totals-td">
                                                    <Link
                                                        to="/shop/checkout"
                                                        className="btn text-light btn-orange btn-block  btn-lg cart__checkout-button f16"
                                                    >
                                                        <FormattedMessage id="order.button" defaultMessage="Pay" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { cart } = this.props;
        const breadcrumb = [
            { title: "Home", url: "" },
            { title: "Shopping Cart", url: "" },
        ];

        let content;

        if (cart.quantity) {
            content = this.renderCart();
        } else {
            content = (
                <div className="block block-empty">
                    <div className="container">
                        <div className="block-empty__body">
                            <div className="block-empty__message">
                                <FormattedMessage id="empty-cart" defaultMessage="Your shopping cart is empty!" />
                            </div>
                            <div className="block-empty__actions">
                                <Link to="/" className="btn btn-orange rounded-pill px-4 f16">
                                    <FormattedMessage id="continue" defaultMessage="continue" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Shopping Cart — ${theme.name}`}</title>
                </Helmet>

                <PageHeader header="Shopping Cart" breadcrumb={breadcrumb} />
                <div className="shopping-cart-text">
                    <FormattedMessage id="shopping-cart" defaultMessage="Shopping Cart" />
                </div>

                {content}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    customer: state.customer,
    cartToken: state.cartToken,
    bOrder: state.general.bOrder,
});

const mapDispatchToProps = {
    cartRemoveItem,
    cartUpdateQuantities,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
