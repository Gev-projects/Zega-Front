// react
import React, { Component } from "react";
import MenuIcon from "../../images/MenuIcon.png";
// application
import departmentsArea from "../../services/departmentsArea";
import DepartmentsLinks from "./DepartmentsLinks";
import { Menu18x14Svg } from "../../svg";
import { FormattedMessage } from "react-intl";
import { url } from "../../helper";

class Departments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dep: [],
            open: false,
            fixed: false,
            area: null,
        };
    }

    componentDidMount() {
        fetch(`${url}/api/categories`)
            .then((response) => response.json())
            .then((res) => {
                this.setState({
                    dep: res.categories[0].children,
                });
            });

        document.addEventListener("mousedown", this.handleOutsideClick);

        this.unsubscribeAria = departmentsArea.subscribe((area) => {
            this.setState({
                fixed: !!area,
                area,
            });
        });

        this.setState({
            fixed: !!departmentsArea.area,
            area: departmentsArea.area,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        let { fixed, area, open } = this.state;

        // if (window.location.pathname === "/") {
        //     const root = this.rootRef;
        //     const content = root.querySelector(".departments__links-wrapper");

        //     root.classList.remove("departments--transition");
        //     root.classList.add("departments--fixed", "departments--opened");
        // } else {
        if (prevState.fixed !== fixed) {
            const root = this.rootRef;
            const content = root.querySelector(".departments__links-wrapper");

            if (fixed) {
                const areaRect = area.getBoundingClientRect();
                const areaBottom = areaRect.top + areaRect.height + window.scrollY;

                root.classList.remove("departments--transition");
                root.classList.add("departments--fixed", "departments--opened");

                const height = areaBottom - (content.getBoundingClientRect().top + window.scrollY);

                content.style.height = `${height}px`;
                content.getBoundingClientRect(); // force reflow
            } else {
                root.classList.remove("departments--opened", "departments--fixed");
                content.style.height = "";
            }
        } else if (!fixed) {
            if (open) {
                const root = this.rootRef;

                const content = root.querySelector(".departments__links-wrapper");
                content.getBoundingClientRect(); // force reflow
                const startHeight = content.getBoundingClientRect().height;

                root.classList.add("departments--transition", "departments--opened");

                const endHeight = content.getBoundingClientRect().height;

                content.style.height = `${startHeight}px`;
                content.getBoundingClientRect(); // force reflow
                content.style.height = `${endHeight}px`;
            } else {
                const root = this.rootRef;
                const content = root.querySelector(".departments__links-wrapper");
                const startHeight = content.getBoundingClientRect().height;

                content.style.height = `${startHeight}px`;

                root.classList.add("departments--transition");
                root.classList.remove("departments--opened");

                content.getBoundingClientRect(); // force reflow
                content.style.height = "";
            }
        }
        //}
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick);

        this.unsubscribeAria();
    }

    unsubscribeAria = () => {};

    setWrapperRef = (node) => {
        this.rootRef = node;
    };

    handleOutsideClick = (event) => {
        if (this.rootRef && !this.rootRef.contains(event.target)) {
            this.setState(() => ({
                open: false,
            }));
        }
    };

    handleButtonClick = () => {
        // if (window.location.pathname == "/") {
        //     this.setState((state) => ({
        //         open: true,
        //     }));
        // }
        this.setState((state) => ({
            open: !state.open,
        }));
    };

    handleTransitionEnd = (event) => {
        if (this.rootRef && event.propertyName === "height") {
            this.rootRef.querySelector(".departments__links-wrapper").style.height = "";
            this.rootRef.classList.remove("departments--transition");
        }
    };

    render() {
        return (
            <div className="departments" ref={this.setWrapperRef}>
                <div className="departments__body">
                    <div className="departments__links-wrapper" onTransitionEnd={this.handleTransitionEnd}>
                        <DepartmentsLinks dep={this.state.dep} func={this.handleButtonClick} />
                    </div>
                </div>

                <button type="button" className="departments__button" onClick={this.handleButtonClick}>
                    {/*<Menu18x14Svg className="departments__button-icon" />*/}
                    <img src={MenuIcon} className="menu-btn-img" alt="Menu Icon" />
                    <span className="headerCategory">
                        {" "}
                        <FormattedMessage id="header.category" defaultMessage="Category" />
                    </span>
                </button>
            </div>
        );
    }
}

export default Departments;
