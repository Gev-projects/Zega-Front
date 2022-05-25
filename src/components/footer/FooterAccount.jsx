import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import FooterContacts from "./FooterContacts";
import { url } from "../../helper";
import { connect } from "react-redux";

class FooterAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            footerLinks: [],
        };
    }

    componentDidMount() {
        fetch(`${url}/api/cms/menus?locale=${this.props.locale}`)
            .then((res) => res.json())
            .then((res) => this.setState({ footerLinks: res.data.filter((item) => item.type == "footer") }));
    }

    render() {
     let navLinks=this.state.footerLinks;
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
        // return (
        //     <React.Fragment>
        //         <div className="footer-contacts-body">
        //             <div className="footer-contacts-mobile">
        //                 <FooterContacts />
        //             </div>
        //
        //             <div>
        //                 <div className="footer-link-style">
        //                     <Link to="/page/about-us">
        //                         <FormattedMessage id="aboutUs" defaultMessage="About US" />
        //                     </Link>
        //                 </div>
        //                 <div className="footer-link-style">
        //                     <Link to="/account/login">
        //                         <FormattedMessage id="signIn&CreateAccount" defaultMessage="Sign in/Create account" />
        //                     </Link>
        //                 </div>
        //             </div>
        //
        //             {/* <a href="#" className="footer-link-style" src="">Delivery and payment</a> */}
        //
        //             {/*<div className="site-footer-logo">*/}
        //             {/*     <p> Demo <br /> Store </p>*/}
        //             {/*</div>*/}
        //         </div>
        //     </React.Fragment>
        // );

        const links = this.state.footerLinks.map((link) => (
            <div>
            <Link key={link.id} to={link.custom_url || link.url_key || "/page/"+link.page_id}>
                {link.name}
            </Link>
            </div>
        ));
        return <>{links}</>;
    }
}

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(FooterAccount);
