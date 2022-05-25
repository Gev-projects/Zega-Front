// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import Menu from "./Menu";
import { ArmSvg, ArrowRoundedDown7x5Svg, RusSvg } from "../../svg";

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    };

    handleOutsideClick = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState(() => ({
                open: false,
            }));
        }
    };

    handleButtonClick = () => {
        this.setState((state) => ({
            open: !state.open,
        }));
    };

    handleItemClick = (item) => {
        const { onClick } = this.props;

        this.setState(() => ({
            open: false,
        }));

        if (onClick) {
            onClick(item);
        }
    };

    render() {
        if (!this.props.locale) {
            return null;
        }

        const { open } = this.state;
        const { title, withIcons, items, locale } = this.props;

        const classes = classNames("topbar-dropdown", {
            "topbar-dropdown--opened": open,
        });
        return (
            <div className={classes} ref={this.setWrapperRef}>
                <button className="topbar-dropdown__btn" type="button" onClick={this.handleButtonClick}>
                    <span style={{ paddingBottom: "3px" }}>{locale[0].name}</span>

                    <img
                        style={{
                            height: "16px",
                            width: "20px",
                            marginLeft: "6px",
                        }}
                        src={locale[0].locale_image}
                        alt=""
                    />

                    {locale.length > 1 ? <ArrowRoundedDown7x5Svg className="language-dropdown-arrow" /> : " "}
                </button>

                <div className="topbar-dropdown__body">
                    {locale.length > 1 ? (
                        <Menu layout="topbar" withIcons={withIcons} items={items} onClick={this.handleItemClick} />
                    ) : (
                        " "
                    )}
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    /** title */
    title: PropTypes.node.isRequired,
    /** array of menu items */
    items: PropTypes.array.isRequired,
    /** default: false */
    withIcons: PropTypes.bool,
    /** callback function that is called when the item is clicked */
    onClick: PropTypes.func,
};

Dropdown.defaultProps = {
    withIcons: false,
    onClick: undefined,
};

export default Dropdown;
