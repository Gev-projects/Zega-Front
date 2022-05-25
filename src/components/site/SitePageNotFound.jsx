// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FormattedMessage } from "react-intl";

// data stubs
import theme from '../../data/theme';

function SitePageNotFound() {
    return (
        <div className="block">
            <Helmet>
                <title>{`404 Page Not Found — ${theme.name}`}</title>
            </Helmet>

            <div className="container">
                <div className="not-found">
                <div className="container-not-found__404">
                    <div className="not-found__404">
                        <FormattedMessage id="err-404" defaultMessage="404" />
                    </div>

                    <div className="not-found__content">
                        <h1 className="not-found__title">
                            <FormattedMessage id="not-found" defaultMessage="Oops! Page Not Found" />
                        </h1>

                        <p className="not-found__text">
        
                            <FormattedMessage id="try-use-seach" defaultMessage="Sorry, but the page you're looking for isn't available. 
Try to search again or use the Go Back button below." />
                        </p>

                        {/* <form className="not-found__search">
                            <input type="text" className="not-found__search-input form-control f16" placeholder="Search Query..." />
                            <button type="submit" className="not-found__search-button btn btn-primary f16">
                                <FormattedMessage id="search-query" defaultMessage="Search" />
                            </button>
                        </form>

                        <p className="not-found__text">
                            <FormattedMessage id="start-over" defaultMessage="Or go to the home page to start over." />
                        </p> */}

                        <Link to="/" className="go-home-page-404">
                            <FormattedMessage id="go-home-page" defaultMessage="Back to homepage" />
                        </Link>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default SitePageNotFound;
