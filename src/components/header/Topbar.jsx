// react
import React from "react";

// third-party
import { FormattedMessage } from "react-intl";
import DropdownLanguage from "./DropdownLanguage";

function Topbar() {
    const links = [{ title: <FormattedMessage id="header.phone" defaultMessage="(000) 00 00-00-00" />, url: "" }];

    const linksList = links.map((item, index) => (
        <div key={index} className="topbar__item topbar__item--link">
            <a href={`tel:${item.title.props.defaultMessage}`}>{item.title}</a>
        </div>
    ));

    return (
        <div className="site-header__topbar topbar">
            <div className="topbar__container container">
                <div className="topbar__row">
                    {linksList}
                    {/*<div className="topbar__spring" />*/}
                    <div className="topbar__item language-adjust">
                        <DropdownLanguage />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
