import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';

import {
    Box,
    Button,
    Chip,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { AuthContext } from '../../context/auth/AuthContext';
import { AuthLayout } from '../../components/layouts';

import { useForm, SubmitHandler } from 'react-hook-form';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { signIn, getSession } from 'next-auth/react';

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    //get destination from router
    const destination = router.query.p?.toString() || '/';

    //START Define the onSubmit function
    const onRegisterForm = async ({
        firstName,
        lastName,
        email,
        password,
    }: FormData) => {
        //Reset the error message
        setShowError(false);
        //Diasable create account button to avoid multiple submits
        setShowButton(false);

        //Call the registerUser function will return if user was registered and the message
        const { hasError, message } = await registerUser(
            `${firstName} ${lastName}`,
            email,
            password
        );

        if (hasError) {
            //if register user has error we will show an error message to the user.
            setShowError(true); //enable the chip and the error message
            setErrorMessage(message || 'Something went wrong');

            setTimeout(() => {
                setShowError(false); //clear error message after 3 seconds.
                setShowButton(true); //reenalbe submit button after 3 seconds
            }, 3000);

            return setErrorMessage(''); //clear error message after timeout
        }

        // navigate user to previous page or to home page
        //navigate user to previous page or to home page
        // router.replace(destination);

        //including NextAuth login
        await signIn('credentials', { email, password });
    };
    //END Define the onSubmit function

    return (
        <AuthLayout title={'Tesclone - Create Account'}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component={'h1'}>
                                Create Account
                            </Typography>
                            <Chip
                                label={errorMessage}
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{
                                    display: showError ? 'flex' : 'none',
                                    mt: 1,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="First Name"
                                variant="filled"
                                fullWidth
                                {...register('firstName', {
                                    required: 'First name is required',
                                    minLength: {
                                        value: 2,
                                        message:
                                            'First name must be at least 2 characters',
                                    },
                                })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Last Name"
                                variant="filled"
                                fullWidth
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    minLength: {
                                        value: 2,
                                        message:
                                            'Last name must be at least 2 characters',
                                    },
                                })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Email Address"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'This field is required',
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type={'password'}
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required:
                                        'Please enter password to Sign in',
                                    minLength: {
                                        value: 6,
                                        message:
                                            'Please enter a minimum of 6 characters',
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className="circular-btn"
                                size="large"
                                fullWidth
                                disabled={!showButton}>
                                Create Account
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent={'end'}>
                            <NextLink
                                href={`/auth/login?p=${destination}`}
                                passHref>
                                <Link underline="always">Sign In?</Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

//include SSR
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
    req,
    query,
}) => {
    const session = await getSession({ req }); // your fetch function here

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default RegisterPage;
