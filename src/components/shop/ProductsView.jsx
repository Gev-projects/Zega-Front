// react
import React, { useCallback, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import Pagination from "../shared/Pagination";
import ProductCard from "../shared/ProductCard";
import { Filters16Svg } from "../../svg";
import { sidebarOpen } from "../../store/sidebar";

import { Helmet } from "react-helmet-async";
import { FormattedMessage } from "react-intl";
import Arrow from "../../custom-svg/arrow.svg";

function useSetOption(option, filter, dispatch) {
    const callback = useCallback(filter, []);

    return useCallback(
        (data) => {
            dispatch({
                type: "SET_OPTION_VALUE",
                option,
                value: callback(data),
            });
        },
        [option, callback, dispatch]
    );
}

function ProductsView(props) {
    const {
        length,
        customer,
        isLoading,
        productsList,
        options,
        filters,
        dispatch,
        layout: propsLayout,
        grid,
        offcanvas,
        sidebarOpen,
    } = props;
    const [layout, setLayout] = useState(propsLayout);
    const handlePageChange = useSetOption("page", parseFloat, dispatch);
    const handleSortChange = useSetOption("sort", (event) => event.target.value, dispatch);
    const handleLimitChange = useSetOption("limit", (event) => parseFloat(event.target.value), dispatch);

    const handleResetFilters = useCallback(() => {
        dispatch({ type: "RESET_FILTERS" });
    }, [dispatch]);

    const filtersCount = Object.keys(filters)
        .map((x) => filters[x])
        .filter((x) => x).length;
    const arrayMeta = [];
    const productsListItems = productsList["data"].map((product, index) => {
        arrayMeta.push(<meta name="description" content={product.description} />);
        arrayMeta.push(<meta name="name" content={product.name} />);
        return (
            <div key={index} className="products-list__item">
                <ProductCard product={product} customer={customer} />
            </div>
        );
    });

    const rootClasses = classNames("products-view", {
        "products-view--loading": isLoading,
    });

    const viewOptionsClasses = classNames("view-options", {
        "view-options--offcanvas--always": offcanvas === "always",
        "view-options--offcanvas--mobile": offcanvas === "mobile",
    });

    let content;

    if (productsListItems.length > 0) {
        content = (
            <div className="products-view__content">
                {/*<div className="products-view__options">*/}
                {/*    <div className={viewOptionsClasses}>*/}
                {/*        <div className="view-options__filters-button">*/}
                {/*            <button type="button" className="filters-button" onClick={() => sidebarOpen()}>*/}
                {/*                <Filters16Svg className="filters-button__icon" />*/}
                {/*                <span className="filters-button__title">*/}
                {/*                    <FormattedMessage id="filters" defaultMessage="Filters" />*/}
                {/*                </span>*/}
                {/*                {!!filtersCount && <span className="filters-button__counter">{filtersCount}</span>}*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*        <div className="view-options__control">*/}
                {/*            <select*/}
                {/*                style={{*/}
                {/*                    backgroundImage: `url(${Arrow})`*/}
                {/*                }}*/}
                {/*                id="view-options-limit"*/}
                {/*                className="form-control categories-filter-input"*/}

                {/*                value={options.limit || 9}*/}
                {/*                onChange={handleLimitChange}*/}
                {/*            >*/}

                {/*                <FormattedMessage id="show" defaultMessage="Ցույց տալ">*/}
                {/*                    {(message) => <option value={'9'}>{message} 9</option>}*/}
                {/*                 </FormattedMessage>*/}
                {/*                 <FormattedMessage id="show" defaultMessage="Ցույց տալ">*/}
                {/*                    {(message) => <option value={'12'}>{message} 12</option>}*/}
                {/*                 </FormattedMessage>*/}
                {/*                 <FormattedMessage id="show" defaultMessage="Ցույց տալ">*/}
                {/*                    {(message) => <option value={'18'}>{message} 18</option>}*/}
                {/*                 </FormattedMessage>*/}
                {/*                 <FormattedMessage id="show" defaultMessage="Ցույց տալ">*/}
                {/*                    {(message) => <option value={'24'}>{message} 24</option>}*/}
                {/*                 </FormattedMessage>*/}

                {/*            </select>*/}

                {/*        </div>*/}
                {/*        <div className="view-options__divider" />*/}
                {/*        <div className="view-options__control">*/}
                {/*            <select*/}
                {/*                style={{*/}
                {/*                    backgroundImage: `url(${Arrow})`*/}
                {/*                }}*/}
                {/*                id="view-options-sort"*/}
                {/*                className="form-control categories-filter-input"*/}
                {/*                onChange={handleSortChange}*/}
                {/*            >*/}

                {/*                 <FormattedMessage id="sortBy" defaultMessage="Դասվորել ըստ">*/}
                {/*                    {(message) => <option value={''}>{message}</option>}*/}
                {/*                 </FormattedMessage>*/}

                {/*                 <FormattedMessage id="sortByNameAsc" defaultMessage="Դասվորել (Ա - Ֆ)">*/}
                {/*                    {(message) => <option value={'asc'}>{message}</option>}*/}
                {/*                 </FormattedMessage>*/}
                {/*                 <FormattedMessage id="sortByNameDesc" defaultMessage="Դասվորել (Ֆ - Ա)">*/}
                {/*                    {(message) => <option value={'desc'}>{message}</option>}*/}
                {/*                 </FormattedMessage>*/}

                {/*            </select>*/}

                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== "list" ? grid : layout}
                    data-with-features={layout === "grid-with-features" ? "true" : "false"}
                >
                    <div className="products-list__body">{productsListItems}</div>
                </div>

                {/*<div className="products-view__pagination">*/}
                {/*    <Pagination*/}
                {/*        current={productsList.current_page}*/}
                {/*        siblings={2}*/}
                {/*        total={Math.ceil(+productsList.total / 20)}*/}
                {/*        onPageChange={handlePageChange}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        );
    } else {
        content = (
            <div className="products-view__empty">
                <div className="products-view__empty-title">
                    <FormattedMessage id="no.matching.items" defaultMessage="No matching items" />{" "}
                </div>
                <div className="products-view__empty-subtitle">
                    <FormattedMessage id="resetting" defaultMessage="Try to reset filters" />
                </div>
                {productsList.data.length == 0 && Object.keys(filters).length == 0 ? null : (
                    <button type="button" className="btn btn-orange rounded-pill btn-sm" onClick={handleResetFilters}>
                        <FormattedMessage id="reset" defaultMessage="Reset" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <Helmet>{arrayMeta}</Helmet>
            <div className={rootClasses}>
                <div className="products-view__loader" />
                {content}
            </div>
        </>
    );
}

ProductsView.propTypes = {
    /**
     * Indicates that products is loading.
     */
    isLoading: PropTypes.bool,
    /**
     * ProductsList object.
     */
    productsList: PropTypes.array,
    /**
     * Products list options.
     */
    options: PropTypes.object,
    /**
     * Products list filters.
     */
    filters: PropTypes.object,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * products list layout (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    layout: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
    /**
     * products list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(["grid-3-sidebar", "grid-4-full", "grid-5-full"]),
    /**
     * indicates when sidebar should be off canvas
     */
    offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

ProductsView.defaultProps = {
    layout: "grid",
    grid: "grid-3-sidebar",
    offcanvas: "mobile",
};

const mapDispatchToProps = {
    sidebarOpen,
};

export default connect(() => ({}), mapDispatchToProps)(ProductsView);
