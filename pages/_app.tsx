import { SessionProvider } from "next-auth/react"
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SWRConfig } from 'swr';

import { lightTheme } from '../themes';
import { UiProvider, CartProvider, AuthProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
            <SWRConfig
                value={{
                    // refreshInterval: 500, to keep page refresed every 500ms
                    fetcher: (resource, init) =>
                        fetch(resource, init).then((res) => res.json()),
                }}>
                <AuthProvider>
                    <CartProvider>
                        <UiProvider>
                            <ThemeProvider theme={lightTheme}>
                                <CssBaseline />
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </UiProvider>
                    </CartProvider>
                </AuthProvider>
            </SWRConfig>
            </PayPalScriptProvider>
        </SessionProvider>

    );
}

export default MyApp;
