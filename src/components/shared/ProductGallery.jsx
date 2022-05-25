// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import languages from "../../i18n";
import StroykaSlick from "./StroykaSlick";
import { ZoomIn24Svg } from "../../svg";
import { url } from "../../helper";

const slickSettingsFeatured = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
};
const slickSettingsThumbnails = {
    standard: {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 4 } },
            { breakpoint: 991, settings: { slidesToShow: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 5 } },
            { breakpoint: 479, settings: { slidesToShow: 4 } },
            { breakpoint: 379, settings: { slidesToShow: 3 } },
        ],
    },
    sidebar: {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 5 } },
            { breakpoint: 479, settings: { slidesToShow: 4 } },
            { breakpoint: 379, settings: { slidesToShow: 3 } },
        ],
    },
    columnar: {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 3 } },
            { breakpoint: 767, settings: { slidesToShow: 5 } },
            { breakpoint: 479, settings: { slidesToShow: 4 } },
            { breakpoint: 379, settings: { slidesToShow: 3 } },
        ],
    },
    quickview: {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 400,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1199, settings: { slidesToShow: 4 } },
            { breakpoint: 767, settings: { slidesToShow: 5 } },
            { breakpoint: 479, settings: { slidesToShow: 4 } },
            { breakpoint: 379, settings: { slidesToShow: 3 } },
        ],
    },
};

class ProductGallery extends Component {
    gallery;

    /** @var {Promise} */
    createGallery = null;

    imagesRefs = [];

