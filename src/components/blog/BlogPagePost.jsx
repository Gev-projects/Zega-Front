// react
import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import PageHeader from "../shared/PageHeader";
import BlogPost from "./BlogPost";
import theme from "../../data/theme";
import { useEffect, useState } from "react";
import { url } from "../../helper";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

export default function BlogPagePost(props) {
    const { layout, sidebarPosition, id } = props;
    let content;
    let bogOne;
    const [blog, setBlog] = useState();
    const [redirect, setRedirect] = useState();
    const selectedData = useSelector((state) => state.locale);
    useEffect(() => {
        let isCancelled = false;

        fetch(`${url}/api/cms/blogs?id=${id.blogID}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    setRedirect(true);
                }
            })
            .then((responce) => {
                setBlog(responce.data[0]);
            });

        return () => {
            isCancelled = true;
        };
    }, [id.blogID]);

    if (redirect) {
        return <Redirect to={"/404"} />;
    }

    if (blog) {
        bogOne = blog;
    }

    content = (
        <div className="row justify-content-center">
            <div className="col-md-12 col-lg-9 col-xl-8">
                <BlogPost blog={bogOne} layout={layout} />
            </div>
        </div>
    );

    const breadcrumbs = [
        { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "" },
        { title: <FormattedMessage id="blog" defaultMessage="Blog" />, url: "/blog" },
        { title: <FormattedMessage id="news" defaultMessage="News" />, url: "" },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Blog Post Page — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumbs} />

            <div className="container">{content}</div>
        </React.Fragment>
    );
}

BlogPagePost.propTypes = {
    /**
     * post layout
     * one of ['classic', 'full'] (default: 'classic')
     */
    layout: PropTypes.oneOf(["classic", "full"]),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

BlogPagePost.defaultProps = {
    layout: "classic",
    sidebarPosition: "start",
};
