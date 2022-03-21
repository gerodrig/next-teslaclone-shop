import NextLink from 'next/link';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Box,
    Link,
    Chip,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import {
    CreditCardOffOutlined,
    CreditScoreOutlined,
} from '@mui/icons-material';

const OrderPage = () => {
    return (
        <ShopLayout
            title="Order Summary 3243215324"
            pageDescription={'TesClone Order Summary'}>
            <Typography variant="h1" component="h1">
                Order: 3243215324
            </Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label="Payment pending"
                variant="outlined"
                color="error"
                icon={<CreditCardOffOutlined />}
            /> */}

            <Chip
                sx={{ my: 2 }}
                label="Order Paid"
                variant="outlined"
                color="success"
                icon={<CreditScoreOutlined />}
            />

            <Grid container>
                <Grid item xs={12} sm={7}>
                    {/* Cart List */}
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">
                                Summary (3 items)
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1">
                                    Delivery Address
                                </Typography>
                                <NextLink href="/checkout/address" passHref>
                                    <Link underline="always">Edit</Link>
                                </NextLink>
                            </Box>

                            <Typography>Gerardo Rodriguez</Typography>
                            <Typography>221 Palmer Avenue</Typography>
                            <Typography>Richmond Hill, L4C 4Z4</Typography>
                            <Typography>Ontario, Canada</Typography>
                            <Typography>+1 6476543728</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Link underline="always">Edit</Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* TODO:process payment */}
                                <h1>Pay</h1>

                                <Chip
                                    sx={{ my: 2 }}
                                    label="Order Paid"
                                    variant="outlined"
                                    color="success"
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default OrderPage;
