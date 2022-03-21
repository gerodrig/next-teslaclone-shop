import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { initialData } from '../../database/products';

const product = initialData.products[0];

const ProductPage = () => {
    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    {/* Slideshow */}
                    <ProductSlideshow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        {/* Titles */}
                        <Typography variant="h1" component="h1">
                            {product.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="h2">{`$${product.price}`}</Typography>

                        {/* Quantity */}
                        <Box sx={{ my: 2 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}>
                                Quantity
                            </Typography>
                            {/* ItemCounter */}
                            <ItemCounter />
                            <SizeSelector
                                sizes={product.sizes}
                                // selectedSize={product.sizes[0]}
                            />
                        </Box>

                        {/* Add to Cart */}
                        <Button color="secondary" className="circular-btn">
                            Add to Cart
                        </Button>

                        {/* <Chip label="Out of Stock" color="error" variant='outlined' /> */}
                        {/* Description */}
                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 'bold' }}>
                                Description
                            </Typography>
                            <Typography variant="body2">
                                {product.description}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default ProductPage;
