import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { PayPalButtons } from '@paypal/react-paypal-js';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Box,
    Chip,
    CircularProgress,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import {
    CreditCardOffOutlined,
    CreditScoreOutlined,
} from '@mui/icons-material';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';

//define order interface
interface OrderPageProps {
    order: IOrder;
}

export type OrderResponseBody = {
    id: string;
    status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
    const router = useRouter();
    //usestate to show the loading state
    const [isPaying, setIsPaying] = useState(false);
    const {
        shippingAddress,
        orderItems,
        numberOfItems: numberOfProducts,
        subTotal,
        tax: HST,
        total,
    } = order;
    const {
        name,
        lastName,
        address,
        address2,
        postalCode,
        city,
        country,
        phone,
    } = shippingAddress;

    const summaryDetails = {
        numberOfProducts,
        subTotal,
        HST,
        total,
    };

    const onOrderCompleted = async ( details: OrderResponseBody ) => {
        if(details.status !== "COMPLETED") {
            return alert("Order failed to complete");
        }
        setIsPaying(true);

        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id,
            });

            router.reload();
        } catch (error) {
            console.log(error);
            alert('Error');
            setIsPaying(false);            
        }
            
    }
    return (
        <ShopLayout
            title="Order Summary"
            pageDescription={'TesClone Order Summary'}>
            <Typography variant="h1" component="h1">
                Order: {order._id}
            </Typography>

            {order.isPaid ? (
                <Chip
                    sx={{ my: 2 }}
                    label="Order Paid"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                />
            ) : (
                <Chip
                    sx={{ my: 2 }}
                    label="Payment pending"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                />
            )}

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    {/* Cart List */}
                    <CartList products={orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">
                                Summary ({order.numberOfItems}{' '}
                                {order.numberOfItems > 1 ? 'items' : 'item'})
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1">
                                    Delivery Address
                                </Typography>
                            </Box>

                            <Typography>
                                {name} {lastName}
                            </Typography>
                            <Typography>
                                {address} {address2 ? `, ${address2}` : ''}
                            </Typography>
                            <Typography>
                                {city}, {postalCode}
                            </Typography>
                            <Typography>{country}</Typography>
                            <Typography>+1 {phone}</Typography>

                            <Divider sx={{ my: 1 }} />
                            <OrderSummary summaryDetails={summaryDetails} />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {/* process payment */}

                                <Box display='flex' justifyContent='center' className='fadeIn' sx={{ display: isPaying ? 'flex' : 'none'}}>
                                    <CircularProgress />
                                </Box> 

                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1}} flexDirection='column'>                        
                                { order.isPaid ? (
                                    <Chip
                                        sx={{ my: 2 }}
                                        label="Order Paid"
                                        variant="outlined"
                                        color="success"
                                        icon={<CreditScoreOutlined />}
                                    />
                                ) : (
                                    <PayPalButtons 
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: `${order.total}`,
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order!.capture().then((details) => {
                                            onOrderCompleted(details);
                                            // const name = details.payer.name!.given_name;
                                            //alert(`Transaction completed by ${name}`);
                                        });
                                    }}
                                    
                                    /> 
                                )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

//This page is to be rendered on server side to ensure order belongs to user
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
    req,
    query,
}) => {
    const { id = '' } = query;

    //import user session
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            },
        };
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            },
        };
    }

    //check if order belongs to user
    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            order,
        },
    };
};

export default OrderPage;
