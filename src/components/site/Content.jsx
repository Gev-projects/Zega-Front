// react
import React from "react";
// third-party
import { Helmet } from "react-helmet-async";
// import { Link } from 'react-router-dom';

// application
// import StroykaSlick from '../shared/StroykaSlick';

// data stubs
import theme from "../../data/theme";
// import { useEffect, useMemo } from 'react';
// import { useSelector } from 'react-redux'
// import { useState } from 'react';
// import bgImage from '../../images/slideHome.png'

function Content(props) {
    // const head = useMemo(() => {
    //     return <div style={{
    //         minHeight: '250px',
    //         backgroundImage: `url(${bgImage})`,
    //         backgroundPosition: 'center',
    //         backgroundRepeat: 'no-repeat',
    //         backgroundSize: 'cover'
    //     }} className="container-fluid">

    //     </div>
    // }, [])

    const { text } = props;
    if (!text || text.data.length == 0) {
        return "";
    }

    const createMarkup = (item) => {
        return { __html: item };
    };

    return (
        <div className="block about-us">
            <Helmet>
                <title>{`About Us — ${theme.name}`}</title>
            </Helmet>

            {/* {head} */}

            <div className="block">
                <div className="container">
                    <div className="document">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: text.data.html_content ? text.data.html_content : text.data.html_content,
                            }}
                        ></div>

                        {/* <div className="document__header">
                            <h1 className="document__title">{text.data[0].page_title}</h1>

                        </div>
                        <div className="document__content typography">


                            <div dangerouslySetInnerHTML={createMarkup(text.data[0].html_content)}></div>
                            {/* <div className="about-us__teammates teammates">
                                        <StroykaSlick {...slickSettings}>
                                            <div className="teammates__item teammate">
                                                <div className="teammate__avatar">
                                                    <img src="images/teammates/teammate-1.jpg" alt="" />
                                                </div>
                                                <div className="teammate__name">Michael Russo</div>
                                                <div className="teammate__position text-muted">Chief Executive Officer</div>
                                            </div>
                                            <div className="teammates__item teammate">
                                                <div className="teammate__avatar">
                                                    <img src="images/teammates/teammate-2.jpg" alt="" />
                                                </div>
                                                <div className="teammate__name">Katherine Miller</div>
                                                <div className="teammate__position text-muted">Marketing Officer</div>
                                            </div>
                                            <div className="teammates__item teammate">
                                                <div className="teammate__avatar">
                                                    <img src="images/teammates/teammate-3.jpg" alt="" />
                                                </div>
                                                <div className="teammate__name">Anthony Harris</div>
                                                <div className="teammate__position text-muted">Finance Director</div>
                                            </div>
                                        </StroykaSlick>
                                    </div>
                                    </div>
                                */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
