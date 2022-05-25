// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";

// application
import MobileLinks from "./MobileLinks";
import { Cross20Svg } from "../../svg";
import { currencyChange } from "../../store/currency";
import { localeChange } from "../../store/locale";
import { mobileMenuClose } from "../../store/mobile-menu";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";
// import { megaUrl } from "../../helper";

const lang = [
    {
        type: "button",
        label: <FormattedMessage id="languages" defaultMessage="Languages" />,
        children: [
            { type: "button", label: "English", data: { type: "language", locale: "en" } },
            { type: "button", label: "Russian", data: { type: "language", locale: "ru" } },
            { type: "button", label: "Հայերեն", data: { type: "language", locale: "hy" } },
        ],
    },
];

function MobileMenu(props) {
    const { mobileMenuState, closeMobileMenu, changeLocale } = props;

    const pages = <FormattedMessage id="pages" defaultMessage="Pages" />;
    const category = <FormattedMessage id="categoies" defaultMessage="Category" />;

    const classes = classNames("mobilemenu", {
        "mobilemenu--open": mobileMenuState.open,
    });

    const handleItemClick = (item) => {
        if (item.data) {
            if (item.data.type === "language") {
                changeLocale(item.data.locale);
                closeMobileMenu();
            }
        }
        if (item.type === "link") {
            closeMobileMenu();
        }
    };

    const [categories, setCatgoies] = useState();
    const [navLinks, SetNavLinks] = useState();

    useEffect(() => {
        fetch(`${url}/api/categories`)
            .then((response) => response.json())
            .then((res) => {
                setCatgoies([{ label: category, children: res.categories[0].children }]);
            });
    }, []);

    return (
        <div className={classes}>
            <div className="mobilemenu__backdrop" onClick={closeMobileMenu} />
            <div className="mobilemenu__body">
                <div className="mobilemenu__header">
                    <div className="mobilemenu__title">Menu</div>
                    <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="mobilemenu__content">
                    <MobileLinks links={categories} onItemClick={handleItemClick} />
                    {props.menuPagesList ? (
                        <MobileLinks
                            links={[{ label: pages, childs: props.menuPagesList }]}
                            onItemClick={handleItemClick}
                        />
                    ) : (
                        ""
                    )}
                    <MobileLinks links={lang} onItemClick={handleItemClick} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    mobileMenuState: state.mobileMenu,
    menuPagesList: state.mobileMenu.mobileMenuList,
});

const mapDispatchToProps = {
    closeMobileMenu: mobileMenuClose,
    changeLocale: localeChange,
    changeCurrency: currencyChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);
