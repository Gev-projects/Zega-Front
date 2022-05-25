// react
import React, { useEffect, useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// application
import Footer from "./footer";
import Header from "./header";
import MobileHeader from "./mobile/MobileHeader";
import MobileMenu from "./mobile/MobileMenu";

// pages
import AccountLayout from "./account/AccountLayout";
import AccountPageLogin from "./account/AccountPageLogin";
import AccountForgotPassword from "./account/AccountForgotPassword";
import BlogPageCategory from "./blog/BlogPageCategory";
import BlogPagePost from "./blog/BlogPagePost";
import PageCart from "./shop/ShopPageCart";
import PageCheckout from "./shop/ShopPageCheckout";
import PageWishlist from "./shop/ShopPageWishlist";
import ShopPageCategory from "./shop/ShopPageCategory";
import ShopPageOrderSuccess from "./shop/ShopPageOrderSuccess";
import ShopPageProduct from "./shop/ShopPageProduct";

import SitePageNotFound from "./site/SitePageNotFound";
import SearchedProducts from "./shop/SearchedProducts";

import SiteCustomPage from "./site/SiteCustomPage";
import ThankPage from "./site/ThankPage";
// import { setLanguages } from "../store/general";

import { connect, useSelector, useDispatch } from "react-redux";
import { url } from "../../src/helper";
// data stubs
import theme from "../data/theme";
import jwt_decode from "jwt-decode";
import ReactGA, { set } from "react-ga";
import scriptsfm from 'script-tags';

function Layout(props) {
    const { match, headerLayout, homeComponent } = props;
    const customer = useSelector((state) => state.customer);
    const cartToken = useSelector((state) => state.cartToken);
    const dispatch = useDispatch();
    const [jsCode, setjsCode] = useState();
    const [googleCode, setGoogleCode] = useState("");

    useEffect(() => {
        // fetch(`${url}/api/languages`, {
        //     method: "GET",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then(response => response.json())
        //     .then(res => {
        //         props.setLanguages(res)
        //     })

        fetch(`${url}/api/custom/js`)
            .then(response => response.text())
            .then(res => {
                const jsCode = scriptsfm(res)
                if(jsCode){
                    jsCode.forEach((element) => {
                        const { attrs, text } = element;
                        const scriptTag = document.createElement('script')
                        const attrKeys = Object.keys(attrs);
                         
                        for(let i = 0;i < attrKeys.length; i++) {
                            scriptTag.setAttribute(attrKeys[i], attrs[attrKeys[i]]);
                        }
                        if(text) {
                            scriptTag.innerText = text;
                        }
                        document.body.appendChild(scriptTag)
                    });
                }
            })
    }, [googleCode]);

   
    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;

        if (cartToken.cartToken === "") {
            fetch(url + "/api/checkout/cart/token", { single: single })
                .then((responce) => responce.json())
                .then((res) => {
                    if (res.api_token) {
                        dispatch({ type: "CART_TOKEN", payload: res.api_token });
                    }
                })
                .catch((err) => console.error(err));
        }
        return function cleaup() {
            abortController.abort();
        };
    }, [cartToken.cartToken === ""]);

    useEffect(() => {
        const abortController = new AbortController();
        const single = abortController.single;

        if (customer.token) {
            const { exp } = jwt_decode(customer.token);

            if (Date.now() >= exp * 1000) {
                dispatch({ type: "AUTHENTICATED", payload: false });
                dispatch({ type: "CUSTOMER_TOKEN", payload: "" });
            }
        }

        return function cleaup() {
            abortController.abort();
        };
    }, [customer.token]);

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name}</title>
                <meta name="description" content={theme.fullName} data-react-helmet={true} />
            </Helmet>

            <ToastContainer autoClose={3000} />

            <MobileMenu />

            <div className="site">
                <header className="site__header d-lg-none">
                    <MobileHeader />
                </header>

                <header className="site__header d-lg-block d-none">
                    <Header layout={headerLayout} />
                </header>

                <div className="site__body">
                    <Switch>
                        {/*
                        // Home
                        */}
                        <Route exact path={`${match.path}`} component={homeComponent} />

                        {/*
                        // Shop
                        */}
                        <Redirect exact from="/shop" to="/catalog" />
                        <Route
                            exact
                            path="/catalog"
                            render={(props) => (
                                <ShopPageCategory {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/catalog/:categorySlug"
                            render={(props) => (
                                <ShopPageCategory
                                    {...props}
                                    columns={3}
                                    viewMode="grid"
                                    sidebarPosition="start"
                                    categorySlug={props.match.params.categorySlug}
                                    // catID={props.match.params.catID}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/products/:productSlug"
                            render={(props) => (
                                <ShopPageProduct
                                    {...props}
                                    layout="standard"
                                    productSlug={props.match.params.productSlug}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/catalog/search/:searchedItem"
                            render={(props) => (
                                <SearchedProducts {...props} searchedItem={props.match.params.searchedItem} />
                            )}
                        />

                        <Route exact path="/shop/cart" component={PageCart} />
                        <Route exact path="/shop/checkout" component={PageCheckout} />
                        <Route exact path="/shop/checkout/success" component={ShopPageOrderSuccess} />
                        <Route exact path="/shop/wishlist" component={PageWishlist} />
                        {/* <Route exact path="/shop/compare" component={PageCompare} /> */}
                        <Route
                            exact
                            path="/blog"
                            render={(props) => <BlogPageCategory {...props} layout="grid" sidebarPosition="end" />}
                        />

                        <Route
                            exact
                            path="/blog/:blogID"
                            render={(props) => (
                                <BlogPagePost
                                    id={props.match.params}
                                    {...props}
                                    layout="classic"
                                    sidebarPosition="end"
                                />
                            )}
                        />

                        {/*
                        // Account
                        */}
                        {!customer.authenticated && !customer.token ? (
                            <Route exact path="/account/login" component={AccountPageLogin} />
                        ) : (
                            <Route path="/account" component={AccountLayout} />
                        )}
                        {/*
                        // Site
                        */}
                        <Route exact path="/forgot/password" component={AccountForgotPassword} />
                        <Route
                            exact
                            path="/:pageSlug"
                            render={(props) => <SiteCustomPage {...props} id={props.match.params} />}
                        />
                        {/* <Redirect exact from="/site" to="/site/about-us" />
                        <Route exact path="/site/about-us" component={SitePageAboutUs} />
                        <Route exact path="/site/components" component={SitePageComponents} />
                        <Route exact path="/site/contact-us" component={SitePageContactUs} />
                        <Route exact path="/site/contact-us-alt" component={SitePageContactUsAlt} />
                        <Route exact path="/site/not-found" component={SitePageNotFound} />
                        <Route exact path="/site/faq" component={SitePageFaq} />
                        <Route exact path="/site/terms" component={SitePageTerms} />
                        <Route exact path="/site/typography" component={SitePageTypography} /> */}
                        <Route path="/thanks" {...props} component={ThankPage} />
                        {/*
                        // Page Not Found
                        */}
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>
        </React.Fragment>
    );
}

Layout.propTypes = {
    /**
     * header layout (default: 'classic')
     * one of ['classic', 'compact']
     */
    headerLayout: PropTypes.oneOf(["default", "compact"]),
    /**
     * home component
     */
    homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
    headerLayout: "default",
};

// const mapDispatchToProps = (dispatch) => ({
//     setLanguages: (object) => dispatch(setLanguages(object))
// })
// export default connect(false, mapDispatchToProps)(Layout);

export default Layout;
