// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'

// application
import AppLink from '../shared/AppLink';
import Collapse from '../shared/Collapse';
import { ArrowRoundedDown12x7Svg } from '../../svg';

function MobileLinks(props) {
    const { links, level, onItemClick } = props;
    const selectedData = useSelector(state => state.locale)
    const handleItemClick = (item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };

    // if (links && links[0] && links[0].label && links[0].label.props && links[0].label.props.id === 'categoies') {
    //     return null
    // }

    const linksList = links.map((link, index) => {
        let item;
        item = (
            <Collapse
                toggleClass="mobile-links__item--open"
                render={({ toggle, setItemRef, setContentRef }) => {
                    let arrow;
                    let subLinks;
                    let linkOrButton;
                    link.type = 'link';

                    if (link.childs && link.childs.length > 0) {
                        arrow = (
                            <button className="mobile-links__item-toggle" type="button" onClick={toggle}>
                                <ArrowRoundedDown12x7Svg className="mobile-links__item-arrow" />
                            </button>
                        );

                        subLinks = (
                            <div className="mobile-links__item-sub-links" ref={setContentRef}>
                                <MobileLinks
                                    links={link.childs}
                                    level={level + 1}
                                    onItemClick={onItemClick}
                                />
                            </div>
                        );


                    } else if (link.children && link.children.length > 0) {

                        arrow = (
                            <button className="mobile-links__item-toggle" type="button" onClick={toggle}>
                                <ArrowRoundedDown12x7Svg className="mobile-links__item-arrow" />
                            </button>
                        );

                        subLinks = (
                            <div className="mobile-links__item-sub-links" ref={setContentRef}>
                                <MobileLinks
                                    links={link.children}
                                    level={level + 1}
                                    onItemClick={onItemClick}
                                />
                            </div>
                        );
                    }

                    if (link.type === 'button') {
                        linkOrButton = (
                            <button
                                type="button"
                                className="mobile-links__item-link"
                                onClick={() => handleItemClick(link)}
                            >
                                {/* {link.translations.find(item => item.locale === selectedData).name} */}
                                {link.name}
                            </button>
                        );
                    } else {
                        linkOrButton = (
                            <>
                                <AppLink
                                    to={index === 0 ? '/catalog' : '/catalog/' + link.slug}
                                    className="mobile-links__item-link"
                                    onClick={() => handleItemClick(link)}
                                >
                                    {link.label || link.name}
                                </AppLink>
                            </>
                        )
                    }


                    return (
                        <div className="mobile-links__item" ref={setItemRef}>
                            <div className="mobile-links__item-title">
                                {linkOrButton}
                                {arrow}
                            </div>
                            {subLinks}
                        </div>
                    );
                }}
            />
        );


        return <li key={index}>{item}</li>;
    });

    return (
        <ul className={`mobile-links mobile-links--level--${level}`}>
            {linksList}
        </ul>
    );
}

MobileLinks.propTypes = {
    links: PropTypes.array,
    level: PropTypes.number,
    onItemClick: PropTypes.func,
};

MobileLinks.defaultProps = {
    links: [],
    level: 0,
};

export default MobileLinks;
