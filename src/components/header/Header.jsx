// react
import React, { useEffect, useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import NavLinks from "./NavLinks";
import NavPanel from "./NavPanel";
import Topbar from "./Topbar";
import { url } from "../../helper";

function Header(props) {
    const { layout } = props;
    let bannerSection;
    const [logoUrl, setLogoUrl] = useState();
    const [favicon, setFavicon] = useState();

    useEffect(() => {
        fetch(`${url}/api/logo`)
            .then((response) => response.json())
            .then(({ url }) => {
                setLogoUrl(url);
            });
    }, []);

    useEffect(() => {
        fetch(`${url}/api/favicon`)
            .then((response) => response.json())
            .then((res) => setFavicon(res));
    }, []);

    if (favicon) {
        document.getElementById("favicon").href = `${url}${favicon.url}`;
    }

    if (layout === "default") {
        bannerSection = (
            <div className="site-header__middle container">
                <div className="site-header__logo">
                    {/*    <Link to="/"><LogoSvg /></Link> */}
                    <Link to="/">
                        <img className="header-logo-img" src={logoUrl ? `${logoUrl}` : ""} alt="" />
                    </Link>
                </div>
                <div className="site-header__search">
                    <NavLinks />
                </div>
            </div>
        );
    }

    return (
        <div className="site-header">
            <Topbar />
            {bannerSection}
            <div className="site-header__nav-panel">
                <NavPanel layout={layout} />
            </div>
        </div>
    );
}

Header.propTypes = {
    layout: PropTypes.oneOf(["default", "compact"]),
};

Header.defaultProps = {
    layout: "default",
};

export default Header;
