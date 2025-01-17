// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import Slick from "react-slick";
import { connect } from "react-redux";

// application
import languages from "../../i18n";

class StroykaSlickBase extends Component {
    slickRef;

    constructor(props) {
        super(props);

        this.state = {
            preventClick: false,
            activeSlides: this.getActiveSlides(this.getStartPosition()),
            slidesToShow: this.getSlidesToShow(),
        };
    }

    componentDidMount() {
        if (!this.element) {
            return;
        }

        this.element.addEventListener("mousedown", this.onMousedown);

        if (this.slickRef) {
            this.slickRef.slickGoTo(this.getStartPosition(), true);
        }

        this.createMedias();
    }

    componentDidUpdate(prevProps) {
        const { locale: prevLocale, children: prevChildren } = prevProps;
        const { direction: prevDirection } = languages[prevLocale];
        const { locale: currLocale, children: currChildren } = this.props;
        const { direction: currDirection } = languages[currLocale];

        if (currDirection !== prevDirection && this.slickRef) {
            this.slickRef.slickGoTo(this.getStartPosition(), true);
        }

        if (currChildren !== prevChildren) {
            // If the slides have changed, we also need to change the active slides.
            setTimeout(() => {
                this.setState({ activeSlides: this.getActiveSlides(this.getStartPosition()) });
            }, 0);
        }

        const { responsive: prevResponsive } = prevProps;
        const { responsive: currResponsive } = this.props;

        if (currResponsive !== prevResponsive) {
            this.unsubscribeMedias();
            this.createMedias();
        }
    }

    componentWillUnmount() {
        this.unsubscribeMedias();

        if (!this.element) {
            return;
        }

        this.element.removeEventListener("mousedown", this.onMousedown);
    }

    getSlidesCount() {
        const { children } = this.props;

        return React.Children.toArray(children).length;
    }

    // react-slick has a bug due to which it is initialized
    // with the incorrect position if the RTL property is true
    // this function returns the correct values
    getStartPosition() {
        let { infinite } = this.props;
        const { locale } = this.props;
        const { direction } = languages[locale];

        infinite = infinite === true || infinite === undefined;

        if (direction === "ltr") {
            return 0;
        }

        const slidesToShow = this.getSlidesToShow();
        const slidesCount = this.getSlidesCount();

        if (!infinite) {
            return Math.max(0, slidesCount - slidesToShow);
        }

        return (Math.ceil(slidesCount / slidesToShow) - 1) * slidesToShow;
    }

    // returns indexes of active slides by currentIndex
    getActiveSlides(currentIndex) {
        const slidesToShow = this.getSlidesToShow();
        const activeSlides = [];
        const slidesCount = this.getSlidesCount();

        const firstSlide = Math.max(0, Math.min(slidesCount - slidesToShow, currentIndex));
        const lastSlide = Math.min(slidesCount, firstSlide + slidesToShow);

        for (let i = firstSlide; i < lastSlide; i += 1) {
            activeSlides.push(i);
        }

        return activeSlides;
    }

    getSlidesToShow() {
        const { responsive, slidesToShow } = this.props;

        let result = slidesToShow || 1;

        if (responsive) {
            responsive.forEach((options) => {
                const { matches } = matchMedia(`(max-width: ${options.breakpoint}px)`);

                if (matches && options.settings.slidesToShow) {
                    result = options.settings.slidesToShow;
                }
            });
        }

        return result;
    }

    unsubscribeMedias = () => {};

    originalSlickNext = () => {};

    originalSlickPrev = () => {};

    setRef = (ref) => {
        this.element = ref;
    };

    onMousedown = (event) => {
        const downX = event.screenX;
        const downY = event.screenY;

        const onMousemove = (moveEvent) => {
            const { preventClick } = this.state;

            if (preventClick) {
                return;
            }

            const distance = Math.sqrt(
                Math.abs(downX - moveEvent.screenX) ** 2 + Math.abs(downY - moveEvent.screenY) ** 2
            );

            if (moveEvent.cancelable && distance > 3) {
                moveEvent.preventDefault();
            }

            if (distance > 15) {
                this.setState({ preventClick: true });
            }
        };
        const onMouseup = () => {
            this.setState({ preventClick: false });

            document.removeEventListener("mousemove", onMousemove);
            document.removeEventListener("mouseup", onMouseup);
        };

        document.addEventListener("mousemove", onMousemove);
        document.addEventListener("mouseup", onMouseup);
    };

