import React, {useContext, useEffect} from 'react';
import RootStack from './src/navigators/RootStack';
import {Provider} from 'react-redux';
import getStore, {useAppDispatch} from './src/reducers/redux/store';
import {setupAxiosInterceptors} from './src/utils/Api';
import {
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

const SafeAreaApp = () => {
  const dispatch = useAppDispatch();
  const {theme, toggleTheme} = useContext(AppContext);
  const [loading, setLoading] = React.useState(true);

  const initializeTheme = async () => {
    const themeType = await loadThemeType();
    if (themeType !== null) {
      toggleTheme(themeType);
    }
  };

  const checkLoginCredentials = async () => {
    setLoading(true);
    const credentials: CredentialType | null = await loadToken();
    if (credentials) {
      const token = credentials.token;
      if (token.refExpiredTime > Date.now()) {
        dispatch(getSession());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeTheme();
    checkLoginCredentials();
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

  setupAxiosInterceptors();

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
