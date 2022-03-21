import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts/ShopLayout';

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
                <NextLink href={`/orders/${params.row.id}`} passHref>
                    <Link underline="always">Go to Order</Link>
                </NextLink>
            );
        },
    },
];

const rows = [
    { id: 1, paid: true, fullname: 'Gerardo Rodriguez' },
    { id: 2, paid: false, fullname: 'Mimi Rodriguez'},
    { id: 3, paid: true, fullname: 'Benito Cardenas' },
    { id: 4, paid: true, fullname: 'Yayna Martinez' },
];

const HistoryPage = () => {
    return (
        <ShopLayout
            title={'Orders History'}
            pageDescription={'Customer Orders History'}>
            <Typography variant="h1" component="h1">
                Orders History
            </Typography>

            <Grid container>
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

export default HistoryPage;
