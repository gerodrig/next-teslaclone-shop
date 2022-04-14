import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
    | {
          message: string;
      }
    | IProduct;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);

        default:
            return res.status(405).json({
                message: 'Bad Request',
            });
    }
}

const getProductBySlug = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    try {
        await db.connect();
        const products = await Product.findOne({ slug: req.query.slug })
            .select('title images price inStock slug -_id')
            .lean();

        if (!products) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }

        await db.disconnect();

        products.images = products.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
        });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};
