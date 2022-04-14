import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { useProducts } from '../../../hooks/useProducts';
import { ShopLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { ProductList } from '../../../components/products';

const KidsPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');

    //console.log(products);

    return (
        <ShopLayout
            title={'TesCloneShop - Kids'}
            pageDescription={
                'Find the best products for Kids from TesClone in the market'
            }>
            <Typography variant="h1" component="h1">
                Kids
            </Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>
                Kids Products
            </Typography>
            {isLoading ? (
                <FullScreenLoading />
            ) : (
                <ProductList products={products} />
            )}
        </ShopLayout>
    );
};

export default KidsPage;
