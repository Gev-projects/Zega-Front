// react
import React, { useEffect, useReducer, useState } from "react";

// third-party
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import Collapse from "../shared/Collapse";
import FilterCheck from "../filters/FilterCheck";

// application
import BlockLoader from "../blocks/BlockLoader";
import CategorySidebar from "./CategorySidebar";
import CategorySidebarItem from "./CategorySidebarItem";
import PageHeader from "../shared/PageHeader";
import ProductsView from "./ProductsView";
import shopApi from "../../api/shop";
import WidgetFilters from "../widgets/WidgetFilters";
import WidgetProducts from "../widgets/WidgetProducts";
import WidgetCategories from "../widgets/WidgetCategories";
import { sidebarClose } from "../../store/sidebar";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Check9x7Svg } from "../../svg";

// data stubs
import theme from "../../data/theme";
import { url, getCategoryParents } from "../../services/utils";
function parseQueryOptions(location) {
    const query = queryString.parse(location);
    const optionValues = {};

    if (typeof query.brand === "string") {
        optionValues.brand = query.brand;
    }

    if (typeof query.savings === "string") {
        optionValues.savings = query.savings;
    }
    if (typeof query.category_id === "string") {
        optionValues.category_id =
            typeof query.category_id === "number" ? parseInt(query.category_id) : query.category_id;
    }
    if (typeof query.search === "string") {
        optionValues.search = query.search;
    }

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }
    if (typeof query.limit === "string") {
        optionValues.limit = parseFloat(query.limit);
    }
    if (typeof query.sort === "string") {
        optionValues.sort = query.sort;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.savings !== "") {
        params.savings = options.savings;
    }
    if (options.brand !== "") {
        params.brand = options.brand;
    }

    if (options.search !== "") {
        params.search = options.search;
    }
    params.category_id = options.category_id;
    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.limit !== 12) {
        params.limit = options.limit;
    }

    if (options.sort !== "default") {
        params.sort = options.sort;
    }

    Object.keys(filters)
        .filter((x) => x !== "category" && !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

const initialState = {
    init: false,
    /**
     * Indicates that the category is loading.
     */
    categoryIsLoading: true,
    /**
     * Category object.
     */
    category: null,
    /**
     * Indicates that the products list is loading.
     */
    productsListIsLoading: true,
    /**
     * Products list.
     */
    productsList: null,
    /**
     * Products list options.
     *
     * options.page:  number - Current page.
     * options.limit: number - Items per page.
     * options.sort:  string - Sort algorithm.
     */
    options: {},
    /**
     * Products list filters.
     *
     * filters[FILTER_SLUG]: string - filter value.
     */
    filters: {},
};

export function reducer(state, action) {
    switch (action.type) {
        case "FETCH_CATEGORY_SUCCESS":
            return {
                ...state,
                init: true,
                categoryIsLoading: false,
                category: action.category,
            };
        case "FETCH_PRODUCTS_LIST":
            return { ...state, productsListIsLoading: true };
        case "FETCH_PRODUCTS_LIST_SUCCESS":
            return { ...state, productsListIsLoading: false, productsList: action.productsList };
        case "SET_OPTION_VALUE":
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };
        case "SET_FILTER_VALUE":
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: {
                    ...state.filters,
                    [action.filter]:
                        state.filters[action.filter] && action.filter !== "price"
                            ? state.filters[action.filter] + (action.value ? "," + action.value : "")
                            : action.value,
                },
            };

        case "REMOVE_FILTER_VALUE":
            let dot = state.filters[action.filter].split(",");
            const index = dot.indexOf(action.value);
            if (index > -1) {
                dot.splice(index, 1);
            }
            dot = dot.join(",");

            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: dot },
            };

        case "RESET_FILTERS":
            return { ...state, options: {}, filters: {} };
        case "RESET":
            return state.init ? initialState : state;
        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

