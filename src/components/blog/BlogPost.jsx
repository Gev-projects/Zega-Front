// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import BlogCommentsList from "./BlogCommentsList";

// data stubs
import comments from "../../data/blogPostComments";
import posts from "../../data/blogPosts";
import { url } from "../../helper";
import SitePageNotFound from "../site/SitePageNotFound";
import { Redirect, Route } from "react-router-dom";
export default function BlogPost(props) {
    const { layout, blog } = props;
    const postClasses = classNames("post__content typography", {
        "typography--expanded": layout === "full",
    });

    if (!blog) {
        return "";
    }
    const createMarkup = (item) => {
        return { __html: item };
    };
    return (
        <>
            <div className={`block post post--layout--${layout}`}>
                <div className={`post__header post-header post-header--layout--${layout}`}>
                    <h1 className="post-header__title">{blog.title}</h1>
                    <div className="post-header__meta">
                        <div className="post-header__meta-item"> {blog.created_at}</div>
                    </div>
                </div>

                <div className="post__featured">
                    {/* <Link to="/"> */}
                    <img src={`${blog.image}`} alt="" />
                    {/* </Link>*/}
                </div>

                <div className={postClasses} dangerouslySetInnerHTML={createMarkup(blog.html_content)}></div>
            </div>
        </>
    );
}

BlogPost.propTypes = {
    /**
     * post layout
     * one of ['classic', 'full'] (default: 'classic')
     */
    layout: PropTypes.oneOf(["classic", "full"]),
};

BlogPost.defaultProps = {
    layout: "classic",
};
