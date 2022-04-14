import { createContext } from 'react';
import { IUser } from '../../interfaces';

interface UIContextProps {
    isLoggedIn: boolean;
    user?: IUser;

    //Methods
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string }>;
    logoutUser: () => void;
}

export const AuthContext = createContext({} as UIContextProps);