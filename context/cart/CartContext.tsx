import { createContext } from 'react';
import { ICartProduct, UserAddress } from '../../interfaces';

interface UIContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfProducts: number;
    subTotal: number;
    HST: number;
    total: number;

    shippingAddress?: UserAddress;
    billingAddress?: UserAddress;

    //Methods
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (address: UserAddress) => void;

    createOrder: () => Promise<{hasError: boolean; message: string;}>
}

export const CartContext = createContext({} as UIContextProps);
