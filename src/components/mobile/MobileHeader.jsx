// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import IndicatorAccount from "../header/IndicatorAccount";
// application
import Indicator from "../header/Indicator";
import { Menu18x14Svg, LogoSvg, Search20Svg, Heart120Svg, Cart120Svg } from "../../svg";

import { mobileMenuOpen } from "../../store/mobile-menu";
import Search from "../header/Search";
import { url } from "../../helper";

class MobileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchOpen: false,
            logoUrl: "",
        };
        this.searchInput = React.createRef();
    }

    componentDidMount() {
        fetch(`${url}/api/logo`)
            .then((response) => response.json())
            .then((res) => this.setState({ logoUrl: res.url }));
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchOpen } = this.state;

        if (searchOpen && searchOpen !== prevState.searchOpen && this.searchInput.current) {
            this.searchInput.current.focus();
        }
    }

    handleOpenSearch = () => {
        this.setState(() => ({ searchOpen: true }));
    };

    handleCloseSearch = () => {
        this.setState(() => ({ searchOpen: false }));
    };

    render() {
        const { openMobileMenu, wishlist, cart } = this.props;
        const { searchOpen } = this.state;
        const searchClasses = classNames("mobile-header__search", {
            "mobile-header__search--open": searchOpen,
        });

        return (
            <div className="mobile-header">
                <div className="mobile-header__panel">
                    <div className="container_fm top-header-container">
                        <div className="mobile-header__body">
                            <button type="button" className="mobile-header__menu-button" onClick={openMobileMenu}>
                                <Menu18x14Svg />
                            </button>
                            <Link to="/" className="site-header__logo">
                                <img
                                    className="header-logo-img-mobile"
                                    src={this.state.logoUrl ? `${this.state.logoUrl}` : ""}
                                    alt=""
                                />
                            </Link>
                            <Search
                                context="mobile-header"
                                className={searchClasses}
                                inputRef={this.searchInput}
                                onClose={this.handleCloseSearch}
                            />
                            <div className="mobile-header__indicators">
                                <Indicator
                                    className="indicator--mobile indicator--mobile-search d-md-none"
                                    onClick={this.handleOpenSearch}
                                    icon={<Search20Svg />}
                                />
                                <Indicator
                                    className="indicator--mobile d-sm-flexd-md-none"
                                    url="/shop/wishlist"
                                    value={wishlist.length}
                                    icon={<Heart120Svg />}
                                />
                                <Indicator
                                    className="indicator--mobile"
                                    url="/shop/cart"
                                    value={cart.quantity}
                                    icon={<Cart120Svg />}
                                />

                                <IndicatorAccount />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    wishlist: state.wishlist,
});

const mapDispatchToProps = {
    openMobileMenu: mobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
