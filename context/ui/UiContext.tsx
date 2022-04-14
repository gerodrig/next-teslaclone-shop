import { createContext } from 'react';

interface UIContextProps {
    isMenuOpen: boolean;

    //Methods
    toggleSideMenu: () => void;
}

export const UiContext = createContext({} as UIContextProps);