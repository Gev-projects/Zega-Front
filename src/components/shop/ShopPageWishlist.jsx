// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Currency from "../shared/Currency";
import PageHeader from "../shared/PageHeader";
import Rating from "../shared/Rating";
import { cartAddItem } from "../../store/cart";
import { Cross12Svg } from "../../svg";
import { url } from "../../services/utils";
import { wishlistRemoveItem } from "../../store/wishlist";
import { FormattedMessage } from "react-intl";

// data stubs
import theme from "../../data/theme";

import { TrashSvg } from "../../svg";
import WishlistSideAccount from "./WishlistSideAccount";

function ShopPageWishlist(props) {
    const { wishlist, cartAddItem, wishlistRemoveItem, cartToken, customer } = props;
    const breadcrumb = [
        { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "" },
        { title: <FormattedMessage id="wishlist" defaultMessage="Wishlist" />, url: "" },
    ];

    let content;

    if (wishlist.length) {
        const itemsList = wishlist.map((item, index) => {
            let image;

            if (item.images && item.images.length > 0) {
                image = (
                    <div className="product-image">
                        <Link to={url.product(item)} className="product-image__body">
                            <img className="product-image__img" src={item.base_image.original_image_url} alt="" />
                        </Link>
                    </div>
                );
            }

            const renderAddToCarButton = ({ run, loading }) => {
                const classes = classNames("wishlist-card-add-button btn-orange rounded-pill", {
                    "btn-loading": loading,
                });

                return (
                    <button type="button" onClick={run} className={classes}>
                        {" "}
                        <FormattedMessage id="wishList.addToCart" defaultMessage="Add to cart" />
                    </button>
                );
            };

            const renderRemoveButton = ({ run, loading }) => {
                const classes = classNames("wishlist-card-remove", {
                    "btn-loading": loading,
                });

                return (
                    <button type="button" onClick={run} className={classes} aria-label="Remove">
                        {" "}
                        <TrashSvg className="wishlist-card-remove-icon" /> {/*<Cross12Svg />*/}
                    </button>
                );
            };

            return (
                <div key={index} className="wishlist-card-parent">
                    <div className="wishlist-card">
                        <div>
                            <AsyncAction action={() => wishlistRemoveItem(item.id)} render={renderRemoveButton} />
                        </div>

                        <div className="wishlist-card-image">{image}</div>
                        <Link to={url.product(item)}>
                            <p className="wishlist__product-name">{item.name}</p>
                        </Link>
                        <p className="wishlist-card-price">
                            <Currency value={item.price} />
                        </p>
                        <div>
                            <AsyncAction
                                action={() => cartAddItem(item, [], 1, cartToken, customer)}
                                //render={renderAddToCarButton}
                            />
                        </div>

                        <button className="btn-orange no-border rounded-pill">
                            <AsyncAction
                                action={() => cartAddItem(item, [], 1, cartToken, customer)}
                                render={renderAddToCarButton}
                            />
                        </button>
                    </div>
                </div>
            );

            // return (
            //      <tr key={index} className="wishlist__row">
            //         <td className="wishlist__column wishlist__column--image">
            //             {image}
            //         </td>
            //         <td className="wishlist__column wishlist__column--product">
            //             <Link to={url.product(item)} className="wishlist__product-name">{item.name}</Link>
            //             {/* <div className="wishlist__product-rating">
            //                 <Rating value={item.rating} />
            //                 <div className="wishlist__product-rating-legend">{`${item.reviews} Reviews`}</div>
            //             </div> */}
            //         </td>
            //         {/*<td className="wishlist__column wishlist__column--stock">*/}
            //         {/*    <div className="badge badge-success"><FormattedMessage id="inStock" defaultMessage="Առկա է" /></div>*/}
            //         {/*</td>*/}
            //         <td className="wishlist__column wishlist__column--price"><Currency value={item.price} /></td>
            //         <td className="wishlist__column wishlist__column--tocart">
            //             <AsyncAction
            //                 action={() => cartAddItem(item,  [], 1,cartToken,customer)}
            //                 render={renderAddToCarButton}
            //             />
            //         </td>
            //         <td className="wishlist__column wishlist__column--remove">
            //             <AsyncAction
            //                 action={() => wishlistRemoveItem(item.id)}
            //                 render={renderRemoveButton}
            //             />
            //         </td>
            //     </tr>
            // );
        });

        content = (
            <div className="block">
                <div className="container p-0 wishlist-container">
                    <div className="wishlist">
                        {/*<WishlistSideAccount />*/}

                        {/*<thead className="wishlist__head">*/}
                        {/*    <tr className="wishlist__row">*/}
                        {/*        <th className="wishlist__column wishlist__column--image"><FormattedMessage id="image" defaultMessage="Նկար" /></th>*/}
                        {/*        <th className="wishlist__column wishlist__column--product"><FormattedMessage id="product" defaultMessage="Ապրանք" /></th>*/}
                        {/*        <th className="wishlist__column wishlist__column--stock"> <FormattedMessage id="status" defaultMessage="Կարգավիճակ" /></th>*/}
                        {/*        <th className="wishlist__column wishlist__column--price"><FormattedMessage id="Price" defaultMessage="Գին" /></th>*/}
                        {/*        <th className="wishlist__column wishlist__column--tocart" aria-label="Add to cart" />*/}
                        {/*        <th className="wishlist__column wishlist__column--remove" aria-label="Remove" />*/}
                        {/*    </tr>*/}
                        {/*</thead>*/}
                        <div className="wishlist__body">{itemsList}</div>
                    </div>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="block block-empty">
                {/* <WishlistSideAccount /> */}
                {/*<div className="container">*/}
                <div className="block-empty__body">
                    <div className="block-empty__message">
                        {" "}
                        <FormattedMessage
                            id="wishList.YourWishListIsEmpty!"
                            defaultMessage="Your wishlist is empty:"
                        />{" "}
                    </div>
                    <div className="block-empty__actions">
                        <Link to="/" className="btn btn-orange rounded-pill f16">
                            <FormattedMessage id="continue-shopping" defaultMessage="Continue" />
                        </Link>
                    </div>
                </div>
                {/*</div>*/}
            </div>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Wish List — ${theme.name}`}</title>
            </Helmet>
            <PageHeader header="" breadcrumb={breadcrumb} />
            <h2 style={{ textAlign: "center", marginBottom: "50px" }}>
                <FormattedMessage id="account.wishlist" defaultMessage="Wish List" />
            </h2>
            {content}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
    wishlist: state.wishlist,
    cartToken: state.cartToken,
    customer: state.customer,
});

const mapDispatchToProps = {
    cartAddItem,
    wishlistRemoveItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageWishlist);
