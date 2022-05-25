// react
import React, { Component } from "react";

// third-party
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { ScrollContext } from "react-router-scroll-4";
import { setLanguages } from "../store/general";

// application
//import languages from '../i18n';
import { localeChange } from "../store/locale";
import { setBOrder } from "../store/general";

// pages
import Layout from "./Layout";
import HomePageOne from "./home/HomePageOne";
import { megaUrl, url } from "../helper";
import ReactPixel from "react-facebook-pixel";

const direction = "ltr";

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translations: "",
            code: "",
            language: null,
        };
    }

    componentDidMount() {
        fetch(`${url}/api/custom-settings`)
            .then((response) => response.json())
            .then((res) => {
                const advancedMatching = { em: "some@email.com" }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
                const options = {
                    autoConfig: false, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
                    debug: false, // enable logs
                };
                this.props.setBOrder(res.Backorders);
                // '694630397893097'
                ReactPixel.init(res.facebook_pixel_id, advancedMatching, options);
                ReactPixel.pageView();
            });

        fetch(`${url}/api/translations`)
            .then((res) => res.json())
            .then((resp) => {
                this.setState({ translations: resp });
            });

        fetch(`${url}/api/languages`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((res) => {
                this.props.setLanguages(res);
            });

        setTimeout(() => {
            const preloader = document.querySelector(".site-preloader");

            preloader.addEventListener("transitionend", (event) => {
                if (event.propertyName === "opacity") {
                    preloader.parentNode.removeChild(preloader);
                }
            });
            preloader.classList.add("site-preloader__fade");
        }, 500);
    }

    shouldUpdateScroll = (prevRouterProps, { location }) =>
        prevRouterProps && location.pathname !== prevRouterProps.location.pathname;

    render() {
        if (!this.state.translations) {
            return true;
        }
        const { languages } = this.props;
        // locale: anotherLocale,
        if (!languages) {
            return null
        }
        let locale = languages[0].code;

        const { translations } = this.state.translations[locale];

        return (
            <IntlProvider locale={locale} messages={translations}>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <HelmetProvider>
                        <Helmet htmlAttributes={{ lang: locale, dir: direction }} />
                        <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                            <Switch>
                                <Route
                                    path="/"
                                    render={(props) => (
                                        <Layout {...props} headerLayout="default" homeComponent={HomePageOne} />
                                    )}
                                />
                            </Switch>
                        </ScrollContext>
                    </HelmetProvider>
                </BrowserRouter>
            </IntlProvider>
        );
    }
}

Root.propTypes = {
    /** current locale */
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
    bOrder: state.bOrder,
    languages: state.general.languages,
});

const mapDispatchToProps = (dispatch) => ({
    localeChange: () => dispatch(localeChange()),
    setBOrder: () => dispatch(setBOrder()),
    setLanguages: (object) => dispatch(setLanguages(object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
