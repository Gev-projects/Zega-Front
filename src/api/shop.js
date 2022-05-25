/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from "query-string";
import { getCategoryBySlug } from "../fake-server/endpoints/categories";
import { url } from "../helper";
import {
    getDiscountedProducts,
    getLatestProducts,
    getPopularProducts,
    getTopRatedProducts,
} from "../fake-server/endpoints/products";

const shopApi = {
    /**
     * Returns array of categories.
     *
     * @param {object?} options
     * @param {number?} options.depth
     *
     * @return {Promise<Array<object>>}
     */
    getCategories: (options = {}) => {
        return fetch(`${url}/api/categories`).then((response) => response.json());
    },

    getBrands: (options = {}) => {
        return fetch(`${url}/api/attributes?code=brand&locale=${options.locale}`).then((response) => response.json());
    },

    geFilters: (options = {}, lang) => {
        if (options !== "all") {
            return fetch(`${url}/api//api/categories/${options}?locale=${lang}`).then((response) => response.json());
        } else {
            return fetch(`${url}/api/categories/all?locale=${lang}`).then((response) => response.json());
        }
    },
    /**
     * Returns category by slug.
     *
     * @param {string} slug
     * @param {object?} options
     * @param {number?} options.depth
     *
     * @return {Promise<object>}
     */
    getCategoryBySlug: (slug, options = {}) => {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/categories/power-tools.json?depth=2
         *
         * where:
         * - power-tools = slug
         * - 2           = options.depth
         */
        return fetch(`${url}/api/categories/slug/${slug}`).then((response) => response.json());

        // This is for demonstration purposes only. Remove it and use the code above.
        return getCategoryBySlug(slug, options);
    },
    /**
     * Returns product.
     *
     * @param {string} slug
     *
     * @return {Promise<object>}
     */
    getProductBySlug: (slug, options = {}) => {
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }
        return fetch(`${url}/api/product/${slug}`).then((response) => response.json());
    },
    /**
     * Returns array of related products.
     *
     * @param {string}  slug
     * @param {object?} options
     * @param {number?} options.limit
     *
     * @return {Promise<Array<object>>}
     */
    // getRelatedProducts: (slug, options = {}) => {
    //
    //
    //     let lang = 'hy';
    //     if (options.lang) {
    //
    //         lang = options.lang
    //     }
    //     return fetch(`${url}/api/relation?id=${slug}&locale=${lang}&relation=related_products`)
    //         .then((response) => response.json());
    //
    //
    // },

    getRelatedProducts: (categoryId, options = {}) => {
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }
        return fetch(`${url}/api/products?limit=8&category_id=${categoryId}&locale=${lang}`).then((response) =>
            response.json()
        );
    },
    /**
     * Return products list.
     *
     * @param {object?} options
     * @param {number?} options.page
     * @param {number?} options.limit
     * @param {string?} options.sort
     * @param {Object.<string, string>?} filters
     *
     * @return {Promise<object>}
     */

    getSeachProducts: (query, options = {}) => {
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }

        return (
            fetch(`${url}/api/products?search=${query}&locale=${lang}`)
                //     return fetch(`${url}/api/home/products?search=${query}&locale=${lang}`)
                .then((response) => response.json())
        );

        //.catch(err => console.error(err))
    },
    getProductsList: (options = {}, filters = {}, location, catID) => {
        const urlI = window.location.href;
        let cat = qs.parse(location);
        let catId, index;
        index = urlI.indexOf("page");

        if (cat.category_id && urlI.indexOf("category_id") > 0) catId = cat.category_id;

        for (let filter in filters) {
            if (filters[filter] == "") {
                delete filters[filter];
            }
        }
        if (options.savings == "") {
            delete options.savings;
        }

        const categoryId = catId || catID;
        if (qs.stringify(options) == "" && qs.stringify(filters) == "" && !location) {
            return fetch(`${url}/api/products?limit=20${categoryId ? `&category_id=${categoryId}` : ""}`).then(
                (responce) => responce.json()
            );
        } else {
            return fetch(
                `${url}/api/products?${index > 0 && options.page ? `page=${options.page}&` : ""}${
                    categoryId ? "category_id=" + categoryId : ""
                }${qs.stringify(filters) == "" ? "" : "&" + qs.stringify(filters) + "&"}limit=20`
            ).then((responce) => responce.json());
        }
    },
    /**
     * Returns array of featured products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */
    getFeaturedProducts: (options = {}) => {
        let lang = "en";
        let limit = 8;
        if (options.lang) {
            lang = options.lang;
        }

        return fetch(`${url}/api/products?featured=1&limit=${limit}&locale=${lang}`)
            .then((response) => response.json())
            .catch((err) => console.error(err));
    },
    /**
     * Returns array of latest products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */

    getCrossSaleProducts: (slug, options = {}) => {
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }
        return fetch(`${url}/api/relation?id=${slug}&locale=${lang}&relation=cross_sells`)
            .then((response) => response.json())
            .catch((err) => console.error(err));
    },

    getNewProducts: (options = {}) => {
        let id = "";
        let limit = 8;
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }

        if (options.limit) {
            limit = options.limit;
        }

        if (options.id) id = `category_id=${options.id}`;

        return fetch(`${url}/api/products?new=1&${id}&limit=${limit}`)
            .then((response) => response.json())
            .catch((err) => console.error(err));

        return getLatestProducts(options);
    },
    getLatestProducts: (options = {}) => {
        let id = "";
        let limit = 10;
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }

        if (options.limit) {
            limit = options.limit;
        }

        if (options.id) id = `category_id=${options.id}`;
        // return fetch(`${url}/api/products/232`)
        //     .then((response) => response.json()).catch(err => console.error(err))

        return (
            fetch(`${url}/api/products?${id}&limit=${limit}`)
                //     return fetch(`${url}/api/home/products?${id}&limit=${limit}`)
                .then((response) => response.json())
                .catch((err) => console.error(err))
        );
        // return fetch(`${url}/api/products?new=1&limit=${limit}&locale=${lang}`)
        //     .then((response) => response.json()).catch(err => console.error(err))

        // This is for demonstration purposes only. Remove it and use the code above.
        return getLatestProducts(options);
    },
    /**
     * Returns an array of top rated products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */
    getTopRatedProducts: (options = {}) => {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/top-rated-products.json?limit=3&category=power-tools
         *
         * where:
         * - 3           = options.limit
         * - power-tools = options.category
         */
        // return fetch(`https://example.com/api/top-rated-products.json?${qs.stringify(options)}`)
        //     .then((response) => response.json());

        // This is for demonstration purposes only. Remove it and use the code above.
        return getTopRatedProducts(options);
    },
    /**
     * Returns an array of discounted products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */
    getDiscountedProducts: (options = {}) => {
        /**
         * This is what your API endpoint might look like:
         * https://example.com/api/shop/discounted-products.json?limit=3&category=power-tools
         *
         * where:
         * - 3           = options.limit
         * - power-tools = options.category
         */
        // return fetch(`https://example.com/api/discounted-products.json?${qs.stringify(options)}`)
        //     .then((response) => response.json());

        // This is for demonstration purposes only. Remove it and use the code above.

        return getDiscountedProducts(options);
    },
    /**
     * Returns an array of most popular products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */
    getPopularProducts: (options = {}) => {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/popular-products.json?limit=3&category=power-tools
         *
         * where:
         * - 3           = options.limit
         * - power-tools = options.category
         */
        // return fetch(`https://example.com/api/popular-products.json?${qs.stringify(options)}`)
        //     .then((response) => response.json());

        //  .catch(error=>console.error(error));
        // This is for demonstration purposes only. Remove it and use the code above.
        return getPopularProducts(options);
    },
    /**
     * Returns search suggestions.
     *
     * @param {string}  query
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */
    getSuggestions: (query, options = {}) => {
        let lang = "en";
        if (options.lang) {
            lang = options.lang;
        }
        return fetch(`${url}/api/search?search=${query}&locale=${lang}`)
            .then((response) => response.json())
            .catch((err) => console.error(err));
    },
};

export default shopApi;
