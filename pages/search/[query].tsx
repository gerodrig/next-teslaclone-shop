import type { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';

import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface SearchPageProps {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<SearchPageProps> = ({products, foundProducts, query}) => {


    return (
        <ShopLayout
            title={'TesCloneShop - Search'}
            pageDescription={
                'Find the best products from TesClone in the market'
            }>
            <Typography variant="h1" component="h1">
                Search Products
            </Typography>
            {
                foundProducts ? (
                    <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
                    Search: {query}
                </Typography>
                ) : (
                    <Box display='flex'>
                        <Typography variant="h2" sx={{ mb: 1 }}>
                            No Product Was Found
                        </Typography>
                        <Typography variant="h2" sx={{ mb: 1, ml: 1 }} color='secondary' textTransform="capitalize">
                            { query }
                        </Typography>
                    </Box>
                )
            }
                <ProductList products={products} />

        </ShopLayout>
    );
};

//generate the search page with getserver side props and search terms can be different from many users
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { query = '' } = params as { query: string };

    if( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            }
        }
    }

    //let because products array may be empty
    let products = await dbProducts.getProductsByTerm( query );

    const foundProducts = products.length > 0;

    //TODO: in case search is empty return other products based in cookies
    //get some of the products and return
    if( !foundProducts ) {
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query,
        }
    }
}

export default SearchPage;
