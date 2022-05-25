// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import AppLink from '../shared/AppLink';
import { ArrowRoundedRight6x9Svg } from '../../svg';

import { useSelector } from 'react-redux'

function NavMenu(props) {
    const {
        layout,
        withIcons,
        items,
        onClick,
    } = props;
    const selectedData = useSelector(state => state.locale)
    let url;
    const renderLink = (item, content) => {
        let link;

        if (item.slug) {
            link = (
                <AppLink
                    {...item.props}
                    to={'/catalog/' + item.slug}
                    onClick={() => onClick(item)}
                >
                    {content}
                </AppLink>
            );
        } else {



            if (item['custom-url'] !== null) {
                link = (<a href={item['custom-url']} type="button" >{content}</a>);

            } else {

                link = (

                    <AppLink
                        {...item.props}
                        to={'/page/' + item.pages.find(it => {

                            return it.locale === selectedData && item.page_id === it.cms_page_id

                        }).url_key}
                        onClick={() => onClick(item)}
                    >
                        {content}
                    </AppLink>
                );
            }

        }

        return link;
    };

    const itemsList = items.map((item, index) => {
        let arrow;
        let submenu;
        let icon;

        if (item.child && item.child.length) {
            arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
        }

        if (item.child && item.child.length) {
            submenu = (
                <div className="menu__submenu">
                    <NavMenu items={item.child} />
                </div>
            );
        }
        if (withIcons && item.icon) {
            icon = (
                <div className="menu__icon">
                    <img src={item.icon} srcSet={item.icon_srcset} alt="" />
                </div>
            );
        }
        return (
            <li key={index}>
                {renderLink(item, (
                    <React.Fragment>
                        {icon}
                        {/* {item.translations && item.translations.find(item => item.locale === selectedData).name} */}
                        {item.name}
                        {arrow}
                    </React.Fragment>
                ))}
                {submenu}
            </li>
        );
    });

    const classes = classNames(`menu menu--layout--${layout}`, {
        'menu--with-icons': withIcons,
    });

    return (
        <ul className={classes}>
            {itemsList}
        </ul>
    );
}

NavMenu.propTypes = {
    /** one of ['classic', 'topbar'] (default: 'classic') */
    layout: PropTypes.oneOf(['classic', 'topbar']),
    /** default: false */
    withIcons: PropTypes.bool,
    /** array of menu items */
    items: PropTypes.array,
    /** callback function that is called when the item is clicked */
    onClick: PropTypes.func,
};

NavMenu.defaultProps = {
    layout: 'classic',
    withIcons: false,
    items: [],
    onClick: () => { },
};

export default NavMenu;
