// react
import React, { useState, Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { url } from "../../helper";

// application
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import InputNumber from "./InputNumber";
import ProductGallery from "./ProductGallery";
import { cartAddItem } from "../../store/cart";
import { AddCartToken } from "../../store/token";
import { compareAddItem } from "../../store/compare";
import { Wishlist16Svg } from "../../svg";
import { wishlistAddItem } from "../../store/wishlist";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet-async";
import { InnerWishlist, ArrowRoundedDown12x7Svg, ArrowRoundedUp13x8Svg } from "../../svg";

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: this.props.customer,
            quantity: 1,
            locale: this.props.locale,
            token: this.props.token,
            IsOpen: "product-inner-long-description-click",
        };
    }

    componentDidMount() {
        if (this.props.cartToken.cartToken === "") {
            fetch(url + "/api/checkout/cart/token")
                .then((responce) => responce.json())
                .then((res) => {
                    if (res.api_token) {
                        this.props.AddCartToken(res.api_token);
                    }
                })
                .catch((err) => console.error(err));
        }
    }

    createMarkup(item) {
        return { __html: item };
    }

    handleChangeQuantity = (quantity) => {
        this.setState({ quantity });
    };

    render() {
        const { product, layout, wishlistAddItem, compareAddItem, AddCartToken, cartAddItem } = this.props;
        const { quantity } = this.state;
        let prices;
        console.log(product.data);
        const maxQty = this.props.bOrder ? 50000 : product.data.qty;
        let Addtocartdisabled = this.props.bOrder ? "" : "disabled";
        if (product.data.qty) {
            Addtocartdisabled = "";
        }
        const DescriptionOpen = () => {
            if (this.state.IsOpen == "product-inner-long-description-click") {
                this.setState({ IsOpen: "" });
            } else {
                this.setState({ IsOpen: "product-inner-long-description-click" });
            }
        };

        return (
            <>
                <Helmet>
                    <title>{product.data.name}</title>
                    <meta
                        name="description"
                        content={product.data.description ? product.data.description.replace(/(<([^>]+)>)/gi, "") : ""}
                        data-react-helmet={true}
                    />
                    <meta name="name" content={product.data.name ? product.data.name : ""} data-react-helmet={true} />
                    <meta property="og:url" content={window.location} />
                    <meta property="og:title" content={product.data.name} data-react-helmet={true} />
                    <meta
                        property="og:image"
                        content={product.data.images[0].original_image_url}
                        data-react-helmet={true}
                    />
                </Helmet>

                <div className={`product product--layout--${layout}`}>
                    <div className="product__content">
                        <ProductGallery layout={layout} images={product.data.images} />

                        <div className="product__info">
                            <div className="product__wishlist-compare">
                                <AsyncAction
                                    action={() => wishlistAddItem(product, this.state.locale)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            title="Wishlist"
                                            onClick={run}
                                            className={classNames("btn btn-sm btn-light btn-svg-icon", {
                                                "btn-loading": loading,
                                            })}
                                        >
                                            <Wishlist16Svg />
                                        </button>
                                    )}
                                />
                            </div>

                            <div className="product__rating"></div>
                            <p className="f16">{product.data.sku}</p>
                            <h1
                                className="product__name"
                                dangerouslySetInnerHTML={this.createMarkup(product.data.name)}
                            ></h1>
                            <div className="product__prices color-lightgray">
                                {product.data.formated_special_price ? (
                                    <>
                                        <span className="product-card__new-price">
                                            <Currency value={product.data.formated_special_price} />
                                        </span>
                                        <span className="product-card__old-price">
                                            <Currency value={product.data.formated_price} />
                                        </span>
                                    </>
                                ) : (
                                    <span>
                                        <Currency value={product.data.formated_price} />
                                    </span>
                                )}
                            </div>
                            <div>
                                {/* <div className="product-inner-description-title">
                                    <FormattedMessage id="ShortDescriptionTitle" defaultMessage="Short Description" />
                                </div> */}
                                <div
                                    className="f16"
                                    dangerouslySetInnerHTML={this.createMarkup(product.data.short_description)}
                                />
                            </div>
                            <ul className="product__meta">
                                <li className="product__meta-availability">
                                    {/* {product.data.in_stock ? (
                                        <span className="mr-3">
                                            <FormattedMessage id="availability" defaultMessage="Availability" />
                                        </span>
                                    ) : (
                                        <span className="mr-3">
                                            <FormattedMessage id="unavailable" defaultMessage="not available" />
                                        </span>
                                    )} */}
                                    <span className="text-success">
                                        {product.data.in_stock ? (
                                            <FormattedMessage id="wishList.inStock" defaultMessage="in stock" />
                                        ) : (
                                            <FormattedMessage id="outOfStock" defaultMessage="not available" />
                                        )}{" "}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="product__sidebar">
                            <div className="product__availability">
                                {product.data.in_stock ? "Availability" : "Unavailable"}{" "}
                                <span className="text-success">
                                    {" "}
                                    {product.data.in_stock ? (
                                        <FormattedMessage id="inStock" defaultMessage="Available" />
                                    ) : (
                                        <FormattedMessage id="outOfStock" defaultMessage="Not available" />
                                    )}{" "}
                                </span>
                            </div>

                            <form className="product__options">
                                <div className="form-group product__option">
                                    <div className="product__actions">
                                        <div className="product__actions-item product-inner-quantity">
                                            <InputNumber
                                                id="product-quantity"
                                                aria-label="Quantity"
                                                className="product__quantity"
                                                size="lg"
                                                min={1}
                                                max={maxQty}
                                                value={quantity}
                                                onChange={this.handleChangeQuantity}
                                                disabled={Addtocartdisabled}
                                            />
                                        </div>
                                        <div className="product__actions-item product__actions-item--addtocart">
                                            <AsyncAction
                                                action={() =>
                                                    cartAddItem(
                                                        product.data,
                                                        [],
                                                        quantity,
                                                        this.state.token,
                                                        this.state.customer,
                                                        this.state.locale
                                                    )
                                                }
                                                render={({ run, loading }) => (
                                                    <button
                                                        type="button"
                                                        onClick={run}
                                                        disabled={Addtocartdisabled}
                                                        className={classNames(
                                                            "btn btn-orange inner-addtocart rounded-pill btn-lg",
                                                            {
                                                                "btn-loading": loading,
                                                            }
                                                        )}
                                                    >
                                                        <FormattedMessage
                                                            id="wishList.addToCart"
                                                            defaultMessage="Add to cart"
                                                        />
                                                    </button>
                                                )}
                                            />
                                        </div>
                                        <div className="product__actions-item product__actions-item--wishlist">
                                            <AsyncAction
                                                action={() => wishlistAddItem(product.data, this.state.locale)}
                                                render={({ run, loading }) => (
                                                    <button
                                                        type="button"
                                                        data-toggle="tooltip"
                                                        title="Wishlist"
                                                        onClick={run}
                                                        className={classNames("btn btn-secondary btn-svg-icon btn-lg", {
                                                            "btn-loading": loading,
                                                        })}
                                                    >
                                                        <InnerWishlist className="inner-wishlist" />
                                                    </button>
                                                )}
                                            />
                                        </div>

                                        <div className="product__actions-item product__actions-item--compare"></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/*   <div className={'product_attributes'}>
                                <ul className="product__meta">
                                    {product.data.attributes.map((name)=>{

                                        return <li>
                                                    {name.names.find(item => item.locale === this.state.locale).name}
                                                    <span >{name.value}</span>
                                               </li>
                                    })}

                                </ul>
                        </div>  */}
                    </div>
                    <div className="product-inner-long-description">
                                <div className="product-inner-description-title">
                                    <FormattedMessage id="descriptionTitle" defaultMessage="Description" />
                                </div>
                                <div>
                                <div
                                //    className={this.state.IsOpen}   onClick={() => DescriptionOpen()}
                                    dangerouslySetInnerHTML={this.createMarkup(product.data.description)}
                                />
                                 </div>
                                {/* {
                                this.state.IsOpen  ? 
                                (<ArrowRoundedDown12x7Svg   onClick={() => DescriptionOpen()} className="inner-Description-down" />):
                                (<ArrowRoundedUp13x8Svg   onClick={() => DescriptionOpen()} className="inner-Description-up" />)} */}
                                   
                            </div>
                </div>
            </>
        );
    }
}

Product.propTypes = {
    /** product object */
    product: PropTypes.object.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
};

Product.defaultProps = {
    layout: "standard",
};

const mapDispatchToProps = {
    AddCartToken,
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
};

export default connect(
    (state) => ({
        locale: state.locale,
        cartToken: state.cartToken,
        token: state.cartToken,
        customer: state.customer,
        bOrder: state.general.bOrder,
    }),
    mapDispatchToProps
)(Product);
