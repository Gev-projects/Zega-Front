// react
import React, { useEffect, useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

// application
import PageHeader from "../shared/PageHeader";
import Product from "../shared/Product";
import shopApi from "../../api/shop";
import { url } from "../../services/utils";

// blocks
import BlockLoader from "../blocks/BlockLoader";
import BlockProductsCarousel from "../blocks/BlockProductsCarousel";

// widgets
import WidgetCategories from "../widgets/WidgetCategories";
import WidgetProducts from "../widgets/WidgetProducts";

// data stubs
import categories from "../../data/shopWidgetCategories";
import theme from "../../data/theme";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

function ShopPageProduct(props) {
    const selectedData = useSelector((state) => state.locale);
    const customer = useSelector((state) => state.customer);
    const { productSlug, layout, sidebarPosition } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [crossProducts, setCrossProducts] = useState([]);
    const [UpSellsProducts, setUpSellsProducts] = useState([]);
    

    // Load product.
    useEffect(() => {
        let canceled = false;

        setIsLoading(true);
        shopApi.getProductBySlug(productSlug, { lang: selectedData }).then((product) => {
            if (canceled) {
                return;
            }

            setProduct(product);
            setIsLoading(false);
        });

        return () => {
            canceled = true;
        };
    }, [productSlug, selectedData]);

    // Load related products.
    useEffect(() => {
        let canceled = false;
        if (product) {
            if(product.data.related_products.length==0){
                shopApi.getRelatedProducts(product.data.cats, { lang: selectedData }, { limit: 8 }).then((products) => {
                    if (canceled) {
                        return;
                    }
                    setRelatedProducts(products.data.filter((e) => e.url_key != productSlug));
                });
            }else{
                setRelatedProducts(product.data.related_products);
            }

            if(product.data.cross_sells.length>0){
                setCrossProducts(product.data.cross_sells);
            }

            if(product.data.up_sells.length>0){
                setUpSellsProducts(product.data.up_sells);
            }

        }

        return () => {
            canceled = true;
        };
    }, [product]);

    // useEffect(() => {
    //     let canceled = false;
    //     shopApi.getCrossSaleProducts(productSlug, { lang: selectedData }, { limit: 5 }).then((result) => {
    //         if (canceled) {
    //             return;
    //         }

    //         setCrossProducts(result);
    //     });
    // }, [selectedData]);
    

    if (isLoading) {
        return <BlockLoader />;
    }
    const breadcrumb = [
        { title: <FormattedMessage id="home" defaultMessage="Home" />, url: url.home() },
        { title: <FormattedMessage id="shop" defaultMessage="Store" />, url: url.catalog() },
        { title: product.data.name, url: url.product(product.data) },
    ];

    const related = <FormattedMessage id="relatedProducts" defaultMessage="Related products" />;
    const upsellingProducts = <FormattedMessage id="upsellingProducts" defaultMessage="Up Selling" />;
    const similar = <FormattedMessage id="similarProducts" defaultMessage="Similar products" />;

    let content;

    if (layout === "sidebar") {
        const sidebar = (
            <div className="shop-layout__sidebar">
                <div className="block block-sidebar">
                    <div className="block-sidebar__item">
                        <WidgetCategories categories={categories} location="shop" />
                    </div>
                    <div className="block-sidebar__item d-none d-lg-block">
                        <WidgetProducts title="Latest Products" products={crossProducts} />
                    </div>
                </div>
            </div>
        );

        content = (
            <div className="container">
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === "start" && sidebar}
                    <div className=" shop-layout__content">
                        <div className=" block">
                            <Product product={product} layout={layout} />
                            {/*<ProductTabs withSidebar />*/}
                        </div>

                        {relatedProducts.length > 0 && (
                            <BlockProductsCarousel
                                title={related}
                                layout="grid-4-sm"
                                products={relatedProducts}
                                // withSidebar
                            />
                        )}
                    </div>
                    {sidebarPosition === "end" && sidebar}
                </div>
            </div>
        );
    } else {
        content = (
            <React.Fragment>
                <div className="block">
                    <div className="container p-0">
                        <Product product={product} layout={layout} customer={customer} />

                        {/*<ProductTabs />*/}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <BlockProductsCarousel
                        customer={customer}
                        title={related}
                        layout="grid-5"
                        products={relatedProducts}
                    />
                )}
                    {UpSellsProducts.length > 0 && (
                    <BlockProductsCarousel
                        customer={customer}
                        title={upsellingProducts}
                        layout="grid-5"
                        products={UpSellsProducts}
                    />   
                )} 

                {crossProducts.length > 0 && (
                    <BlockProductsCarousel
                        customer={customer}
                        title={similar}
                        layout="grid-5"
                        products={crossProducts}
                    />
                )} 
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${product.name} — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            <div className="take-product-page">{content}</div>
        </React.Fragment>
    );
}

ShopPageProduct.propTypes = {
    /** Product slug. */
    productSlug: PropTypes.string,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageProduct.defaultProps = {
    layout: "standard",
    sidebarPosition: "start",
};

export default ShopPageProduct;
