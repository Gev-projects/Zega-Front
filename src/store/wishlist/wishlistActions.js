import { toast } from 'react-toastify';
import { WISHLIST_ADD_ITEM, WISHLIST_REMOVE_ITEM } from './wishlistActionTypes';
import React from 'react';
import { FormattedMessage } from "react-intl";



// const translations = {
//     product: {
//         hy: 'Ապրանք',
//         ru: 'товар',
//         en: "Product"
//     },
//     added: {
//         hy: 'Ավելացվել է ցանկալիների ցուցակում',
//         ru: 'добавлен в список желаний',
//         en: "Product added to wish list"
//     }

// }
export function wishlistAddItemSuccess(product, locale) {
    toast.success(
     <FormattedMessage id="add-wish-list" defaultMessage={`Product ${product.name ? product.name : ''} added to wish list`}/>);

    return {
        type: WISHLIST_ADD_ITEM,
        product,
    };
}

export function wishlistRemoveItemSuccess(productId) {
    return {
        type: WISHLIST_REMOVE_ITEM,
        productId,
    };
}

export function wishlistAddItem(product, locale) {
    return (dispatch) => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(wishlistAddItemSuccess(product, locale));
                resolve();
            }, 500);
        })
    );
}

export function wishlistRemoveItem(productId) {
    return (dispatch) => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(wishlistRemoveItemSuccess(productId));
                resolve();
            }, 500);
        })
    );
}
