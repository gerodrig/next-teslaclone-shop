import { FC } from 'react';
import { SideMenu } from '../ui';
import { AdminNavBar } from '../admin';
import { Box, Typography } from '@mui/material';

interface AdminLayoutProps {
    title: string;
    subtitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: FC<AdminLayoutProps> = ({
    children,
    title,
    subtitle,
    icon,
}) => {
    return (
        <>
            <nav>
                <AdminNavBar />
            </nav>

            {/* SideBar */}
            <SideMenu />

            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px',
                }}>
                <Box display="flex" flexDirection="column">
                    <Typography variant='h1' component='h1'>
                        {icon}
                        {' '}
                        {title}
                    </Typography>
                    <Typography variant='h2' component='h2' sx={{ mb: 1}}>{ subtitle }</Typography>
                </Box>

                <Box className='fadeIn'>
                {children}

                </Box>
            </main>
        </>
    );
};
