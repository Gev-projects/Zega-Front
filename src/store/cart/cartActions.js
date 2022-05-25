import { toast } from 'react-toastify';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_UPDATE_QUANTITIES, UPDATE_CART_DATA } from './cartActionTypes';
import { url } from '../../helper';
import ReactPixel from 'react-facebook-pixel';
import React from 'react';
import { FormattedMessage } from "react-intl";

// const translations = {
//     product: {
//         hy: 'Ապրանք',
//         ru: 'товар',
//         en: "Product"
//     },
//     added: {
//         hy: 'Ավելացվել է զամբյուղ',
//         ru: 'добавлен в корзину',
//         en: "Product added to cart"
//     },
//     warningQty:{
//         hy: 'Հասանելի առավելագույն քանակը ',
//         ru: 'добавлен в корзину',
//         en: "The maximum available quantity is"
//     }


// }

export function cartAddItemSuccessAfterLogin(product, options = [], quantity = 1, cartItems, locale) {
    return {
        type: CART_ADD_ITEM,
        product,
        options,
        quantity,
        cartItems
    };

}
export function cartAddItemSuccess(product, options = [], quantity = 1, cartItems, locale) {
    toast.success(<FormattedMessage id="add-cart" defaultMessage={`Product ${product.name ? product.name : ''} added to cart`}/>);
  

    return {
        type: CART_ADD_ITEM,
        product,
        options,
        quantity,
        cartItems
    };
}

export function cartUpdateData(payload) {
    return {
        type: UPDATE_CART_DATA,
        payload
    };
}
export function cartRemoveItemSuccess(itemId, item) {
    return {
        type: CART_REMOVE_ITEM,
        itemId,
        item
    };
}

export function cartUpdateQuantitiesSuccess(quantities) {
    return {
        type: CART_UPDATE_QUANTITIES,
        quantities,
    };
}

export function cartAddItemAfterLogin(product, options = [], quantity = 1, cartToken, customer, locale, dispatch, data) {
    const as = () => {
        dispatch(cartAddItemSuccessAfterLogin(product, options, quantity, data.data, locale))
    }
    return as();
}
export function cartAddItem(product, options = [], quantity = 1, cartToken, customer, locale) {

    let body;
    if (customer && customer.token) {
        body = {
            api_token: cartToken.cartToken,
            product_id: product.id,
            quantity: quantity,
            token: customer.token
        }

    } else {
        body = {
            api_token: cartToken.cartToken,
            product_id: product.id,
            quantity: quantity
        }

    }

    return (dispatch) => (
        fetch(url + '/api/checkout/cart/add/' + product.id, {
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(body),
        })
            .then(res => res.json())
            .then(re => {
                console.log(re);
                if (!re.error) {
                    ReactPixel.trackCustom('Add To Cart')
                    dispatch(cartAddItemSuccess(product, options, quantity, re.data, locale));
                } else {
                    if(body.quantity>=product.qty){
                        toast.warning(
                        <FormattedMessage id="add-cart-warning" defaultMessage={`The maximum available quantity is ${product.qty}`}/>  
                        );
                    }
                    console.log(re.error.message)
                }
            })

    )
}


export function cartRemoveItemAfterLogin(itemId, item, dispatch) {

    return dispatch(cartRemoveItemSuccess(itemId, item))

}
export function cartRemoveItem(itemId, item, cartToken, customer) {

    return (dispatch) => (
        fetch(`${url}/api/checkout/cart/remove-item/${item}?api_token=${cartToken.cartToken}${customer.token ? '&token=' + customer.token : ''}`)
            .then(res => res.json())
            .then(responce => {
                responce ? dispatch(cartRemoveItemSuccess(itemId, item, responce.data)) : console.error(responce.error)

            })
            .catch(error => console.error(error))

    );
}

export function cartUpdateQuantities(quantities, cartItems, customerToken, ApiToken) {
    let qty = {};
    let options;


    quantities.map(upitems => {

        qty[upitems.cartItem] = upitems.value

    })

    const body = {
        token: customerToken,
        api_token: ApiToken.cartToken,
        qty: qty
    }


    if (customerToken.token) {
        options = {

            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: customerToken.token,
                api_token: ApiToken.cartToken,
                qty: qty
            })
        }
    } else {

        options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_token: ApiToken.cartToken,
                qty: qty
            })
        }

    }

    return (dispatch) => (
        fetch(url + '/api/checkout/cart/update', options)
            .then(res => res.json())
            .then(responce => {
                responce.data ? dispatch(cartUpdateQuantitiesSuccess(quantities)) : console.error(responce.error)

            })
            .catch(error => console.error(error))

    );

}
