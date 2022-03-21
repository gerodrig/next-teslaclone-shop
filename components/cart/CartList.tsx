import { FC } from 'react';
import NextLink from 'next/link';
import {
    CardActionArea,
    CardMedia,
    Grid,
    Link,
    Typography,
    Box,
    Button,
} from '@mui/material';

import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
];

interface CartListProps {
    editable?: boolean;
}

export const CartList: FC<CartListProps> = ({ editable = false }) => {
    return (
        <>
            {productsInCart.map((product) => (
                <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/*  Take to the product page */}
                        <NextLink href="/product/slug" passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${product.images[0]}`}
                                        component="img"
                                        sx={{
                                            borderRadius: '5px',
                                        }}></CardMedia>
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">
                                {product.title}
                            </Typography>
                            <Typography variant="body1">
                                Size: <strong>M</strong>
                            </Typography>

                            {/* Conditional */}
                            {editable ? (
                                <ItemCounter />
                            ) : (
                                <Typography variant="h5">3 items</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display="flex"
                        alignItems="center"
                        flexDirection="column">
                        <Typography variant="subtitle1">{`$${product.price}`}</Typography>
                        {/* Editable */}
                        {editable && (
                            <Button variant="text" color="secondary">
                                Remove
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );
};
