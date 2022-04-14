import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import { Order, Product } from '../../../models';

type Data =
    | {
          message: string;
      }
    | IOrder;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);

        default:
            return res.status(200).json({ message: 'Example Order' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    //check that user is authenticated
    const session: any = await getSession({ req });

    if (!session) {
        return res
            .status(401)
            .json({ message: 'You must be logged in to create an order' });
    }

    //create an array with the order items
    const productIds = orderItems.map((item) => item._id);

    //connect to database
    await db.connect();

    //check that the order is valid vs our database and save it
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

    try {
        //console.log(orderItems);
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(
                (product) => product._id.toString() === current._id
            )?.price;

            if (!currentPrice) {
                throw new Error('Invalid product');
            }

            return prev + currentPrice * current.quantity;
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backEndTotal = subTotal + subTotal * taxRate;

        if (total !== backEndTotal) {
            throw new Error('Invalid total');
        }

        //create the order as amount was checked
        const userId = session.user._id;

        const newOrder = new Order({
            ...req.body,
            isPaid: false,
            user: userId,
        });

        //round calculation to 2 decimals
        newOrder.tax = Math.round( newOrder.total * 100 ) / 100;
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;

        await newOrder.save();

        await db.disconnect();
        return res.status(201).json( newOrder );
    } catch (error: any) {
        //if error disconecct from database and return error
        await db.disconnect();
        console.log(error);
        return res
            .status(400)
            .json({ message: error.message || 'Error creating order' });
    }

    //return res.status(201).json(req.body);
};
