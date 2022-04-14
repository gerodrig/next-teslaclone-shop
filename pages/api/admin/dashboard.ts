import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { DashboardSummaryRespoonse } from '../../../interfaces';
import { Order, Product, User } from '../../../models';

export default function handler(req: NextApiRequest, res: NextApiResponse<DashboardSummaryRespoonse | { message: string}>) {

    switch (req.method) {
        case 'GET':
            
            return getData(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }


}

const getData = async (req: NextApiRequest, res: NextApiResponse<DashboardSummaryRespoonse>) => {

    
    await db.connect();

    //get number of orders from database
    // const numberOfOrders = await Order.countDocuments();

    //get number of paid orders from database
    // const paidOrders = await Order.countDocuments({ isPaid: true });

    //get number of unpaid orders from database
    // const notPaidOrders = await Order.countDocuments({ isPaid: false });

    //get number of clients from database role = client
    // const numberOfClients = await User.countDocuments({ role: 'user' });

    //get number of products from database
    // const numberOfProducts = await Product.countDocuments();
// 
    //get number of products with 0 stock from database
    // const productsWithNoStock = await Product.countDocuments({ inStock: 0 });

    //get number of products with 10 or less stock from database
    // const lowInventory = await Product.countDocuments({ inStock: { $lte: 10 } });

    //fastest way to get all data
    const [ 
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoStock,
        lowInventory ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ isPaid: true }),
        User.countDocuments({ role: 'user' }),
        Product.countDocuments(),
        Product.countDocuments({ inStock: 0 }),
        Product.countDocuments({ inStock: { $lte: 10 } })
    ]);

    await db.disconnect();


    return res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoStock,
        lowInventory,
    })
}