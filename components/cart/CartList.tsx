import { FC, useContext } from 'react';
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

import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces';
import { IOrderItem } from '../../interfaces/order';

interface CartListProps {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<CartListProps> = ({ editable = false, products }) => {
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);
    
    const onNewCartQuantityvalue = (product: ICartProduct, quantity: number) => {
        product.quantity = quantity
        updateCartQuantity(product);
    }

    //check if products are to be used from context or passed as props
    const productsToShow = products ? products : cart;

    return (
        <>
            { productsToShow.map((product) => (
                <Grid
                    container
                    spacing={2}
                    key={product.slug + product.size}
                    sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/*  Take to the product page */}
                        <NextLink href={`/product/${ product.slug }`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={product.image}
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
                                Size: <strong>{product.size}</strong>
                            </Typography>

                            {/* Conditional */}
                            {editable ? (
                                <ItemCounter
                                    currentValue={product.quantity}
                                    maxValue={product.quantity > 10 ? 10 : product.quantity}
                                    updatedQuantity={(qty) => onNewCartQuantityvalue(product as ICartProduct, qty)}
                                />
                            ) : (
                                <Typography variant="h5">
                                    {product.quantity} {product.quantity > 1 ? 'items' : 'item'}
                                </Typography>
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
                            <Button variant="text" color="secondary" onClick={() => removeCartProduct(product as ICartProduct )}>
                                Remove
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );
};
