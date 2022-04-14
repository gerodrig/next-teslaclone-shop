import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDatabase } from '../../database';
import { Product, User, Order } from '../../models/';

type Data = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    //dont run if running in production
    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({
            message: 'This API route is not available in production',
        });
    }

    await db.connect();

    await User.deleteMany();
    await User.insertMany(seedDatabase.initialData.users);

    //insert seed data
    await Product.deleteMany();
    await Product.insertMany(seedDatabase.initialData.products);

    //delete all orders in database
    await Order.deleteMany();

    await db.disconnect();

    res.status(200).json({ message: 'Process completed successfully' });
}
