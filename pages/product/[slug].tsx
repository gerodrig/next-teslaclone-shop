import { useState, useContext } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { CartContext } from '../../context/cart/CartContext';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { IProduct, ICartProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database/';

interface ProductPageProps {
    product: IProduct;
}

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {

const router = useRouter();

const {addProductToCart} = useContext(CartContext);

const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
_id: product._id,
image: product.images[0],
inStock: product.inStock,
price: product.price,
size: undefined,
slug: product.slug,
title: product.title,
gender: product.gender,
quantity: 1,
})


const onSelectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
        ...currentProduct,
        size
    }))
}

const onUpdatedQuantity = (quantity: number) => {
    setTempCartProduct( currentProduct => ({
        ...currentProduct,
        quantity
    }))
}

const onAddProduct = () => {
    if( !tempCartProduct.size ) return;

    //call context action to add to cart
    addProductToCart(tempCartProduct);

    //navigate to cart
    router.push('/cart');
}
    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    {/* Slideshow */}
                    <ProductSlideshow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        {/* Titles */}
                        <Typography variant="h1" component="h1">
                            {product.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="h2">{`$${product.price}`}</Typography>

                        {/* Quantity */}
                        <Box sx={{ my: 2 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}>
                                Quantity
                            </Typography>
                            {/* ItemCounter */}
                            <ItemCounter 
                            currentValue={tempCartProduct.quantity}
                            updatedQuantity={ onUpdatedQuantity }
                            maxValue={product.inStock > 10 ? 10 : product.inStock } //Maximum 10
                            />
                            <SizeSelector
                                sizes={product.sizes}
                                selectedSize={ tempCartProduct.size }
                                onSelectedSize={ onSelectedSize }
                            />
                        </Box>

                        {/* Add to Cart */}
                        {product.inStock > 0 ? (
                            <Button color="secondary" className="circular-btn" onClick={ onAddProduct }>
                                { tempCartProduct.size ? 'Add to Cart' : 'Select Size' }
                            </Button>
                        ) : (
                            <Chip
                                label="Out of Stock"
                                color="error"
                                variant="outlined"
                            />
                        )}

                        {/* Description */}
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}>
                                Description
                            </Typography>
                            <Typography variant="body2">
                                {product.description}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

//get Server side props
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

//EXAMPLE OF SERVER SIDE RENDERING WONT BE USED AS STATIC CONTECT IS PREFERRED FOR SEO
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const { slug = '' } = params as { slug: string };

//     const product = await dbProducts.getProductBySlug(slug);

//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             product,
//         },
//     };
// };

//GET STATIC PATHS INCLUDE BLOCKING IN SETTINGS
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const productSlugs = await dbProducts.getAllProductSlugs();

    return {
        paths: productSlugs.map(({ slug }) => ({ params: { slug } })),
        // [
        //     {
        //         params: {

        //         }
        //     }
        // ],
        fallback: 'blocking',
    };
};

//GET STATIC PROPS AND REVALIDATE EVERY 24 HOURS

export const getStaticProps: GetStaticProps = async ({ params }) => {
    //get the slug from the parameters.
    const { slug = '' } = params as { slug: string };

    //call dbProducts.getProductBySlug to fetch slug from database
    const product = await dbProducts.getProductBySlug(slug);

    //in case there is no product with the slug we route the user to root
    if (!product) {
        return {
            redirect: {
                destination: '/', //route where to redirect
                permanent: false, //permanent in false because product may be found in future
            },
        };
    }
    //in case ther is a product we return the product and we will revalidate in 24 hours
    return {
        props: {
            product,
        }, //revalidate 1 day
        revalidate: 86400,
    };
};

export default ProductPage;
