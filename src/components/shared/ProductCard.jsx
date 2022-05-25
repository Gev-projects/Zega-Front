// react
import React, { useState, useEffect } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "./AsyncAction";
import Currency from "./Currency";
import { cartAddItem } from "../../store/cart";
import { Wishlist16Svg } from "../../svg";
import { AddCart } from "../../svg";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import { url } from "../../services/utils";
import { wishlistAddItem } from "../../store/wishlist";

import { urlLink } from "../../helper";
import { FormattedMessage } from "react-intl";

import { useSelector } from "react-redux";
import ReactPixel from "react-facebook-pixel";

function ProductCard(props) {
    const { customer, product, layout, cartAddItem, wishlistAddItem } = props;
    const [dimension, setDimension] = useState(window.innerWidth);

    React.useEffect(() => {
        function handleResize() {
            setDimension(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
    }, [window.innerWidth]);

    const productLink = "";

    const isTablet = () => {
        if (dimension >= 1024) {
            return false;
        } else {
            return true;
        }
    };

    const selectedData = useSelector((state) => state.locale);
    const cartToken = useSelector((state) => state.cartToken);

    const containerClasses = classNames("product-card", {
        "product-card--layout--grid product-card--size--sm": layout === "grid-sm",
        "product-card--layout--grid product-card--size--nl": layout === "grid-nl",
        "product-card--layout--grid product-card--size--lg": layout === "grid-lg",
        "product-card--layout--list": layout === "list",
        "product-card--layout--horizontal": layout === "horizontal",
    });

    let badges = [];
    let image;
    let price;
    let features;

    if (product.images && product.images.length > 0) {
        image = (
            <div className="product-card__image product-image">
                {!isTablet() ? (
                    <Link to={url.product(product)}>
                        <div className="product-image__body product-image__body-fms">
                            <div className="item_overlay hide-for-tablet"></div>
                            <div className="img_btn_wrapper">
                                <AsyncAction
                                    action={() => cartAddItem(product, [], 1, cartToken, customer, selectedData)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                run();
                                            }}
                                            className={classNames(
                                                "btn btn-primary product-card__addtocart hide-for-tablet",
                                                {
                                                    "btn-loading": loading,
                                                }
                                            )}
                                        >
                                            <FormattedMessage id="wishList.addToCart" defaultMessage="Add to cart" />
                                        </button>
                                    )}
                                />
                            </div>
                            <img
                                className="product-image__img"
                                src={
                                    `${product.base_image.original_image_url}` ||
                                    `${urlLink}/cache/medium/` + product.images[0]
                                }
                                alt=""
                            />
                            {/*<img className="product-image__img" src={product.base_image.medium_image_url} alt="" />*/}
                        </div>
                    </Link>
                ) : (
                    <Link to={isTablet() ? url.product(product) : ""} className="product-image__body">
                        <div className="product-image__body">
                            <div className="item_overlay hide-for-tablet"></div>
                            <div className="img_btn_wrapper">
                                <AsyncAction
                                    action={() => cartAddItem(product, [], 1, cartToken, customer, selectedData)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            onClick={run}
                                            className={classNames(
                                                "btn btn-primary product-card__addtocart hide-for-tablet",
                                                {
                                                    "btn-loading": loading,
                                                }
                                            )}
                                        >
                                            <FormattedMessage id="wishList.addToCart" defaultMessage="Add to cart" />
                                        </button>
                                    )}
                                />
                            </div>
                            <img src={product.base_image.original_image_url} className="product-image__img" alt="" />
                        </div>
                    </Link>
                )}
            </div>
        );
    } else {
        image = (
            <div className="product-card__image product-image">
                <div className="product-image__body">
                    <div className="item_overlay hide-for-tablet"></div>
                    <div className="img_btn_wrapper"></div>
                    <img
                        className="product-image__img"
                        src="/images/products/defoultpic.png"
                        alt="Picture is missing"
                    />
                </div>
            </div>
        );
    }

    if (product.old_price) {
        price = (
            <div className="product-card__prices">
                <span className="product-card__new-price">
                    <Currency value={product.formated_special_price} />
                </span>
                {
                    <span className="product-card__old-price">
                        <Currency value={product.formated_price} />
                    </span>
                }
            </div>
        );
    } else {
        price = (
            <div className="product-card__prices">
                <Currency value={product.formated_price} />
                {/* <Currency value={parseInt(product.price)} /> */}
            </div>
        );
    }

    if (product.attributes && product.attributes.length) {
        features = (
            <ul className="product-card__features-list">
                {product.attributes
                    .filter((x) => x.featured)
                    .map((attribute, index) => (
                        <li key={index}>{`${attribute.name}: ${attribute.values.map((x) => x.name).join(", ")}`}</li>
                    ))}
            </ul>
        );
    }

    return (
        <React.Fragment>
            <div className={containerClasses}>
                {badges}
                {image}
                <div className="d-flex product-card__info">
                    <div className="product-card__name">
                        <Link to={url.product(product)}>{product.name}</Link>
                    </div>
                    <div className="product-card-description  product-card-short_description">
                        {product.short_description ? product.short_description.replace(/<\/?[^>]+>/gi, "") : ""}
                    </div>
                </div>
                <div className="product-card__actions">
                    <div className="product-card__availability">
                        <FormattedMessage id="availability" defaultMessage="Availabiluty" /> :
                        <span className="text-success">
                            <FormattedMessage id="wishList.inStock" defaultMessage="In stock" />
                        </span>
                    </div>
                    {price}
                    <div className="product-card__buttons">
                        <AsyncAction
                            action={() => wishlistAddItem(product, selectedData)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    className={classNames(
                                        "btn btn-light btn-svg-icon btn-svg-icon--fake-svg product-card__wishlist",
                                        {
                                            "btn-loading": loading,
                                        }
                                    )}
                                >
                                    <Wishlist16Svg />
                                </button>
                            )}
                        />

                        {/*<AsyncAction*/}
                        {/*    action={() => cartAddItem(product,[], 1,cartToken,customer,selectedData)}*/}
                        {/*    render={({ run, loading }) => (*/}
                        {/*        <button*/}
                        {/*            type="button"*/}
                        {/*            onClick={run}*/}
                        {/*            className={classNames('btn btn-light btn-svg-icon product-card-add show-for-tablet', {*/}
                        {/*                'btn-loading': loading,*/}
                        {/*            })}*/}
                        {/*        >*/}
                        {/*                <AddCart className="product-card-add" />*/}
                        {/*        </button>*/}

                        {/*    )}*/}
                        {/*/>*/}
                    </div>
                    <AsyncAction
                        action={() => cartAddItem(product, [], 1, cartToken, customer, selectedData)}
                        render={({ run, loading }) => (
                            <button
                                type="button"
                                onClick={run}
                                className={classNames(
                                    "btn btn-primary product-card__addtocart-tablet show-for-tablet btn-primary-fms ",
                                    {
                                        "btn-loading": loading,
                                    }
                                )}
                            >
                                <FormattedMessage id="addToCart" defaultMessage="Add to cart" />
                            </button>
                        )}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

ProductCard.propTypes = {
    /**
     * product object
     */
    product: PropTypes.object.isRequired,
    /**
     * product card layout
     * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
     */
    layout: PropTypes.oneOf(["grid-sm", "grid-nl", "grid-lg", "list", "horizontal"]),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
    quickviewOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
