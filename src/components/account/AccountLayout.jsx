// react
import React from "react";

// third-party
import classNames from "classnames";
import { Link, matchPath, Redirect, Switch, Route } from "react-router-dom";

// application
import PageHeader from "../shared/PageHeader";

// pages
import AccountPageAddresses from "./AccountPageAddresses";
import AccountPageDashboard from "./AccountPageDashboard";
import AccountPageEditAddress from "./AccountPageEditAddress";
import AccountPageOrderDetails from "./AccountPageOrderDetails";
import AccountPageOrders from "./AccountPageOrders";
import AccountPageProfile from "./AccountPageProfile";
import AccountPageNewAddresses from "./AccountPageNewAddresses";
import { FormattedMessage } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { url } from "../../helper";
import { Account, History, Location, LogOut } from "../../svg";

export default function AccountLayout(props) {
    const customer = useSelector((state) => state.customer);
    const dispatch = useDispatch();
    const { match, location } = props;
    const history = useHistory();
    const logout = (e) => {
        e.preventDefault();
        dispatch({ type: "AUTHENTICATED", payload: false });
        dispatch({ type: "CUSTOMER_TOKEN", payload: "" });

        fetch(`${url}/api/customer/logout?token=${customer.token}`).catch((error) =>
            alert("Server Error , contact with administrator" + error)
        );
        history.push("/");
    };
    const breadcrumb = [
        { title: <FormattedMessage id="menu.home" defaultMessage="Home" />, url: "" },
        { title: <FormattedMessage id="topbar.myAccount" defaultMessage="My account" />, url: "" },
    ];

    const accountIcon = <Account className="d-inline mr-3" />;
    const historyIcon = <History className="d-inline mr-3" />;
    const locationIcon = <Location className="d-inline mr-3" />;
    const exitIcon = <LogOut className="d-inline mr-3" />;

    const links = [
        {
            title: <FormattedMessage id="account.personalInformation" defaultMessage="Personal information" />,
            url: "profile",
            icon: accountIcon,
        },
        {
            title: <FormattedMessage id="account-my-orders" defaultMessage="My orders" />,
            url: "orders",
            icon: historyIcon,
        },
        {
            title: <FormattedMessage id="account.addresses" defaultMessage="Address" />,
            url: "addresses",
            icon: locationIcon,
        },
        { title: <FormattedMessage id="account.logout" defaultMessage="Exit" />, url: "logout", icon: exitIcon },
    ].map((link) => {
        const url = `${match.url}/${link.url}`;
        const isActive = matchPath(location.pathname, { path: url, exact: true });

        const classes = classNames("account-nav__item", {
            "account-nav__item--active": isActive,
        });

        return (
            <li key={link.url} className={classes}>
                {link.url === "logout" ? (
                    <a href="/account/logout" onClick={logout}>
                        {exitIcon}
                        <FormattedMessage id="account-logout" defaultMessage="Log out" />
                    </a>
                ) : (
                    <Link to={url}>
                        {link.icon}
                        {link.title}
                    </Link>
                )}
            </li>
        );
    });

    return (
        <React.Fragment>
            <PageHeader header={breadcrumb[1].title} breadcrumb={breadcrumb} />
            <h4 className="account-nav__title">
                <FormattedMessage id="account-title" defaultMessage="My Account" />
            </h4>
            <div className="block">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 d-flex mb-2">
                            <div className="account-nav flex-grow-1 mb-4">
                                <ul>
                                    <div className="account-links-body">{links}</div>
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-lg-9 mt-4 mt-lg-0">
                            <Switch>
                                <Redirect exact from={match.path} to={`${match.path}/profile`} />
                                <Route exact path={`${match.path}/dashboard`} component={AccountPageDashboard} />
                                <Route exact path={`${match.path}/profile`} component={AccountPageProfile} />
                                <Route exact path={`${match.path}/orders`} component={AccountPageOrders} />
                                <Route
                                    exact
                                    path={`${match.path}/orders/:orderId`}
                                    render={(props) => <AccountPageOrderDetails id={props.match.params} />}
                                />
                                <Route exact path={`${match.path}/addresses`} component={AccountPageAddresses} />
                                <Route exact path={`${match.path}/addresses/new`} component={AccountPageNewAddresses} />
                                <Route
                                    exact
                                    path={`${match.path}/addresses/:addressId`}
                                    render={(props) => <AccountPageEditAddress id={props.match.params} />}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