    beforeChange = (oldIndex, newIndex) => {
        const { beforeChange } = this.props;

        if (beforeChange) {
            beforeChange(oldIndex, newIndex);
        }

        // react-slick incorrectly adds the .slick-active class to slides
        // if the RTL parameter is true so we will do it ourselves
        setTimeout(() => {
            this.setState({ activeSlides: this.getActiveSlides(newIndex) });
        }, 0);
    };

    setSlickRef = (ref) => {
        const { forwardRef } = this.props;

        if (forwardRef) {
            forwardRef(ref);
        }

        if (ref && ref !== this.slickRef) {
            // react-slick forgot that if the RTL parameter is true,
            // then the next and prev methods need to be swapped, so let's do it yourself
            this.originalSlickNext = ref.slickNext;
            this.originalSlickPrev = ref.slickPrev;

            // eslint-disable-next-line no-param-reassign
            ref.slickNext = this.slickNext;
            // eslint-disable-next-line no-param-reassign
            ref.slickPrev = this.slickPrev;
        }

        this.slickRef = ref;
    };

    slickNext = () => {
        const { locale } = this.props;
        const { direction } = languages[locale];

        if (direction === "rtl") {
            this.originalSlickPrev();
        } else {
            this.originalSlickNext();
        }
    };

    slickPrev = () => {
        const { locale } = this.props;
        const { direction } = languages[locale];

        if (direction === "rtl") {
            this.originalSlickNext();
        } else {
            this.originalSlickPrev();
        }
    };

    createMedias() {
        const { responsive, slidesToShow } = this.props;

        if (responsive && responsive.length > 0) {
            const subscriptions = [];

            const createMedia = (query, slidesToShow) => {
                const media = matchMedia(query);

                const onChange = () => {
                    const { matches } = media;

                    if (matches && slidesToShow) {
                        this.setState(() => ({ slidesToShow }));
                    }
                };

                if (media.addEventListener) {
                    media.addEventListener("change", onChange);
                } else {
                    media.addListener(onChange);
                }

                subscriptions.push(() => {
                    if (media.removeEventListener) {
                        media.removeEventListener("change", onChange);
                    } else {
                        media.removeListener(onChange);
                    }
                });
            };

            createMedia(`(min-width: ${responsive[0].breakpoint}.02px)`, slidesToShow || 1);

            responsive.forEach((options, index) => {
                const query = [`(max-width: ${options.breakpoint}px)`];

                if (responsive.length - 1 !== index) {
                    query.push(`(min-width: ${responsive[index + 1].breakpoint}.02px)`);
                }

                createMedia(query.join(" and "), options.settings.slidesToShow);
            });

            this.unsubscribeMedias = () => {
                subscriptions.forEach((x) => x());
            };
        }
    }

    render() {
        const { children, forwardRef, locale, beforeChange, ...otherProps } = this.props;
        const { preventClick, activeSlides, slidesToShow } = this.state;
        const { direction } = languages[locale];

        const classes = classNames("slick-prevent-click", {
            "slick-prevent-click--active": preventClick,
        });

        // we need to reverse slides if direction is RTL
        // because react-slick displays them in the wrong order
        let reversedChildren = React.Children.toArray(children);

        if (direction === "rtl") {
            reversedChildren = children.slice(0);
            reversedChildren.reverse();
        }

        reversedChildren = reversedChildren.map((slide, index) => {
            // react-slick incorrectly adds the .slick-active class to slides
            // if the RTL parameter is true so we will do it ourselves
            const slideClasses = classNames({ "correct-slick-active": activeSlides.includes(index) });

            return (
                <div key={index} dir={direction} className={slideClasses}>
                    {slide}
                </div>
            );
        });

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className={classes} onMouseDown={this.onMousedown} ref={this.setRef}>
                <Slick
                    {...otherProps}
                    autoplay={true}
                    rtl={direction === "rtl"}
                    beforeChange={this.beforeChange}
                    infinite={otherProps.infinite && React.Children.count(children) > slidesToShow}
                    ref={this.setSlickRef}
                >
                    {reversedChildren}
                </Slick>
            </div>
        );
    }
}

StroykaSlickBase.propTypes = {
    /** current locale */
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

const StroykaSlick = connect(mapStateToProps)(StroykaSlickBase);

export default React.forwardRef((props, ref) => <StroykaSlick forwardRef={ref} {...props} />);
