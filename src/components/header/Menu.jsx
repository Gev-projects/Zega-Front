// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import AppLink from "../shared/AppLink";
import { ArrowRoundedRight6x9Svg } from "../../svg";

import { useSelector } from "react-redux";

function Menu(props) {
    const { layout, withIcons, items, onClick } = props;

    const selectedData = useSelector((state) => state.locale);
    const renderLink = (item, content) => {
        let link;
        if (item.slug) {
            link = (
                <AppLink {...item.props} to={`/catalog/${item.slug}`} onClick={() => onClick(item)}>
                    {content}
                </AppLink>
            );
        } else {
            link = (
                <button type="button" onClick={() => onClick(item)}>
                    {content}
                </button>
            );
        }

        return link;
    };
    const itemsList = items.map((item, index) => {
        let arrow;
        let submenu;
        let icon;

        if (item.children && item.children.length) {
            arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
        }

        if (item.children && item.children.length) {
            submenu = (
                <div className="menu__submenu">
                    <Menu items={item.children} onClick={onClick} />
                </div>
            );
        }

        if (withIcons && item.icon) {
            icon = (
                <div className="menu__icon">
                    <img src={item.icon} alt="" />
                </div>
            );
        }

        return (
            <li key={index}>
                {renderLink(
                    item,
                    <React.Fragment>
                        {icon}
                        {item.title || item.name}
                        {arrow}
                    </React.Fragment>
                )}
                {submenu}
            </li>
        );
    });

    const classes = classNames(`menu menu--layout--${layout}`, {
        "menu--with-icons": withIcons,
    });

    return <ul className={classes}>{itemsList}</ul>;
}

Menu.propTypes = {
    /** one of ['classic', 'topbar'] (default: 'classic') */
    layout: PropTypes.oneOf(["classic", "topbar"]),
    /** default: false */
    withIcons: PropTypes.bool,
    /** array of menu items */
    items: PropTypes.array,
    /** callback function that is called when the item is clicked */
    onClick: PropTypes.func,
};

Menu.defaultProps = {
    layout: "classic",
    withIcons: false,
    items: [],
    onClick: () => {},
};

export default Menu;
