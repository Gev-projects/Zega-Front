// react
import React, { useMemo, useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";

// application
import shopApi from "../../api/shop";

import BlockFeatures from "../blocks/BlockFeatures";

import BlockProducts from "../blocks/BlockProducts";

import BlockSlideShow from "../blocks/BlockSlideShow";
import { FormattedMessage } from "react-intl";

import theme from "../../data/theme";

import { useSelector } from "react-redux";

import BrandLogos from "../blocks/BrandLogos";
import { url } from "../../helper";

import { useHistory } from "react-router-dom";
import BlockBanner from "../blocks/BlockBanner";

function HomePageOne() {
    const selectedData = useSelector((state) => state.locale);
    const customer = useSelector((state) => state.customer);
    const [bestsellers, SetBest] = useState();
    const [featured, Setfeatured] = useState([]);
    const [banner, GetBanner] = useState();
    const newCollection = <FormattedMessage id="shop-title" defaultMessage="Shop" />;
    const saleCollection = <FormattedMessage id="saleCollection" defaultMessage="Saled products" />;

    const historyf = useHistory();

    useEffect(() => {
        shopApi.getNewProducts({ lang: selectedData }).then((res) => {
            SetBest(res.data);
        });

        shopApi.getFeaturedProducts({ lang: selectedData }).then((res) => {
            if (res) {
                Setfeatured(res.data);
            }
        });
    }, []);
    useEffect(() => {
        fetch(`${url}/api/banners`)
            .then((response) => response.json())
            .then((res) => {
                if (res) GetBanner(res);
            });
    }, []);
    return (
        <React.Fragment>
            <Helmet>
                <title>{`${theme.name}`}</title>
            </Helmet>

            {useMemo(
                () => (
                    <BlockSlideShow history={historyf} />
                ),
                []
            )}

            {/*{useMemo(() => <BlockFeatures />, [])}*/}

            {useMemo(
                () => (
                    <BlockProducts
                        customer={customer}
                        title={newCollection}
                        layout="large-first"
                        products={bestsellers}
                    />
                ),
                [bestsellers, customer.token]
            )}
               <div>
                <BlockBanner url={banner && banner.length && banner[0] ? banner[0].path : ""} />
            </div>
            {useMemo(
                () => (
                    <BlockProducts
                        customer={customer}
                        title={saleCollection}
                        layout="large-first"
                        products={featured}
                    />
                ),
                [featured, customer.token]
            )}

            <BrandLogos />

            {useMemo(
                () => (
                    <BlockFeatures />
                ),
                []
            )}
        </React.Fragment>
    );
}

export default HomePageOne;
