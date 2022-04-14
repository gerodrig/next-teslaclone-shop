import { ICartProduct, UserAddress } from '../../interfaces';
import { CartState } from './';

type CartActionType =
| { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
| { type: '[Cart] - Update Products in Cart', payload: ICartProduct[] }
| { type: '[Cart] - Update Cart Quantity', payload: ICartProduct }
| { type: '[Cart] - Remove product in cart', payload: ICartProduct }
| { type: '[Cart] - LoadAddress from Cookies', payload: UserAddress }
| { type: '[Cart] - Update Address', payload: UserAddress }
| { 
    type: '[Cart] - Update Order Summary', 
    payload: {
        numberOfProducts: number;
        subTotal: number;
        HST: number;
        total: number;
    } 
}
| { type: '[Cart] - Order Complete' }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            };
        case '[Cart] - Update Products in Cart':     
            return {
                ...state,
                cart: [...action.payload]
            };
        case '[Cart] - Update Cart Quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id)  return product;
                    if (product.size !== action.payload.size) return product;
                    
                    return action.payload;
                })
            };
        case '[Cart] - Remove product in cart':
            return {
            ...state,
            cart: state.cart.filter(product => product._id !== action.payload._id || product.size !== action.payload.size)
            };
            case '[Cart] - Update Order Summary':
                return {
                    ...state,
                    ...action.payload
                };
        case '[Cart] - LoadAddress from Cookies':
        case '[Cart] - Update Address':
            return {
                ...state,
                shippingAddress: action.payload,
                billingAddress: action.payload,
            }
        case '[Cart] - Order Complete':
            return {
                ...state,
                cart: [],
                numberOfProducts: 0,
                subTotal: 0,    
                HST: 0,
                total: 0,
            }
        default:
            return state;
    }

};