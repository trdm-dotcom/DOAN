import messaging from '@react-native-firebase/messaging';
import {loadFCMToken, saveFCMToken} from './Storage';

export const getFcmTokenFromLocalStorage = async () => {
  let fcmtoken: string | null = await loadFCMToken();
  if (fcmtoken == null) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      fcmtoken = await messaging().getToken();
      saveFCMToken(fcmtoken);
    } catch (error) {
      console.error(error);
    }
  }
  return fcmtoken;
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on froground state:', remoteMessage);
  });
};
