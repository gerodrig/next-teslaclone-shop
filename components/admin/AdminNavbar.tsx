import { useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';

import { UiContext } from '../../context';

export const AdminNavBar = () => {
    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display="flex" alignItems="center">
                        <Typography variant="h6">TesClone |</Typography>
                        <Typography sx={{ ml: 0.5 }}> Shop </Typography>
                    </Link>
                </NextLink>

                {/* flex */}
                <Box flex={1} />

                <Button onClick={() => toggleSideMenu()}>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
