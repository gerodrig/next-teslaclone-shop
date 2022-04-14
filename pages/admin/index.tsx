import {
    AccessTimeOutlined,
    AttachMoneyOutlined,
    CancelPresentationOutlined,
    CategoryOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    GroupOutlined,
    ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/';
import useSWR from 'swr';
import { DashboardSummaryRespoonse } from '../../interfaces';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
    //refresh data every 30 seconds with SWR
    const { data, error } = useSWR<DashboardSummaryRespoonse>(
        '/api/admin/dashboard',
        {
            refreshInterval: 30000,
        }
    );

    //usestate to create a 30 seconds counter
    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    if (!error && !data) {
        return (
            //center de box in the center of screen
            <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                height="50vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 3 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (error) {
        console.log(error);
        return (
            <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                height="50vh">
                <Typography variant="h6">
                    Error while loading the data...
                </Typography>
            </Box>
        );
    }




    const {
        numberOfOrders = 'N/A',
        paidOrders = 'N/A',
        notPaidOrders = 'N/A',
        numberOfClients = 'N/A',
        numberOfProducts = 'N/A',
        productsWithNoStock = 'N/A',
        lowInventory = 'N/A',
    } = data!;

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="General Statistics"
            icon={<DashboardOutlined />}>
            <Grid container spacing={2}>
                <SummaryTile
                    title={numberOfOrders}
                    subtitle="Total Orders"
                    icon={
                        <CreditCardOutlined
                            color="secondary"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={paidOrders}
                    subtitle="Paid Orders"
                    icon={
                        <AttachMoneyOutlined
                            color="success"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={notPaidOrders}
                    subtitle="Pending Orders"
                    icon={
                        <CreditCardOutlined
                            color="warning"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={numberOfClients}
                    subtitle="Customers"
                    icon={
                        <GroupOutlined color="primary" sx={{ fontSize: 40 }} />
                    }
                />

                <SummaryTile
                    title={numberOfProducts}
                    subtitle="Products"
                    icon={
                        <CategoryOutlined
                            color="warning"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={productsWithNoStock}
                    subtitle="Out Of Stock"
                    icon={
                        <CancelPresentationOutlined
                            color="error"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={lowInventory}
                    subtitle="Low Stock"
                    icon={
                        <ProductionQuantityLimitsOutlined
                            color="warning"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />

                <SummaryTile
                    title={refreshIn}
                    subtitle="Update in:"
                    icon={
                        <AccessTimeOutlined
                            color="secondary"
                            sx={{ fontSize: 40 }}
                        />
                    }
                />
            </Grid>
        </AdminLayout>
    );
};

export default DashboardPage;
