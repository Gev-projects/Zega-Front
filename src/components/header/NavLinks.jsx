// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";

// application
import languages from "../../i18n";
import NavMenu from "./NavMenu";
import { ArrowRoundedDown9x6Svg } from "../../svg";
import { setMenuPagesList } from "../../store/mobile-menu/";

// data stubs
//import navLinks from '../../data/headerNavigation';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { url } from "../../helper";
import { FormattedMessage } from "react-intl";

function NavLinks(props) {
    const selectedData = useSelector((state) => state.locale);
    const [navLinks, SetNavLinks] = useState(null);
    let linksList = "";

    useEffect(() => {
        fetch(`${url}/api/cms/menus?locale=${selectedData}`)
            .then((response) => response.json())
            .then((res) => {
                // console.log(res);
                //props.setMenuPagesList(res.data);
                SetNavLinks(res.data.filter((item) => item.type == "header"));
            });
    }, []);

    const handleMouseEnter = (event) => {
        const { locale } = props;
        const { direction } = languages[locale];

        const item = event.currentTarget;
        const megamenu = item.querySelector(".nav-links__megamenu");
        const linksList = "";
        if (megamenu) {
            const container = megamenu.offsetParent;
            const containerWidth = container.getBoundingClientRect().width;
            const megamenuWidth = megamenu.getBoundingClientRect().width;
            const itemOffsetLeft = item.offsetLeft;

            if (direction === "rtl") {
                const itemPosition = containerWidth - (itemOffsetLeft + item.getBoundingClientRect().width);

                const megamenuPosition = Math.round(Math.min(itemPosition, containerWidth - megamenuWidth));

                megamenu.style.left = "";
                megamenu.style.right = `${megamenuPosition}px`;
            } else {
                const megamenuPosition = Math.round(Math.min(itemOffsetLeft, containerWidth - megamenuWidth));

                megamenu.style.right = "";
                megamenu.style.left = `${megamenuPosition}px`;
            }
        }
    };
    if (navLinks != undefined) {
        navLinks.sort(function (a, b) {
            var keyA = a.position,
                keyB = b.position;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }
    let sortedNavLinks = null;
    if (navLinks) {
        function start(array, i) {
            if (array[i]) {
                let item = array[i];
                if (item.parent_id) {
                    const find = array.find((e) => e.p_id == item.parent_id);
                    if (find) {
                        if (find.child && find.child[i] != undefined && item.id != find.child[i].id) {
                            find.child = [...find.child, item];
                        } else {
                            find.child = [item];
                        }
                        const newArray = array.filter((_, index) => index != i);
                        start(newArray, i);
                    } else {
                        // child
                        start(array, ++i);
                    }
                } else {
                    start(array, ++i);
                }
            } else {
                sortedNavLinks = array;
            }
        }

        start(navLinks, 0);
    }

    if (sortedNavLinks) {
        linksList = sortedNavLinks.map((item, index) => {
            let arrow;
            let submenu;
            // let pageUrl = item.pages.find((it) => {
            //     return it.locale === selectedData && item.page_id === it.cms_page_id;
            // });
            let pageUrl = item.url_key;
            if (item.child && item.child.length > 0) {
                arrow = <ArrowRoundedDown9x6Svg className="nav-links__arrow" />;
            }

            if (item.child && item.child.length > 0) {
                submenu = (
                    <div className="nav-links__menu">
                        <NavMenu items={item.child} />
                    </div>
                );
            }

            const classes = classNames("nav-links__item", {
                "nav-links__item--with-submenu": item.child,
            });

            const hello = (event, pageUrl) => {
                if (pageUrl.url_key === "help") {
                    event.preventDefault();
                }
            };

            const madePath = item.custom_url || item.url_key|| item.page_id;

            return (
                /**Chackoing if object has pageID  then url to pages/? else custom url **/
                <li key={index} className={classes} onMouseEnter={handleMouseEnter}>
                    <Link to={"/" + madePath}>
                        <span>
                            {/* {item.translations && item.translations.find((item) => item.locale === selectedData).name} */}
                            {item.name}
                            {arrow}
                        </span>
                    </Link>
                    {submenu}
                </li>
            );
        });
    }
    return (
        <ul className="nav-links__list">
            {linksList}
            <Link to="/Blog">
                <li className="nav-links__item">
                    <FormattedMessage id="menu-item-blog" defaultMessage="Blog" />
                </li>
            </Link>
        </ul>
    );
}

NavLinks.propTypes = {
    /** current locale */
    //  locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

const mapDispatchToState = (dispatch) => ({
    setMenuPagesList: (list) => dispatch(setMenuPagesList(list)),
});

export default connect(mapStateToProps, mapDispatchToState)(NavLinks);
