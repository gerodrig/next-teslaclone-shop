import NextLink from 'next/link';
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

export const Navbar = () => {
    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant="h6">TesClone |</Typography>
                        <Typography sx={{ ml: 0.5 }}> Shop </Typography>
                    </Link>
                </NextLink>

                {/* flex */}
                <Box flex={ 1 } />

                <Box sx={{ display: {xs: 'none', sm: 'block'}}}>
                    <NextLink href="/category/men" passHref>
                        <Link>
                        <Button>Men</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women" passHref>
                        <Link>
                        <Button>Women</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kids" passHref>
                        <Link>
                        <Button>Kids</Button>
                        </Link>
                    </NextLink>
                </Box>
                
                {/* flex */}
                <Box flex={ 1 } />

                <IconButton>
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={4} color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button>
                    Menu
                </Button>


            </Toolbar>
        </AppBar>
    );
};
