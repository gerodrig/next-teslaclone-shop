import NextLink from 'next/link';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Link } from '@mui/material';
import {
    GridCellParams,
    GridColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import useSWR from 'swr';
import { GridTable } from '../../../components/admin';
import { AdminLayout } from '../../../components/layouts';
import { FullScreenLoading } from '../../../components/ui';
import clsx from 'clsx';

import { IProduct } from '../../../interfaces';
import { formatCurrency } from '../../../utils';

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Photo',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a
                    href={`/product/${row.slug}`}
                    target="_blank"
                    rel="noreferrer">
                    <CardMedia
                        component="img"
                        className="fadeIn"
                        alt={`${row.title}`}
                        image={row.img}
                    />
                </a>
            );
        },
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 300,
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline="always">{row.title}</Link>
                </NextLink>
            );
        },
    },
    { field: 'gender', headerName: 'Gender' },
    { field: 'type', headerName: 'Type' },
    {
        field: 'inStock',
        headerName: 'Stock',
        align: 'center',
        cellClassName: (params: GridCellParams<number>) =>
            clsx('super-app', {
                negative: params.value === 0,
                warning: params.value <= 10,
                positive: params.value > 10,
            }),
    },
    { field: 'price', headerName: 'Price (CAD)' },
    { field: 'sizes', headerName: 'Sizes', width: 200 },
];
//price column formatter
const sx = {
    height: 300,
    width: 1,
    '& .super-app.warning': {
        backgroundColor: 'rgba(224, 183, 60, 0.55)',
        color: '#1a3e72',
        fontWeight: '600',
    },
    '& .super-app.positive': {
        backgroundColor: 'rgba(157, 255, 118, 0.49)',
        color: '#1a3e72',
        fontWeight: '600',
    },
    '& .super-app.negative': {
        backgroundColor: '#d47483',
        color: '#1a3e72',
        fontWeight: '600',
    },
};

const ProductsPage = () => {
    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if (!data && !error) return <FullScreenLoading />;

    const rows = data!.map((product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: formatCurrency(product.price, ''),
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));
    return (
        <AdminLayout
            title={`Products (${data?.length})`}
            subtitle="Products Management"
            icon={<CategoryOutlined />}>

            <Box display='flex' justifyContent='end' sx={{mb: 2}}>
                <Button startIcon={ <AddOutlined />} color='secondary' href='/admin/products/new'>
                    Create Product
                </Button>
            </Box>

            <Box sx={sx}>
                <GridTable columns={columns} rows={rows} />
            </Box>
        </AdminLayout>
    );
};

export default ProductsPage;