function ShopPageCategory(props) {
    const { categorySlug, columns, viewMode, sidebarPosition } = props;

    const offcanvas = columns === 3 ? "mobile" : "always";
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const location = useLocation();
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [catID, setCatID] = useState();
    const [title, setTitle] = useState();

    const locale = useSelector((state) => state.locale);

    useEffect(() => {
        let canceled = false;
        shopApi.getCategories({ locale: locale }).then((categories) => {
            if (canceled) {
                return;
            }
            if (categories.categories) {
                console.log(categories.categories);

                categories.categories[0].children.filter((e) => {
                    if (e.slug === categorySlug) {
                        setCatID(e.id);
                        setTitle(e.name);
                        return false;
                    } else {
                        if (e.children.length) {
                            e.children.filter((elem) => {
                                if (elem.slug === categorySlug) {
                                    setCatID(elem.id);
                                    setTitle(elem.name);
                                    return false;
                                }
                            });
                        }
                    }
                });
            }
            setCategories(categories.categories);
        });

        return () => {
            canceled = true;
        };
    }, [categorySlug, setCategories]);

    useEffect(() => {
        if (categorySlug && catID) {
            dispatch({ type: "RESET_FILTERS" });
            shopApi.getRelatedProducts(catID, { lang: "en" }, { limit: 8 }).then((data) => {
                setBrands(data.filter);
            });
        }
    }, [categorySlug, catID]);

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);
        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [categorySlug, state.options, state.filters]);

    // Load products.
    useEffect(() => {
        dispatch({ type: "FETCH_PRODUCTS_LIST" });
        if (catID) {
            shopApi
                .getProductsList(state.options, { ...state.filters }, location.search, catID)
                .then((productsList) => {
                    dispatch({ type: "FETCH_PRODUCTS_LIST_SUCCESS", productsList });
                });
        }
    }, [location.search, state.options, state.filters, catID]);

    if (state.productsListIsLoading && !state.productsList) {
        return <BlockLoader />;
    }

    const breadcrumb = [
        { title: "Home", url: url.home() },
        { title: "Shop", url: url.catalog() },
    ];
    let pageTitle = "Shop";
    let content;

    const setSavings = (e, type) => {
        e.preventDefault();
        let inp = document.getElementById("savings_fm_id");
        if (type == 0) {
            if (inp.checked === true)
                dispatch({
                    type: "SET_OPTION_VALUE",
                    option: "savings",
                    value: "",
                });
            else
                dispatch({
                    type: "SET_OPTION_VALUE",
                    option: "savings",
                    value: "true",
                });
        } else {
            if (inp.checked === false)
                dispatch({
                    type: "SET_OPTION_VALUE",
                    option: "savings",
                    value: "",
                });
            else
                dispatch({
                    type: "SET_OPTION_VALUE",
                    option: "savings",
                    value: "true",
                });
        }
    };

    const productsView = (
        <ProductsView
            catID={catID}
            categorySlug={categorySlug}
            isLoading={state.productsListIsLoading}
            productsList={state.productsList}
            options={state.options}
            filters={state.filters}
            dispatch={dispatch}
            layout={viewMode}
            grid={`grid-${columns}-${columns > 3 ? "full" : "sidebar"}`}
            offcanvas={offcanvas}
        />
    );

    const sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                {/* <WidgetCategories
                    dispatch={dispatch}
                    categories={categories}
                    catID={queryString.parse(location.search).category_id || state.options.category_id}
                /> */}

                <div className={`widget-categories widget-categories--location--${location} widget`}>
                    <div className="savings_fms">
                        <label className="m-0 mr-2" style={{ color: "inherit" }} onClick={(e) => setSavings(e, 0)}>
                            <h4
                                style={{
                                    color: "inherit",
                                }}
                                className="widget__title"
                            >
                                <FormattedMessage id="filter-sale" defaultMessage="Sale" />
                            </h4>
                        </label>
                        <input
                            type="checkbox"
                            id="savings_fm_id"
                            // id="input-check__input"
                            checked={state.options.savings ? true : false}
                            onClick={(e) => setSavings(e, 1)}
                        />
                    </div>
                    {/*</div>*/}
                    {brands.length > 0 ? (
                        <WidgetFilters
                            filters={brands}
                            dispatch={dispatch}
                            stateFilters={state}
                            values={state.filters}
                            catID={catID}
                            maxPrice={state.productsList.max_price || 1000}
                        />
                    ) : (
                        ""
                    )}{" "}
                    {console.log(brands, "pa")}
                </div>
            </CategorySidebarItem>
        </CategorySidebar>
    );

    if (columns > 3) {
        content = (
            <div className="container_fm">
                <div className="block">{productsView}</div>
                {sidebarComponent}
            </div>
        );
    } else {
        const sidebar = <div className="shop-layout__sidebar">{sidebarComponent}</div>;

        content = (
            <div className="container_fm category-container">
                <div className="category-title">
                    <h1>
                        <FormattedMessage
                            id={categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}
                            defaultMessage={title}
                        />
                    </h1>
                </div>

                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {brands.length > 0 ? sidebarPosition === "start" && sidebar : " "}
                    <div className="shop-layout__content">
                        <div className="block block-fms">{productsView}</div>
                    </div>
                    {sidebarPosition === "end" && sidebar}
                </div>
            </div>
        );
    }

    const change = () => {
        return 456;
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Shop Category Page — ${categorySlug}`}</title>
                <meta name="keywords" content={`Catalog, ${categorySlug}`} />
                <meta name="description" content={`Marketin, Catalog ${categorySlug}`} />
                <meta property="og:title" content="Marketin" />
                <meta property="og:description" content="Marketin" />
                <meta property="og:image" content="Marketin" />
                <meta property="og:url" content={url + "/catalog/" + categorySlug} />
            </Helmet>
            <div className="cat_blocks_fms">
                <PageHeader header={pageTitle} breadcrumb={breadcrumb} />

                {content}
            </div>
        </React.Fragment>
    );
}

ShopPageCategory.propTypes = {
    /**
     * Category slug.
     */

    categorySlug: PropTypes.string,
    /**
     * number of product columns (default: 3)
     */
    columns: PropTypes.number,
    /**
     * mode of viewing the list of products (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    viewMode: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageCategory.defaultProps = {
    columns: 3,
    viewMode: "grid",
    sidebarPosition: "start",
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
    page: state.category,
});

const mapDispatchToProps = () => ({
    sidebarClose,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);
