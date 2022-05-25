// react
import React, { useState } from "react";

import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";
import Pagination from "../shared/Pagination";
import PostCard from "../shared/PostCard";
import { FormattedMessage } from "react-intl";
import theme from "../../data/theme";
import { useEffect } from "react";
import BlockLoader from "../blocks/BlockLoader";
import { url } from "../../helper";
import { useSelector } from "react-redux";

const BlogPageCategory = (props) => {
    const selectedData = useSelector((state) => state.locale);
    const [page, setPage] = useState();
    const [blogs, setBlogs] = useState();
    const [total, setTotal] = useState();

    useEffect(() => {
        fetch(url + "/api/cms/blogs")
            .then((responce) => responce.json())
            .then((res) => {
                setBlogs(res.data);
                setPage(res.current_page);
                setTotal(res.setTotal);
            });
    }, []);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const { layout, sidebarPosition } = props;

    const breadcrumb = [
        { title: <FormattedMessage id="home" defaultMessage="Home" />, url: "" },
        { title: <FormattedMessage id="blog" defaultMessage="Blog" />, url: "/blog" },
        { title: <FormattedMessage id="news" defaultMessage="News" />, url: "" },
    ];

    if (!blogs) {
        return <BlockLoader />;
    }

    const postsList = blogs.map((post) => {
        // let pos = post.translations.find(item => item.locale === selectedData);
        // pos.image=post.image
        const postLayout = {
            classic: "grid-lg",
            grid: "grid-nl",
            list: "list-nl",
        }[layout];

        return (
            <div key={post.id} className="posts-list__item">
                <PostCard post={post} layout={postLayout} />
            </div>
        );
    });

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Blog Category Page — ${theme.name}`}</title>
            </Helmet>
            <PageHeader header="Latest News" breadcrumb={breadcrumb} />
            <div className="container">
                <div className="row">
                    {/* {sidebarStart} */}
                    <div className="col-12 col-md-12">
                        <h1 className="blog-page-title">
                            <FormattedMessage id="footer.blog" defaultMessage="Blog" />
                        </h1>
                        <div className="block">
                            <div className="posts-view">
                                <div className={`posts-view__list posts-list posts-list--layout--${layout}`}>
                                    <div className="posts-list__body">{postsList}</div>
                                </div>
                                <div className="posts-view__pagination">
                                    {total > 10 ? (
                                        <Pagination
                                            current={page}
                                            siblings={2}
                                            total={total}
                                            onPageChange={handlePageChange}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BlogPageCategory;
