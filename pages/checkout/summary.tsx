import { useContext, useMemo, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Cookies from 'js-cookie';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Box,
    Button,
    Link,
    Chip,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { countries } from '../../utils';
import { useRouter } from 'next/router';

const SummaryPage = () => {
    const router = useRouter();
    const { shippingAddress, numberOfProducts, createOrder } =
        useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!Cookies.get('name')) {
            router.push('/checkout/address');
        }
    }, [router]);

    //create order handler
    const onCreateOrder = async () => {
        //set isPosting to true when confirm order is clicked
        setIsPosting(true);

        const { hasError, message } = await createOrder();

        if (hasError) {
            setIsPosting(false);
            return setErrorMessage(message);
        }

        //redirect to order confirmation page
        router.replace(`/orders/${message}`);
    };

    if (!shippingAddress) {
        return <></>;
    }

    const { name, lastName, address, postalCode, city, country, phone } =
        shippingAddress;

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
                                {`Summary (${numberOfProducts} item${
                                    numberOfProducts > 1 ? 's' : ''
                                })`}
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

                            <Typography>{`${name} ${lastName}`}</Typography>
                            <Typography>{address}</Typography>
                            <Typography>{`${city}, ${postalCode}`}</Typography>
                            <Typography>
                                {
                                    countries.find((c) => c.code === country)
                                        ?.name
                                }
                            </Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Link underline="always">Edit</Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box
                                sx={{ mt: 3 }}
                                display="flex"
                                flexDirection="column">
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}>
                                    Confirm Order
                                </Button>

                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{
                                        display: errorMessage ? 'flex' : 'none',
                                        mt: 2,
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;
