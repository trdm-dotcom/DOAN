import React, {useContext, useEffect} from 'react';
import RootStack from './src/navigators/RootStack';
import {Provider} from 'react-redux';
import getStore, {useAppDispatch} from './src/reducers/redux/store';
import {setupAxiosInterceptors} from './src/utils/Api';
import {
  getFcmTokenFromLocalStorage,
  notificationListener,
  requestUserPermission,
} from './src/utils/PushNotification';
import {AppContext, AppContextProvider} from './src/context';
import {SafeAreaView} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {CredentialType, loadThemeType, loadToken} from './src/utils/Storage';
import {getSession} from './src/reducers/action/authentications';
import Loading from './src/screens/Loading';
import {styles} from './src/components/style';
import {bindActionCreators} from '@reduxjs/toolkit';
import {clearAuthentication} from './src/reducers/redux/authentication.reducer';
import {useNavigation} from '@react-navigation/native';

const SafeAreaApp = () => {
  const {theme, toggleTheme, setFcmToken} = useContext(AppContext);
  const [loading, setLoading] = React.useState(true);

  const initializeTheme = async () => {
    const themeType = await loadThemeType();
    if (themeType !== null) {
      toggleTheme(themeType);
    }
  };

  const checkLoginCredentials = async () => {
    const credentials: CredentialType | null = await loadToken();
    if (credentials) {
      const dispatch = useAppDispatch();
      const token = credentials.token;
      if (token.refExpiredTime > Date.now()) {
        dispatch(getSession());
      }
    }
  };

  const getFcmtoken = async () => {
    const fcmToken = await getFcmTokenFromLocalStorage();
    setFcmToken(fcmToken);
  };

  const initializeApp = async () => {
    try {
      setLoading(true);
      await Promise.all([
        initializeTheme(),
        checkLoginCredentials(),
        getFcmtoken(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <SafeAreaView
      style={[styles(theme).safeArea, styles(theme).defaultBackground]}>
      {loading ? <Loading /> : <RootStack />}
      <FlashMessage
        titleStyle={styles(theme).flashMessageTitle}
        floating
        position="top"
      />
    </SafeAreaView>
  );
};

const Main = () => {
  const store = getStore();

  const actions = bindActionCreators({clearAuthentication}, store.dispatch);
  setupAxiosInterceptors(() => {
    actions.clearAuthentication();
    useNavigation().reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  });

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <Provider store={store}>
      <AppContextProvider>
        <SafeAreaApp />
      </AppContextProvider>
    </Provider>
  );
};

export default Main;
