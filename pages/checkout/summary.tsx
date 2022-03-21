import NextLink from 'next/link';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Box,
    Button,
    Link,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';

const SummaryPage = () => {
    return (
        <ShopLayout
            title="Order Summary"
            pageDescription={'TesClone Order Summary'}>
            <Typography variant="h1" component="h1">
                Order Summary
            </Typography>

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

                            <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Delivery Address</Typography>
                                <NextLink href="/checkout/address" passHref>
                                    <Link underline='always'>Edit</Link>
                                </NextLink>
                            </Box>

                            <Typography>Gerardo Rodriguez</Typography>
                            <Typography>221 Palmer Avenue</Typography>
                            <Typography>Richmond Hill, L4C 4Z4</Typography>
                            <Typography>Ontario, Canada</Typography>
                            <Typography>+1 6476543728</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href="/cart" passHref>
                                    <Link underline='always'>Edit</Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth>
                                    Confirm Order
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;
