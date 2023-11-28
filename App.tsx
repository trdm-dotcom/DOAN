import React, {useContext, useEffect, useState} from 'react';
import RootStack from './src/navigators/RootStack';
import {Provider} from 'react-redux';
import getStore from './src/reducers/redux/store';
import {fetchToken, setupAxiosInterceptors} from './src/utils/Api';
import {
  getFcmTokenFromLocalStorage,
  notificationListener,
  requestUserPermission,
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
import {connectSocket, getSocket} from './src/utils/Socket';
import {useDispatch, useSelector} from 'react-redux';
import {getDeviceId} from 'react-native-device-info';
import {getNotificationSetting} from './src/reducers/action/notification';
import {NavigationContainer} from '@react-navigation/native';

const SafeAreaApp = () => {
  const dispatch = useDispatch();

  const {
    theme,
    toggleTheme,
    setFcmToken,
    setDeviceId,
    deviceId,
    setOnNotification,
  } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const {isLoading} = useSelector((state: any) => state.user);
  const {user} = useSelector((state: any) => state.user);
  const socket = getSocket();

  setupAxiosInterceptors(() => {
    removeToken();
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
    getFcmTokenFromLocalStorage().then(fcmToken => {
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
      const res = await getNotificationSetting({deviceId: deviceId});
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
    Promise.all([
      checkLoginCredentials(),
      getFcmtoken(),
      initializeTheme(),
      setDeviceId(getDeviceId()),
    ]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    initializeApp();
    socket.on('show.room', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'updateChats',
          payload: data.data,
        });
      }
    });
    socket.on('delete.room', (data: any) => {
      if (data.to === user.id) {
        dispatch({
          type: 'deleteChat',
          payload: data.data,
        });
      }
    });
    socket.on('post.deleteOrDisable', (data: any) => {
      dispatch({
        type: 'deleteOrDisablePost',
        payload: data,
      });
    });
    socket.on('post.reaction', (data: any) => {
      dispatch({
        type: 'updatePostsReactions',
        payload: data,
      });
    });
    socket.on('post.comment', (data: any) => {
      dispatch({
        type: 'updatePostsComments',
        payload: data,
      });
    });
    socket.on('delete.comment', (data: any) => {
      dispatch({
        type: 'deletePostsComments',
        payload: data,
      });
    });
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

const Main = () => {
  const store = getStore();

  connectSocket();

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
