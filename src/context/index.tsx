import React, {createContext, useState} from 'react';
import {ThemeColors} from '../constants/Types';
import {Theme} from '../theme/Colors';
import {saveThemeType} from '../utils/Storage';

type AppContextType = {
  theme: ThemeColors;
  themeType: string;
  toggleTheme: (type: string) => void;
};

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = ({children}: any) => {
  const [theme, setTheme] = useState(Theme.light.colors);
  const [themeType, setThemeType] = useState(Theme.light.type);

  const toggleTheme = (type: string) => {
    setTheme(Theme[type].colors);
    setThemeType(type);
    saveThemeType(type);
  };

  const value = {
    theme,
    themeType,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
