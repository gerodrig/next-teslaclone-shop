import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { useProducts } from '../../../hooks/useProducts';
import { ShopLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { ProductList } from '../../../components/products';

const MenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=men');

    //console.log(products);

    return (
        <ShopLayout
            title={'TesCloneShop - Men'}
            pageDescription={
                'Find the best products for Men from TesClone in the market'
            }>
            <Typography variant="h1" component="h1">
                Men
            </Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>
                Men Products
            </Typography>
            {isLoading ? (
                <FullScreenLoading />
            ) : (
                <ProductList products={products} />
            )}
        </ShopLayout>
    );
};

export default MenPage;
