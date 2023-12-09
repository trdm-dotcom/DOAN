import React, {useContext, useEffect, useState} from 'react';
import RootStack from './src/navigators/RootStack';
import {Provider} from 'react-redux';
import getStore from './src/reducers/redux/store';
import {fetchToken, setupAxiosInterceptors} from './src/utils/Api';
import {
  getFcmToken,
  checkApplicationNotificationPermission,
  listenToBackgroundNotifications,
  onNotificationOpenedAppFromQuit,
  listenToForegroundNotifications,
  onNotificationOpenedAppFromBackground,
  unRegisterAppWithFCM,
  registerAppWithFCM,
} from './src/utils/PushNotification';
import {AppContext, AppContextProvider} from './src/context';
import {SafeAreaView} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {
  CredentialType,
  loadThemeType,
  loadToken,
  removeToken,
} from './src/utils/Storage';
import Loading from './src/screens/Loading';
import {styles} from './src/components/style';
import {getUserInfo} from './src/reducers/action/user';
import {IUserInfoResponse} from './src/models/response/IUserInfoResponse';
import {connectSocket} from './src/utils/Socket';
import {useDispatch, useSelector} from 'react-redux';
import {getDeviceId} from 'react-native-device-info';
import {getNotificationSetting} from './src/reducers/action/notification';
import {NavigationContainer} from '@react-navigation/native';

const SafeAreaApp = () => {
  const dispatch = useDispatch();

  const {theme, toggleTheme, setFcmToken, setDeviceId, setOnNotification} =
    useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const {isLoading} = useSelector((state: any) => state.user);

  setupAxiosInterceptors(() => {
    removeToken();
    unRegisterAppWithFCM();
    dispatch({
      type: 'userLogout',
    });
    dispatch({
      type: 'logout',
    });
  });

  const initializeTheme = () =>
    loadThemeType().then(themeType => {
      if (themeType !== null) {
        toggleTheme(themeType);
      }
    });

  const getFcmtoken = () =>
    getFcmToken().then(fcmToken => {
      setFcmToken(fcmToken);
    });

  const checkLoginCredentials = async () => {
    const credentials: CredentialType | null = await loadToken();
    if (credentials) {
      const token = credentials.token;
      if (token.refExpiredTime > Date.now()) {
        await fetchToken();
        await Promise.all([userInfo(), notificationSetting()]);
      }
    }
  };

  const notificationSetting = async () => {
    try {
      const res = await getNotificationSetting({deviceId: getDeviceId()});
      if (res.receive) {
        registerAppWithFCM();
      }
      setOnNotification(res.receive);
    } catch (err: any) {
      setOnNotification(false);
    }
  };

  const userInfo = async () => {
    try {
      dispatch({
        type: 'getUsersRequest',
      });
      const userInfoRes: IUserInfoResponse = await getUserInfo();
      dispatch({
        type: 'getUsersSuccess',
        payload: userInfoRes,
      });
      dispatch({
        type: 'authenticated',
      });
    } catch (err: any) {
      dispatch({
        type: 'getUsersFailed',
        payload: err.message,
      });
    }
  };

  const initializeApp = () => {
    setLoading(true);
    Promise.all([checkLoginCredentials(), initializeTheme()]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    setDeviceId(getDeviceId());
    getFcmtoken();
    checkApplicationNotificationPermission();
    onNotificationOpenedAppFromQuit();
    listenToBackgroundNotifications();
    listenToForegroundNotifications();
    onNotificationOpenedAppFromBackground();
    initializeApp();
  }, []);

  return (
    <SafeAreaView style={[styles(theme).safeArea]}>
      {loading || isLoading ? (
        <Loading />
      ) : (
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      )}
      <FlashMessage
        titleStyle={styles(theme).flashMessageTitle}
        floating
        position="top"
      />
    </SafeAreaView>
  );
};

const App = () => {
  const store = getStore();

  connectSocket();

  return (
    <Provider store={store}>
      <AppContextProvider>
        <SafeAreaApp />
      </AppContextProvider>
    </Provider>
  );
};

export default App;
