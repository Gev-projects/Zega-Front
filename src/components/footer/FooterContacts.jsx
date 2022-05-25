// react
import React from "react";
import { Link } from "react-router-dom";
// data stubs
import theme from "../../data/theme";
import { LogoSvg } from "../../svg";
import SocialLinks from "../shared/SocialLinks";
import { FormattedMessage } from "react-intl";

export default function FooterContacts() {
    const links = [
        { title: <FormattedMessage id="topbar.phone1" defaultMessage="Phone number" />, url: "" },
        { title: <FormattedMessage id="topbar.phone2" defaultMessage="Phone number" />, url: "" },
    ];

    const linksList = links.map((item, index) => (
        <a key={index} href={`tel:${item.title.props.defaultMessage}`}>
            {item.title}
        </a>
    ));
    return (
        <div className="site-footer__widget footer-contacts">
            {/* <div className="site-header__logo">
                    <Link to="/"><LogoSvg /></Link>
              </div> */}

            <ul className="footer-contacts__contacts">
                <li className="contatsAddress">
                    <FormattedMessage id="footer.contacts.mail" defaultMessage="example@gmail.com" />
                </li>
                <li className="contatsAddress middleAddress">
                    <FormattedMessage id="footer.contacts.phone" defaultMessage="Phone number" />
                </li>
                <li className="contatsAddress">
                    <FormattedMessage id="footer.contacts.address" defaultMessage="Address։ City name, Country name" />
                </li>

                <li>
                    <SocialLinks className="footer-newsletter__social-links" shape="circle" />
                </li>
            </ul>
        </div>
    );
}
