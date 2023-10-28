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
import Loading from './src/screens/Loading';
import {styles} from './src/components/style';
import {bindActionCreators} from '@reduxjs/toolkit';
import {
  authenticated,
  clearAuthentication,
  userInfo,
} from './src/reducers/redux/authentication.reducer';
import {useNavigation} from '@react-navigation/native';
import {getUserInfo} from './src/reducers/action/user';
import {IUserInfoResponse} from './src/models/response/IUserInfoResponse';

const SafeAreaApp = () => {
  const dispatch = useAppDispatch();
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
      const token = credentials.token;
      if (token.refExpiredTime > Date.now()) {
        getUserInfo().then((userInfoRes: IUserInfoResponse) => {
          dispatch(userInfo(userInfoRes));
          dispatch(authenticated());
        });
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
        getFcmtoken(),
        checkLoginCredentials(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <SafeAreaView style={[styles(theme).safeArea]}>
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
