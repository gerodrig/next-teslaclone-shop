import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { GridTable } from '../../../components/admin';
import { AdminLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import { IOrder, IUser } from '../../../interfaces';
import { formatCurrency } from '../../../utils';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Order Id',
        width: 250,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
        field: 'noProducts',
        headerName: 'Number of Products',
        align: 'center',
        width: 150,
    },
    {
        field: 'isPaid',
        headerName: 'Paid',
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid ? (
                <Chip variant="outlined" label="Paid" color="success" />
            ) : (
                <Chip variant="outlined" label="Pending" color="error" />
            );
        },
        width: 150,
    },
    { field: 'total', headerName: 'Total', align: 'right', width: 150 },
    {
        field: 'check',
        headerName: 'See Order',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a
                    href={`/admin/orders/${row.id}`}
                    target="_blank"
                    rel="noreferrer">
                    See Order
                </a>
            );
        },
        width: 250,
    },
];

const OrdersPage = () => {
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    console.log({ data });

    //convert date format 2022-04-09T00:28:21.172Z t0 DD/MM/YYYY
    const convertDate = (date: string): string => {
        const dateObj = new Date(date);
        
        return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    };


    if (!data && !error) return <FullScreenLoading />;

    //define grid to re-render when information changes

    const rows = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        date: convertDate(order.createdAt!),
        noProducts: order.numberOfItems,
        isPaid: order.isPaid,
        total: formatCurrency(order.total),
    }));
    return (
        <AdminLayout
            title="Orders"
            subtitle="Order Management"
            icon={<ConfirmationNumberOutlined />}>

            <GridTable columns={columns} rows={rows} />

        </AdminLayout>
    );
};

export default OrdersPage;
