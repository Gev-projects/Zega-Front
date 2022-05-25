// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { url } from "../../helper";

// data stubs
import theme from "../../data/theme";

function SocialLinks(props) {
    const { shape, className } = props;
    const [social, setSocial] = useState();

    const classes = classNames(className, "social-links", {
        "social-links--shape--circle": shape === "circle",
        "social-links--shape--rounded": shape === "rounded",
    });

    useEffect(() => {
        fetch(`${url}/api/social`)
            .then((res) => res.json())
            .then((res) => {
                setSocial(res);
            });
    }, []);

    // const items = [
    //     { type: 'facebook', url: theme.fb, icon: 'fab fa-facebook-f social-link-color' },
    //     { type: 'instagram', url: theme.instagram, icon: 'fab fa-instagram social-link-color' },
    //     { type: 'twitter', url: theme.twitter, icon: 'fab fa-twitter social-link-color' },
    //     { type: 'youtube', url: theme.youtube, icon: 'fab fa-youtube' },
    // ]

    let socialLinks;

    if (social) {
        socialLinks = social.map((item) => (
            <div key={item.name}>
                <li className="social-links__item">
                    <a
                        className={`social-links__link social-link-color`}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={url + "/storage/" + item.icon} alt="" />
                    </a>
                </li>
            </div>
        ));
    }

    return (
        <div className={classes}>
            <ul className="social-links__list">{socialLinks}</ul>
        </div>
    );
}

SocialLinks.propTypes = {
    /**
     * rating value
     */
    shape: PropTypes.oneOf(["circle", "rounded"]),
    className: PropTypes.string,
};
SocialLinks.defaultProps = {
    shape: null,
};

export default SocialLinks;
