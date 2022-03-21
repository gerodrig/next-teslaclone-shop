import NextLink from 'next/link';

import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
const EmptyPage = () => {
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
