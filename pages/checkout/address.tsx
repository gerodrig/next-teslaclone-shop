import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// import { GetServerSideProps } from 'next';
import {
    FormControl,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Box,
    Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries } from '../../utils';

type FormData = {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
};

//In case cookies exist, fill the form with the data
const getAddressFromCookies = (): FormData => {
    return {
        name: Cookies.get('name') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        postalCode: Cookies.get('postalCode') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
        address2: Cookies.get('address2') || '',
    };
};

const AddressPage = () => {
    const { updateAddress } = useContext(CartContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            lastName: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            country: countries[0].code,
            phone: '',
        },
    });

    const router = useRouter();

    useEffect(() => {
        reset(getAddressFromCookies());
    }, [reset]);

    const onAddressForm = async (data: FormData) => {
        updateAddress(data);

        router.push('/checkout/summary');
    };

    return (
        <ShopLayout
            title="Address"
            pageDescription={'Confirm shipping address'}>
            <Typography variant="h1" component="h1">
                Address
            </Typography>
            <form onSubmit={handleSubmit(onAddressForm)} noValidate>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            variant="filled"
                            fullWidth
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Name must be at least 2 characters',
                                },
                            })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Last Name is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Last Name must be at least 2 characters',
                                },
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Address is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Address must be at least 2 characters',
                                },
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address 2 (optional)"
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Postal Code"
                            variant="filled"
                            fullWidth
                            {...register('postalCode', {
                                required: 'Postal Code is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Postal Code must be at least 6 characters',
                                },
                            })}
                            error={!!errors.postalCode}
                            helperText={errors.postalCode?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'City is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'City must be at least 2 characters',
                                },
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="Country"
                                defaultValue={
                                    Cookies.get('country') || countries[0].code
                                }
                                {...register('country', {
                                    required: 'Country is required',
                                })}
                                error={!!errors.country}>
                                {countries.map((country) => (
                                    <MenuItem
                                        key={country.code}
                                        value={country.code}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                                {/* <MenuItem value={1}>Canada</MenuItem>
                            <MenuItem value={2}>United States</MenuItem>
                            <MenuItem value={3}>Mexico</MenuItem> */}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Telephone"
                            variant="filled"
                            type="number"
                            fullWidth
                            {...register('phone', {
                                required: 'Phone is required',
                                valueAsNumber: true,
                                minLength: {
                                    value: 10,
                                    message:
                                        'Phone must be at least 10 characters',
                                },
                                maxLength: {
                                    value: 10,
                                    message:
                                        'Phone must be at most 10 characters',
                                },
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large">
                        Review Order
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

//FOLLOWING SERVER SIDE PROPS WILL NEED TO BE IMPLEMENTED IN CASE MIDDLEWARE IS NOT USED
//WE NEED TO MAKE THIS VALIDATION TO ENSURE THAT THE USER IS LOGGED IN
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { token = '' } = req.cookies;

//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
// };

export default AddressPage;
