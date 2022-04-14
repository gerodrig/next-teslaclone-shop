import { IUser } from './';
import { ISize } from './products';

export interface IOrder {
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    shippingAddress: UserAddress;
    billingAddress: UserAddress;
    paymentResult?: string;
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    isPaid: boolean;
    paidAt?: string;
    createdAt?: string;
    updatedAt?: string;
    transactionId?: string;
}


export interface IOrderItem {
    _id: string;
    title: string;
    size: ISize;
    quantity: number;
    slug: string;
    image: string;
    price: number;
    gender: 'men'|'women'|'kids'|'unisex';
}

export interface UserAddress {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
}