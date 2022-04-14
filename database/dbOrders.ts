import { isValidObjectId } from 'mongoose';
import { IOrder } from "../interfaces";
import { db } from '.';
import Order from '../models/Order';

export const getOrderById = async (id: string): Promise<IOrder | null > => {
    
    if(!isValidObjectId(id)){
        return null;
    }

    await db.connect();
    //get order from database
    const order = await Order.findById(id).lean();

    await db.disconnect();

    if(!order){
        return null;
    }

    return JSON.parse(JSON.stringify(order));
}


//function to get all orders for a specific user
export const getOrdersByUserId = async (userId: string): Promise<IOrder[] | []> => {

    if(!isValidObjectId(userId)){
        return [];
    }

    await db.connect();
    //get order from database
    const orders = await Order.find({user: userId}).lean();

    await db.disconnect();

    if(!orders){
        return [];
    }

    return JSON.parse(JSON.stringify(orders));



}