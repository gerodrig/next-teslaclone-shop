import { useContext, useState } from 'react';
import NextLink from 'next/link';
import {
    AppBar,
    Badge,
    Box,
    Button,
    IconButton,
    Input,
    InputAdornment,
    Link,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    ClearOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { UiContext, CartContext } from '../../context';

export const Navbar = () => {
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfProducts } = useContext(CartContext);
    const { asPath, push } = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    //function to handle the search
    const onSearchTerm = () => {
        //veryfy if the search term is not empty, do nothing if it is empty
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    };

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

                <Box
                    className="fadeIn"
                    sx={{
                        display: isSearchVisible
                            ? 'none'
                            : { xs: 'none', sm: 'block' },
                    }}>
                    <NextLink href="/category/men" passHref>
                        <Link>
                            <Button
                                color={
                                    asPath === '/category/men'
                                        ? 'primary'
                                        : 'info'
                                }>
                                Men
                            </Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women" passHref>
                        <Link>
                            <Button
                                color={
                                    asPath === '/category/women'
                                        ? 'primary'
                                        : 'info'
                                }>
                                Women
                            </Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kids" passHref>
                        <Link>
                            <Button
                                color={
                                    asPath === '/category/kids'
                                        ? 'primary'
                                        : 'info'
                                }>
                                Kids
                            </Button>
                        </Link>
                    </NextLink>
                </Box>

                {/* flex */}
                <Box flex={1} />

                {/* Large screens */}
                {isSearchVisible ? (
                    <Input
                        className="fadeIn"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSearchTerm()}
                        type="text"
                        placeholder="Search..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setIsSearchVisible(false)}>
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                ) : (
                    <IconButton
                        className="fadeIn"
                        onClick={() => setIsSearchVisible(true)}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <SearchOutlined />
                    </IconButton>
                )}

                {/* Small screens */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}>
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfProducts > 9 ? '+9' : numberOfProducts } color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={() => toggleSideMenu()}>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
