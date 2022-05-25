// react
import React, { useState, useEffect } from "react";

// third-party
import classNames from "classnames";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import { Cart16Svg } from "../../svg";
import { cartAddItem } from "../../store/cart";
import { url } from "../../services/utils";
import Currency from "../shared/Currency";
import { urlLink } from "../../helper";

function Suggestions(props) {
    const { context, className, products, cartAddItem } = props;
    const rootClasses = classNames(`suggestions suggestions--location--${context}`, className);
    const [token, setToken] = useState();
    const customer = useSelector((state) => state.customer);
    const selectedData = useSelector((state) => state.locale);

    useEffect(() => {
        fetch(urlLink + "/api/checkout/cart/token")
            .then((responce) => responce.json())
            .then((res) => {
                setToken(res);
            })
            .catch((err) => console.error(err));
    }, []);

    const list =
        products &&
        products.map((product) => (
            <li key={product.product_id} className="suggestions__item">
                {product.images && product.images.length > 0 && (
                    <div className="suggestions__item-image product-image">
                        <div className="product-image__body">
                            <img
                                className="product-image__img suggestion-img"
                                src={product.base_image.small_image_url}
                                alt=""
                            />
                        </div>
                    </div>
                )}
                <div className="suggestions__item-info">
                    <Link className="suggestions__item-name" to={url.product(product)}>
                        {product.name}
                    </Link>
                    <div className="suggestions__item-meta">SKU: {product.sku}</div>
                </div>
                <div className="suggestions__item-price">
                    <Currency value={product.price} />
                </div>
                {context === "header" && (
                    <div className="suggestions__item-actions">
                        <AsyncAction
                            action={() => cartAddItem(product, [], 1, token, customer, selectedData)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    title="Add to cart"
                                    className={classNames("btn btn-primary btn-sm btn-svg-icon suggestion-btn", {
                                        "btn-loading": loading,
                                    })}
                                >
                                    <Cart16Svg />
                                </button>
                            )}
                        />
                    </div>
                )}
            </li>
        ));

    return (
        <div className={rootClasses}>
            <ul className="suggestions__list">{list}</ul>
        </div>
    );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    cartAddItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
