import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
    | {
          message: string;
      }
    | IProduct[]
    | IProduct;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res);
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();

    //get products from database
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await db.disconnect();

    // we need to update the images. Images won't be stored in server
    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`;
        });
        return product;
    });

    res.status(200).json(updatedProducts);
};

const updateProduct = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Prodcuct ID is not valid' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: '2 images are required' });
    }

    try {
        await db.connect();

        const product = await Product.findById(_id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //TODO: delete image from host server
        //https://res.cloudinary.com/gerodrig18/image/upload/v1649886818/yeqbew9q7umf6hidc0ya.webp
        product.images.forEach( async(image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring( image.lastIndexOf('/') + 1).split('.');
                //console.log({image, fileId, extension});
                await cloudinary.uploader.destroy(fileId );
            }
        });

        //update product
        await product.update(req.body);
        await db.disconnect();

        return res.status(200).json(product!);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createProduct = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({ message: '2 images are required' });
    }

    //TODO: we need to update the images. Images won't be stored in server localhost:3000/products/123.jpg

    try {
        await db.connect();

        const productInDB = await Product.findOne({ slug: req.body.slug });

        if (productInDB) {
            await db.disconnect();
            return res.status(400).json({ message: 'Product already exists' });
        }

        const product = new Product(req.body);
        await product.save();

        await db.disconnect();

       return  res.status(201).json(product);
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
