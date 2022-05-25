// react
import React from 'react';

// third-party
// data stubs
import Content from './Content'
import { useState } from 'react';
import { useEffect } from 'react';
import { url } from '../../helper';
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';


const slickSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 379,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

function SiteCustomPage(props) {
    const history = useHistory();
    const selectedData = useSelector(state => state.locale)
    const { id } = props
    const [content, setContent] = useState();

    useEffect(() => {
        let canceled = false;
        fetch(`${url}/api/cms/page/${id.pageSlug}`)
            .then(response => response.json())
            .then(res => {
                console.log('res:', res)
                if (res === undefined || res.length == 0) {
                    history.push('/');
                } else {
                    setContent(res)
                }
            })

    }, [id, selectedData])



    return (
        <React.Fragment>

            <Helmet>
                <title>{`Custom page`}</title>
                <meta name="description" content="Custom description" />
            </Helmet>
            <Content text={content}  {...props} />
        </React.Fragment>
    );


}

export default SiteCustomPage;
