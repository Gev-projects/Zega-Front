// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

// application
import departmentsAria from "../../services/departmentsArea";
import languages from "../../i18n";
import StroykaSlick from "../shared/StroykaSlick";
import { url } from "../../helper";

const slickSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
};

class BlockSlideShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dep: [],
        };
    }
    departmentsAreaRef = null;

    media = window.matchMedia("(min-width: 992px)");

    componentDidMount() {
        // fetch(`http://api.megalight.am/api/slider`)
        fetch(`${url}/api/sliders`)
            .then((response) => response.json())
            .then((res) => {
                this.setState({
                    dep: res,
                });
            });

        if (this.media.addEventListener) {
            this.media.addEventListener("change", this.onChangeMedia);
        } else {
            // noinspection JSDeprecatedSymbols
            this.media.addListener(this.onChangeMedia);
        }
    }

    componentWillUnmount() {
        departmentsAria.area = null;

        if (this.media.removeEventListener) {
            this.media.removeEventListener("change", this.onChangeMedia);
        } else {
            // noinspection JSDeprecatedSymbols
            this.media.removeListener(this.onChangeMedia);
        }
    }

    onChangeMedia = () => {
        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    setDepartmentsAreaRef = (ref) => {
        this.departmentsAreaRef = ref;

        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    render() {
        const { withDepartments } = this.props;

        const blockClasses = classNames("block-slideshow block", {
            "block-slideshow--layout--full": !withDepartments,
            "block-slideshow--layout--with-departments": withDepartments,
        });

        const slides = this.state.dep.map((slide, index) => {
            const image = slide.path; //(withDepartments ? slide.image_classic : slide.image_full);
            const MobileImage = slide.mobile_path;
            return (
                <div key={index} className="block-slideshow__slide">
                    <div
                        className="block-slideshow__slide-image block-slideshow__slide-image--desktop"
                        style={{
                            backgroundImage: `url(${url}/storage/${image})`,
                        }}
                    />
                    <div
                        className="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                        style={{
                            backgroundImage: `url(${url}/storage/${MobileImage})`,
                        }}
                    />

                    <div className="container">
                        <div className="block-slideshow__slide-content">
                            <div
                                className="block-slideshow__slide-title"
                                dangerouslySetInnerHTML={{ __html: slide.content }}
                            />
                            <div
                                className="block-slideshow__slide-text"
                                dangerouslySetInnerHTML={{ __html: slide.text }}
                            />
                            {slide.slider_path.length > 0 ? (
                                <div className="block-slideshow__slide-button">
                                    {/*<Link to="/shop/catalog" className="btn btn-orange slideshow-btn rounded-pill">*/}
                                    <button
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname: `${slide.slider_path}`,
                                            });
                                        }}
                                        className="btn btn-orange slideshow-btn rounded-pill"
                                    >
                                        <FormattedMessage id="slideshow-btn" defaultMessage="Buy now" />
                                    </button>
                                    {/*</Link>*/}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className={blockClasses}>
                <div>
                    {withDepartments && (
                        <div className="absolute col-3 d-lg-block d-none" ref={this.setDepartmentsAreaRef} />
                    )}

                    <div>
                        <div className="block-slideshow__body">
                            <StroykaSlick {...slickSettings}>{slides}</StroykaSlick>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BlockSlideShow.propTypes = {
    withDepartments: PropTypes.bool,
    /** current locale */
    locale: PropTypes.string,
};

BlockSlideShow.defaultProps = {
    withDepartments: false,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(BlockSlideShow);
