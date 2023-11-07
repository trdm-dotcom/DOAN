import React, {createContext, useState} from 'react';
import {ThemeColors} from '../constants/Types';
import {Theme} from '../theme/Colors';
import {saveThemeType} from '../utils/Storage';
import {Appearance} from 'react-native';

type AppContextType = {
  fcmToken: any;
  deviceId: any;
  onNotification: boolean;
  theme: ThemeColors;
  themeType: string;
  toggleTheme: (type: string) => void;
  setFcmToken: (token: any) => void;
  setDeviceId: (id: any) => void;
  setOnNotification: (onNotification: boolean) => void;
};

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = ({children}: any) => {
  const [theme, setTheme] = useState(
    Theme[Appearance.getColorScheme() || 'dark'].colors,
  );
  const [themeType, setThemeType] = useState(
    Theme[Appearance.getColorScheme() || 'dark'].type,
  );
  const [fcmToken, setFcmToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [onNotification, setOnNotification] = useState<any>(false);

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
    deviceId,
    setDeviceId,
    onNotification,
    setOnNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
