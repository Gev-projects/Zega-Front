// react
import React from "react";

// application
import FooterContacts from "./FooterContacts";
// import FooterLinks from './FooterLinks';
import FooterNewsletter from "./FooterNewsletter";
import ToTop from "./ToTop";

import FooterAccount from "./FooterAccount";

import FidemLogo from "../../images/FidemLogo.png";

export default function Footer() {
    return (
        <div className="site-footer">
            <div className="footer-container">
                <div className="footer-body">
                    <div className="newsletter-block-mobile">
                        <FooterNewsletter />
                    </div>

                    <div className="footer-admin-content">
                        <FooterAccount />
                    </div>

                    <div>
                        <FooterContacts />
                    </div>

                    {/*  <div className="col-md-3 offset pl-4 pr-4">
                   <FooterLinks title="Information"  />
                   </div> */}
                    <div className="newsletter-block">
                        <FooterNewsletter />
                    </div>
                </div>

                {/*   <div className="line"></div>

            <div  style={{
                textAlign: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <span>Design and Development by</span>
                <a target="_blank" href="https://www.fidem.am/">

                     <img style={{
                         marginLeft:"3px",
                         width:"100px"
                     }} src={FidemLogo} alt=""/>
                 </a>
            </div> */}
            </div>
            <ToTop />
        </div>
    );
}