    unmounted = false;

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
            transition: false,
        };
    }

    componentDidMount() {
        this.createGallery = import("../../photoswipe").then((module) => module.createGallery);

        // this is necessary to reset the transition state, because sometimes
        // react-slick does not trigger an afterChange event after a beforeChange event
        setTimeout(() => {
            this.setState(() => ({
                transition: false,
            }));
        }, 0);
    }

    componentDidUpdate(prevProps) {
        const { locale: prevLocale } = prevProps;
        const { direction: prevDirection } = languages[prevLocale];
        const { locale: currLocale } = this.props;
        const { direction: currDirection } = languages[currLocale];

        if (currDirection !== prevDirection) {
            // this is necessary to reset the transition state,
            // because when the direction changes, the afterChange event does not fire
            setTimeout(() => {
                this.setState(() => ({
                    transition: false,
                }));
            }, 0);
        }
    }

    componentWillUnmount() {
        if (this.gallery) {
            this.gallery.destroy();
        }

        this.unmounted = true;
    }

    getIndexDependOnDir(index) {
        const { images, locale } = this.props;
        const { direction } = languages[locale];

        // we need to invert index id direction === 'rtl' due to react-slick bug
        if (direction === "rtl") {
            return images.length - 1 - index;
        }

        return index;
    }

    handleFeaturedClick = (event, index) => {
        const { layout } = this.props;

        if (!this.createGallery || layout === "quickview") {
            return;
        }

        event.preventDefault();

        this.openPhotoswipe(index);
    };

    handleThumbnailClick = (index) => {
        const { transition } = this.state;

        if (transition) {
            return;
        }

        this.setState(() => ({ currentIndex: index }));

        if (this.slickFeaturedRef) {
            this.slickFeaturedRef.slickGoTo(this.getIndexDependOnDir(index));
        }
    };

    handleFeaturedBeforeChange = (oldIndex, newIndex) => {
        this.setState(() => ({
            currentIndex: this.getIndexDependOnDir(newIndex),
            transition: true,
        }));
    };

    handleFeaturedAfterChange = (index) => {
        this.setState(() => ({
            currentIndex: this.getIndexDependOnDir(index),
            transition: false,
        }));
    };

    handleZoomButtonClick = () => {
        const { currentIndex } = this.state;

        this.openPhotoswipe(currentIndex);
    };

    setSlickFeaturedRef = (ref) => {
        this.slickFeaturedRef = ref;
    };

    openPhotoswipe(index) {
        const { images, locale } = this.props;
        const { direction } = languages[locale];

        const items = this.imagesRefs.map((tag, index) => {
            const width = parseFloat(tag.dataset.width) || tag.naturalWidth;
            const height = parseFloat(tag.dataset.height) || tag.naturalHeight;
            return {
                src: url + images[index].medium_image_url,
                msrc: images[index].medium_image_url,
                w: width,
                h: height,
            };
        });

        if (direction === "rtl") {
            items.reverse();
        }

        // noinspection JSUnusedGlobalSymbols
        const options = {
            getThumbBoundsFn: (index) => {
                const dirDependentIndex = this.getIndexDependOnDir(index);

                if (!this.imagesRefs[dirDependentIndex]) {
                    return null;
                }

                const tag = this.imagesRefs[dirDependentIndex];
                const width = tag.naturalWidth;
                const height = tag.naturalHeight;
                const rect = tag.getBoundingClientRect();
                const ration = Math.min(rect.width / width, rect.height / height);
                const fitWidth = width * ration;
                const fitHeight = height * ration;

                return {
                    x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
                    y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
                    w: fitWidth,
                };
            },
            index: this.getIndexDependOnDir(index),
            bgOpacity: 0.9,
            history: false,
        };

        this.createGallery.then((createGallery) => {
            if (this.unmounted) {
                return;
            }

            this.gallery = createGallery(items, options);

            this.gallery.listen("beforeChange", () => {
                if (this.gallery && this.slickFeaturedRef) {
                    this.slickFeaturedRef.slickGoTo(this.gallery.getCurrentIndex(), true);
                }
            });
            this.gallery.listen("destroy", () => {
                this.gallery = null;
            });

            this.gallery.init();
        });
    }

    render() {
        const { layout, images } = this.props;
        const { currentIndex } = this.state;

        const featured = images.map((image, index) => (
            <div key={index} className="product-image product-image--location--gallery">
                <Link
                    to={`${url + image.medium_image_url}`}
                    className="product-image__body"
                    onClick={(event) => this.handleFeaturedClick(event, index)}
                    target="_blank"
                >
                    <img
                        className="product-image__img"
                        src={url + image.medium_image_url}
                        alt=""
                        ref={(element) => {
                            this.imagesRefs[index] = element;
                        }}
                        data-width="700"
                        data-height="700"
                    />
                </Link>
            </div>
        ));

        const thumbnails = images.map((image, index) => {
            const classes = classNames("product-gallery__carousel-item product-image", {
                "product-gallery__carousel-item--active": index === currentIndex,
            });

            return (
                <button type="button" key={index} onClick={() => this.handleThumbnailClick(index)} className={classes}>
                    <div className="product-image__body">
                        <img
                            className="product-image__img product-gallery__carousel-image product-small-img"
                            src={url + image.medium_image_url}
                            alt=""
                        />
                    </div>
                </button>
            );
        });

        return (
            <div className="product__gallery">
                <div className="product-gallery">
                    <div className="product-gallery__featured">
                        {layout !== "quickview" && (
                            <button
                                type="button"
                                className="product-gallery__zoom"
                                onClick={this.handleZoomButtonClick}
                            >
                                <ZoomIn24Svg />
                            </button>
                        )}
                        <StroykaSlick
                            ref={this.setSlickFeaturedRef}
                            {...slickSettingsFeatured}
                            beforeChange={this.handleFeaturedBeforeChange}
                            afterChange={this.handleFeaturedAfterChange}
                        >
                            {featured}
                        </StroykaSlick>
                    </div>
                    <div className="product-gallery__carousel">
                        <StroykaSlick {...slickSettingsThumbnails[layout]}>{thumbnails}</StroykaSlick>
                    </div>
                </div>
            </div>
        );
    }
}

ProductGallery.propTypes = {
    images: PropTypes.array,
    layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
    /** current locale */
    locale: PropTypes.string,
};

ProductGallery.defaultProps = {
    images: [],
    layout: "standard",
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

export default connect(mapStateToProps)(ProductGallery);
