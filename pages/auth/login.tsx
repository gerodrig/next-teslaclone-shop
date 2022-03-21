import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts';

const LoginPage = () => {
    return (
        <AuthLayout title={'Tesclone - Sign in'}>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component={'h1'}>
                            Sign in
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Email" variant="filled" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            type={'password'}
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            color="secondary"
                            className="circular-btn"
                            size="large"
                            fullWidth>
                            Sign in
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent={'end'}>
                        <NextLink href="/auth/register" passHref>
                            <Link underline='always'>
                                Create Account
                            </Link>
                        </NextLink>
                    </Grid>

                </Grid>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
