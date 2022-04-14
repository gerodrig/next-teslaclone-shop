import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { useProducts } from '../../../hooks/useProducts';
import { ShopLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { ProductList } from '../../../components/products';

const WomenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');

    //console.log(products);

    return (
        <ShopLayout
            title={'TesCloneShop - Women'}
            pageDescription={
                'Find the best products for Women from TesClone in the market'
            }>
            <Typography variant="h1" component="h1">
                Women
            </Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>
                Women Products
            </Typography>
            {isLoading ? (
                <FullScreenLoading />
            ) : (
                <ProductList products={products} />
            )}
        </ShopLayout>
    );
};

export default WomenPage;
