// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';

// application
import BlockHeaderCustom from '../shared/BlockHeaderCustom';
import ProductCard from '../shared/ProductCard';
import { Helmet } from 'react-helmet-async';

export default function BlockProducts(props) {
    const {
        customer,
        title,
        layout,
        featuredProduct,
        products,
    } = props;

    let large;
    let smalls;
    const arrayMeta = [];

    if (featuredProduct) {
        large = (
            <div className="block-products__featured">
                <div className="block-products__featured-item">
                    <ProductCard product={featuredProduct} customer={customer} />
                </div>
            </div>
        );
    }

    if (products.length > 0) {
        const productsList = products.map((product, index) => {

            // arrayMeta.push(<meta name="name" content={product.name} />)
            // arrayMeta.push(<meta name="description" content={product.desc} />)

            return <div key={index} className="product-card-parent">
                <div className='block-products__list-item'>
                    <ProductCard product={product} customer={customer} />
                </div>
            </div>
        });

        smalls = (
            <div className="block-products__list">
                {productsList}
            </div>
        );
    }

    return (

        <>
            <Helmet>
                {arrayMeta}
            </Helmet>

            <div className={`block block-products block-products--layout--${layout}`}>
                <div className="container p-0 home-product-container">
                    {/*<div className="container_fm">*/}

                    {smalls ?
                        <BlockHeaderCustom title={title} /> : ''
                    }

                    <div className="block-products__body">
                        {layout === 'large-first' && large}
                        {smalls}
                        {layout === 'large-last' && large}
                    </div>

                </div>
            </div>
        </>
    );
}

BlockProducts.propTypes = {
    title: PropTypes.string.isRequired,
    featuredProduct: PropTypes.object,
    products: PropTypes.array,
    layout: PropTypes.oneOf(['large-first', 'large-last']),
};

BlockProducts.defaultProps = {
    products: [],
    layout: 'large-first',
};
