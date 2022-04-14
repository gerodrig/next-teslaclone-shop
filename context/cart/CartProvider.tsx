import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, UserAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfProducts: number;
    subTotal: number;
    HST: number;
    total: number;

    shippingAddress?: UserAddress;
    billingAddress?: UserAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfProducts: 0,
    subTotal: 0,
    HST: 0,
    total: 0,
    shippingAddress: undefined,
};

export const CartProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    //effect read from cookie and if valid, add to cart
    useEffect(() => {
        //try catch to prevent error if cookie is not set or manipulated
        try {
            const cartCookie = Cookie.get('cart');
            if (cartCookie) {
                const cart: ICartProduct[] = JSON.parse(cartCookie);
                dispatch({
                    type: '[Cart] - LoadCart from cookies | storage',
                    payload: cart,
                });
            }
        } catch (error) {
            dispatch({
                type: '[Cart] - LoadCart from cookies | storage',
                payload: [],
            });
        }
    }, []);

    //check if cart is changed so we can save in cookies
    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    //TODO: add shipping and billing address from the state
    //billing address is the same as billing address
    useEffect(() => {
        if (Cookies.get('name') && Cookies.get('phone')) {
            const address = {
                name: Cookies.get('name') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                postalCode: Cookies.get('postalCode') || '',
                city: Cookies.get('city') || '',
                country: Cookies.get('country') || '',
                phone: Cookies.get('phone') || '',
                address2: Cookies.get('address2') || '',
            };

            dispatch({
                type: '[Cart] - LoadAddress from Cookies',
                payload: address,
            });
        }
    }, []);

    //update order Summary
    useEffect(() => {
        const numberOfProducts = state.cart.reduce(
            (pre, cur) => (pre += cur.quantity),
            0
        );
        const subTotal = state.cart.reduce(
            (pre, cur) => (pre += cur.price * cur.quantity),
            0
        );
        const rateHST = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfProducts,
            subTotal,
            HST: rateHST * subTotal,
            total: subTotal + rateHST * subTotal,
        };

        dispatch({
            type: '[Cart] - Update Order Summary',
            payload: orderSummary,
        });
    }, [state.cart]);

    const addProductToCart = (product: ICartProduct) => {
        // //check if product already in cart
        // const productIncart = state.cart.some((p) => p._id === product._id);
        // if (!productIncart) {
        //     return dispatch({
        //         type: '[Cart] - Update Products in Cart',
        //         payload: [...state.cart, product],
        //     });
        // }

        // //const check if product already in cart but with different size
        // const productInCartDifferentSize = state.cart.some(
        //     (p) => p._id === product._id && p.size === product.size
        // );
        // if (!productInCartDifferentSize) {
        //     return dispatch({
        //         type: '[Cart] - Update Products in Cart',
        //         payload: [...state.cart, product],
        //     });
        // }

        // //add quantity to product in cart
        // const updateProductsInCart = state.cart.map((p) => {
        //     if (p._id !== product._id) return p;
        //     if (p.size !== product.size) return p;

        //     //update quantity
        //     p.quantity += product.quantity;
        //     return p;
        // });

        // return dispatch({
        //     type: '[Cart] - Update Products in Cart',
        //     payload: updateProductsInCart,
        // });

        //check if product already in cart
        const productIncart = state.cart.find(
            (p) => p._id === product._id && p.size === product.size
        );

        //filter out product from cart
        const newCart: ICartProduct[] = state.cart.filter(
            (p) => !(p._id === product._id && p.size === product.size)
        );

        if (productIncart) {
            //increase quantity only for product that is already in cart
            let quantity =
                product.quantity > product.inStock
                    ? product.inStock
                    : product.quantity;
            quantity = quantity > 10 ? 10 : quantity;
            const newProduct: ICartProduct = {
                ...product,
                quantity,
            };

            //dispatch mutated product in cart
            return dispatch({
                type: '[Cart] - Update Products in Cart',
                payload: [...newCart, newProduct],
            });
        }

        //dispatch new product to cart
        return dispatch({
            type: '[Cart] - Update Products in Cart',
            payload: [...newCart, product],
        });
    };

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Update Cart Quantity', payload: product });
    };

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    };

    const updateAddress = (address: UserAddress) => {
        //save information to cookies

        Cookies.set('name', address.name);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('postalCode', address.postalCode);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);
        Cookies.set('address2', address.address2 || '');

        dispatch({ type: '[Cart] - Update Address', payload: address });
    };

    //create order function
    const createOrder = async (): Promise<{
        hasError: boolean;
        message: string;
    }> => {
        if (!state.shippingAddress) {
            throw new Error('Shipping address is required');
        }

        const body: IOrder = {
            orderItems: state.cart.map((p) => ({
                ...p,
                size: p.size!,
            })),
            shippingAddress: state.shippingAddress,
            billingAddress: state.shippingAddress,
            numberOfItems: state.numberOfProducts,
            tax: state.HST,
            subTotal: state.subTotal,
            total: state.total,
            isPaid: false,
        };

        try {
            const { data } = await tesloApi.post('/orders', body);

            //Dispatch action to clear cart
            dispatch({ type: '[Cart] - Order Complete' });

            return {
                hasError: false,
                message: data._id!,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                };
            }
            return {
                hasError: true,
                message: 'Something went wrong',
            };
        }
    };

    return (
        <CartContext.Provider
            value={{
                ...state,

                //Methods
                addProductToCart,
                updateCartQuantity,
                removeCartProduct,
                updateAddress,
                createOrder,
            }}>
            {children}
        </CartContext.Provider>
    );
};
