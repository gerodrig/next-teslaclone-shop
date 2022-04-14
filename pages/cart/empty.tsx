import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartContext } from '../../context';
import { FullScreenLoading } from '../../components/ui';
const EmptyPage = () => {
    const { cart, isLoaded } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded && cart.length > 0) {
            router.replace('/cart/');
        }
    }, [cart, isLoaded, router]);

    if (isLoaded && cart.length > 0) {
        return <FullScreenLoading />;
    }

    return (
        <ShopLayout
            title="Empty Cart"
            pageDescription="No items added in shopping cart">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 200px)"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h6">Your cart is empty</Typography>
                    <NextLink href="/" passHref>
                        <Link typography="h4" color="secondary">
                            Return to shop
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    );
};

export default EmptyPage;
