import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { Chip, Grid, Link, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Full Name', width: 300 },

    {
        field: 'paid',
        headerName: 'Paid',
        description: 'Show information if order is paid',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return params.row.paid ? (
                <Chip color="success" label="Paid" variant="outlined" />
            ) : (
                <Chip color="error" label="Not Paid" variant="outlined" />
            );
        },
    },
    {
        field: 'order',
        headerName: 'Check Order',
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline="always">Go to Order</Link>
                </NextLink>
            );
        },
    },
];

interface HistoryPageProps {
    orders: IOrder[];
}

const HistoryPage: NextPage<HistoryPageProps> = ({orders}) => {
    //console.log(orders);


    const rows = orders.map((order, index) => { 
        return {
            id: index + 1,
            orderId: order._id,
            paid: order.isPaid,
            fullname: `${order.shippingAddress.name} ${order.shippingAddress.lastName}`,
        }
    });
    

    return (
        <ShopLayout
            title={'Orders History'}
            pageDescription={'Customer Orders History'}>
            <Typography variant="h1" component="h1">
                Orders History
            </Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        isRowSelectable={(params: GridRowParams) => false}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

//render orders history page on server side
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request tim

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    //get session from cookie to validate correct user for history page
    const session: any = await getSession({ req });

    //if we don't have a session, redirect to login page
    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            },
        };
    }
    const id = session.user._id;
    const orders = await dbOrders.getOrdersByUserId(id);

    return {
        props: {
            id,
            orders,
        },
    };
};

export default HistoryPage;
