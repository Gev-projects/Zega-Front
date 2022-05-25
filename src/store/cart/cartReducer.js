import { EMPTY_CART, CART_ADD_ITEM, CART_REMOVE_ITEM, CART_UPDATE_QUANTITIES, UPDATE_CART_DATA } from './cartActionTypes';

/**
 * @param {array} items
 * @param {object} product
 * @param {array} options
 * @return {number}
 */
function findItemIndex(items, product, options) {
    return items.findIndex((item) => {
        if (item.product.id !== product.id || item.options.length !== options.length) {
            return false;
        }

        for (let i = 0; i < options.length; i += 1) {
            const option = options[i];
            const itemOption = item.options.find((itemOption) => (
                itemOption.optionId === option.optionId && itemOption.valueId === option.valueId
            ));

            if (!itemOption) {
                return false;
            }
        }

        return true;
    });
}

function calcSubtotal(items) {
    return items.reduce((subtotal, item) => subtotal + item.total, 0);
}

function calcQuantity(items) {
    return items.reduce((quantity, item) => quantity + item.quantity, 0);
}

function calcTotal(subtotal, extraLines) {
    // return subtotal + extraLines.reduce((total, extraLine) => total + extraLine.price, 0);
    return subtotal
}

function addItem(state, product, options, quantity, CartItemID) {



    const cartItems = CartItemID.items.map(pr => {


        return {
            cartItemId: pr.id,
            productID: pr.product.id
        }
    })

    const itemIndex = findItemIndex(state.items, product, options);

    let newItems;
    let { lastItemId } = state;

    if (itemIndex === -1) {
        lastItemId += 1;
        newItems = [...state.items, {
            id: lastItemId,

            product: JSON.parse(JSON.stringify(product)),
            options: JSON.parse(JSON.stringify(options)),
            price: product.special_price || product.price,
            total: (product.special_price || product.price) * quantity,
            quantity,
            tax: 18,

        }];
    } else {
        const item = state.items[itemIndex];
        newItems = [
            ...state.items.slice(0, itemIndex),
            {
                ...item,

                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * (item.special_price || item.price),
            },
            ...state.items.slice(itemIndex + 1),
        ];
    }

    const subtotal = calcSubtotal(newItems);
    const total = calcTotal(subtotal, state.extraLines);

    return {
        ...state,
        lastItemId,
        subtotal,
        total,
        items: newItems,
        quantity: calcQuantity(newItems),
        cartItems: cartItems,
        tax:'18%'
    };
}

function removeItem(state, itemId, item) {

     const { items, cartItems } = state;

    const newCartItems = cartItems.filter(it => it.cartItemId !== item)
    const newItems = items.filter((item) => item.id !== itemId);

    const subtotal = calcSubtotal(newItems);
    const total = calcTotal(subtotal, state.extraLines);

    return {
        ...state,
        items: newItems,
        cartItems: newCartItems,
        quantity: calcQuantity(newItems),
        subtotal,
        total,
    };
}

function updateQuantities(state, quantities) {
    let needUpdate = false;

    const newItems = state.items.map((item) => {
        const quantity = quantities.find((x) => x.itemId === item.id && x.value !== item.quantity);

        if (!quantity) {
            return item;
        }

        needUpdate = true;

        return {
            ...item,
            quantity: quantity.value,
            total: quantity.value * item.price,
        };
    });

    if (needUpdate) {
        const subtotal = calcSubtotal(newItems);
        const total = calcTotal(subtotal, state.extraLines);

        return {
            ...state,
            items: newItems,
            quantity: calcQuantity(newItems),
            subtotal,
            total,
        };
    }

    return state;
}

/*
 * item example:
 * {
 *   id: 1,
 *   product: {...}
 *   options: [
 *     {optionId: 1, optionTitle: 'Color', valueId: 1, valueTitle: 'Red'}
 *   ],
 *   price: 250,
 *   quantity: 2,
 *   total: 500
 * }
 * extraLine example:
 * {
 *   type: 'shipping',
 *   title: 'Shipping',
 *   price: 25
 * }
 */
const initialState = {
    lastItemId: 0,
    quantity: 0,
    items: [],
    subtotal: 0,
    // extraLines: [ // shipping, taxes, fees, .etc
    // {
    //     type: 'shipping',
    //     title: 'Shipping',
    //     price: 25,
    // },
    // {
    //     type: 'tax',
    //     title: 'Tax',
    //     price: 0,
    // },
    // ],
    total: 0,
};

export default function cartReducer(state = initialState, action) {

    switch (action.type) {

        case EMPTY_CART:

        case CART_ADD_ITEM:
            return addItem(state, action.product, action.options, action.quantity, action.cartItems);

        case UPDATE_CART_DATA:
            console.log(action)
                return {
                  ...state,
                      ...action.payload
                }
        case CART_REMOVE_ITEM:
            return removeItem(state, action.itemId, action.item);

        case CART_UPDATE_QUANTITIES:
            return updateQuantities(state, action.quantities);

        default:
            return state;
    }
}
