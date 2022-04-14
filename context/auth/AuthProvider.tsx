import { FC, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, AuthReducer } from './';
import { tesloApi } from '../../api';

import { IUser } from '../../interfaces/user';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
};

export const AuthProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);
    const router = useRouter();

    //use usesession hook to get user data from next auth
    const { data, status } = useSession();


    //useEffect to check if user is logged in
    useEffect(() => {
        if(status === 'authenticated') {
            //console.log({user: data?.user});

            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
        }
    }, [data, status]);

    //fetches the user from the server/cookie
    // useEffect(() => {
    //     checkToken();
    // }, []);

    const checkToken = async () => {

        //If we don't have a token then we stop the request.
        if( !Cookies.get('token')){
            return;
        }

        try {
            //axios sends cookies automatically
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            
            //if valid, set isLoggedIn to true
            Cookies.set('token', token);
            //dispatch login action
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            //remove cookies in case something wrong
            Cookies.remove('token');
        } 
    }

    const loginUser = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', {
                email,
                password,
            });
            const { token, user } = data;
            Cookies.set('token', token);

            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const registerUser = async (
        name: string,
        email: string,
        password: string
    ): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await tesloApi.post('/user/register', {
                name,
                email,
                password,
            });
            const { token, user } = data;
            Cookies.set('token', token);

            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                };
            }

            return {
                hasError: true,
                message:
                    'Something went wrong, user could not be registered - Try again later.',
            };
        }
    };

    //logout user
    const logoutUser = () => {

        //Remove all cookies
        Cookies.remove('cart');
        
        //Remove contact cookies
        Cookies.remove('name');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('postalCode');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        Cookies.remove('address2');

        signOut();
        
        //reload page to reset our app state
        //Cookies.remove('token' );
       //router.reload();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,

                //Methods
                loginUser,
                registerUser,
                logoutUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
