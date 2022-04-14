import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Box,
    Chip,
} from '@mui/material';

import { IOrder } from '../../../interfaces';
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from '../../../components/cart';
import { dbOrders } from '../../../database';
import { AdminLayout } from '../../../components/layouts';


//define order interface
interface AdminOrderViewerProps {
    order: IOrder;
}

const AdminOrderViewerPage: NextPage<AdminOrderViewerProps> = ({ order }) => {

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


    return (
        <AdminLayout
            title="Order Summary"
            subtitle={`OrderId: ${ order._id }`} icon={<ConfirmationNumberOutlined />}>

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
                                <Box display='flex' flexDirection='column'>                        
                                    { order.isPaid ? (
                                        <Chip
                                            sx={{ my: 2 }}
                                            label="Order Paid"
                                            variant="outlined"
                                            color="success"
                                            icon={<CreditScoreOutlined />}
                                        />
                                    ) : ( <Chip
                                        sx={{ my: 2 }}
                                        label="Pending Payment"
                                        variant="outlined"
                                        color="error"
                                        icon={<CreditCardOffOutlined />}
                                    />)}
                                </Box>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

//This page is to be rendered on server side to ensure order belongs to user
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
    req,
    query,
}) => {
    const { orderId = '' } = query;
    

    //import user session
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${orderId}`,
                permanent: false,
            },
        };
    }

    const order = await dbOrders.getOrderById(orderId.toString());

    if (!order) {
        return {
            redirect: {
                destination: `/admin/orders`,
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

export default AdminOrderViewerPage;
