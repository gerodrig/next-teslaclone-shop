import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Input,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from '@mui/material';
import {
    AccountCircleOutlined,
    AdminPanelSettings,
    CategoryOutlined,
    ConfirmationNumberOutlined,
    EscalatorWarningOutlined,
    FemaleOutlined,
    LoginOutlined,
    MaleOutlined,
    SearchOutlined,
    VpnKeyOutlined,
} from '@mui/icons-material';

import { AuthContext, UiContext } from '../../context';
import { DashboardOutlined } from '@mui/icons-material';

export const SideMenu = () => {
    const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');

    //function to handle the search
    const onSearchTerm = () => {
        //veryfy if the search term is not empty, do nothing if it is empty
        if (searchTerm.trim().length === 0) return;

        navigateTo(`/search/${searchTerm}`);
    };

    //call in women kids and men
    const navigateTo = (url: string) => {
        router.push(url);

        toggleSideMenu();
    };

    return (
        <Drawer
            open={isMenuOpen}
            anchor="right"
            sx={{
                backdropFilter: 'blur(2px)',
                transition: 'all 0.5s ease-out',
            }}
            onClose={toggleSideMenu}>
            <Box sx={{ width: 250, paddingTop: 5 }}>
                <List>
                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && onSearchTerm()
                            }
                            type="text"
                            placeholder="Search..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={onSearchTerm}>
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>


                        {/* //TODO: create a singedin or singed out panel */}
                    {isLoggedIn && (
                        <>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountCircleOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Profile'} />
                            </ListItem>

                            <ListItem button onClick={() => navigateTo('/orders/history')} >
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'My Orders'} />
                            </ListItem>
                        </>
                    )}

                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/men')}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Men'} />
                    </ListItem>

                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/women')}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Women'} />
                    </ListItem>

                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/kids')}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Kids'} />
                    </ListItem>

                    {!isLoggedIn ? (
                        <ListItem button onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }>
                            <ListItemIcon>
                                <VpnKeyOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Sign in'} />
                        </ListItem>
                    ) : (
                        <ListItem button onClick={logoutUser}>
                            <ListItemIcon>
                                <LoginOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Exit'} />
                        </ListItem>
                    )}

                    {/* Create an admin panel component */}
                    {/* Admin */}
                    {isLoggedIn && user?.role.includes('admin') && (
                        <>
                            <Divider />

                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={ () => navigateTo('/admin/')}>
                                <ListItemIcon>
                                    <DashboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo('/admin/orders')}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Orders'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo('/admin/products')}>
                                <ListItemIcon>
                                    <CategoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Products'} />
                            </ListItem>

                            <ListItem button onClick={ () => navigateTo('/admin/users')}>
                                <ListItemIcon>
                                    <AdminPanelSettings />
                                </ListItemIcon>
                                <ListItemText primary={'Users'} />
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
        </Drawer>
    );
};
