export const url = {
    home: () => '/',

    catalog: () => '/catalog',

    category: (category) => `/catalog/${category.slug}`,

    product: (product) => {

        return `/products/${product.url_key}`
        // return `/products/${product.product_id || product.id}`
    },
};

export function getCategoryParents(category) {
    return category.parent ? [...getCategoryParents(category.parent), category.parent] : [];
}
