import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';

import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
//import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
//import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

type FormData = {
    email: string;
    password: string;
};

const LoginPage = () => {
    // const { loginUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [showButton, setshowButton] = useState(true);

    //providers state
    const [providers, setProviders] = useState<any>({});

    //useeffect to get providers
    useEffect(() => {
        getProviders().then((providers) => {
            setProviders(providers);
        });
    }, []);

    //get destination from router
    const destination = router.query.p?.toString() || '/';
    //console.log({ errors });

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);
        setshowButton(false);

        // const loginSuccess = await loginUser(email, password);

        // if (!loginSuccess) {
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false);
        //         setshowButton(true);
        //     }, 3000);
        //     return setshowButton(false);
        // }

        // //navigate user to previous page or to home page
        // router.replace(destination);

        //Impleneting Nexauth
        const result = await signIn('credentials', { email, password });

        //console.log(result);
    };

    return (
        <AuthLayout title={'Tesclone - Sign in'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component={'h1'}>
                                Sign in
                            </Typography>
                            <Chip
                                label="Email/Password not valid"
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
                                type={'email'}
                                label="Email"
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
                                Sign in
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent={'end'}>
                            <NextLink
                                href={`/auth/register?p=${destination}`}
                                passHref>
                                <Link underline="always">Create Account?</Link>
                            </NextLink>
                        </Grid>
                        {/* Include the other provicders login */}
                        <Grid
                            item
                            xs={12}
                            display="flex"
                            flexDirection="column"
                            justifyContent="end">
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            {Object.values(providers).map((provider: any) => {
                                if (provider.id === 'credentials') return null;

                                return (
                                    <Button
                                        key={provider.id}
                                        variant="outlined"
                                        fullWidth
                                        color="primary"
                                        sx={{ mb: 1 }}
                                        onClick={() => signIn(provider.id)}>
                                        {provider.name}
                                    </Button>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

//implement next server side props to check the cookies and avoid rendering the page if the user is already logged in
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
    req,
    query,
}) => {
    const session = await getSession({ req });

    //save user previous page
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

export default LoginPage;
