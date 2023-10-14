import React, {createContext, useState} from 'react';
import {ThemeColors} from '../constants/Types';
import {Theme} from '../theme/Colors';
import {saveThemeType} from '../utils/Storage';

type AppContextType = {
  fcmToken: any;
  theme: ThemeColors;
  themeType: string;
  toggleTheme: (type: string) => void;
  setFcmToken: (token: any) => void;
};

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = ({children}: any) => {
  const [theme, setTheme] = useState(Theme.light.colors);
  const [themeType, setThemeType] = useState(Theme.light.type);
  const [fcmToken, setFcmToken] = useState(null);

  const toggleTheme = (type: string) => {
    setTheme(Theme[type].colors);
    setThemeType(type);
    saveThemeType(type);
  };

  const value = {
    theme,
    themeType,
    toggleTheme,
    fcmToken,
    setFcmToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
