import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';

export const getFcmToken = async () => {
  let token: string | null = null;
  try {
    token = await messaging().getToken();
    console.log('getFcmToken-->', token);
  } catch (error) {
    console.log('getFcmToken Device Token error ', error);
  }
  return token;
};

//method was called on user register with firebase FCM for notification
export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  await messaging()
    .registerDeviceForRemoteMessages()
    .then(status => {
      console.log('registerDeviceForRemoteMessages status', status);
    })
    .catch(error => {
      console.log('registerDeviceForRemoteMessages error ', error);
    });
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
}

//method was called on un register the user from firebase for stoping receiving notifications
export async function unRegisterAppWithFCM() {
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  await messaging()
    .unregisterDeviceForRemoteMessages()
    .then(status => {
      console.log('unregisterDeviceForRemoteMessages status', status);
    })
    .catch(error => {
      console.log('unregisterDeviceForRemoteMessages error ', error);
    });
  console.log(
    'unRegisterAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
}

export const checkApplicationNotificationPermission = async () => {
  //Request iOS permission
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  if (Platform.OS === 'android' && Platform.Version > 32) {
    //Request Android permission (For API level 33+, for 32 or below is not required)
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Permission Result:', res);
  }
};

export const listenToForegroundNotifications = async () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log(
      'A new message arrived! (FOREGROUND)',
      JSON.stringify(remoteMessage),
    );
    const {messageId, notification} = remoteMessage;
    if (notification != null) {
      onDisplayNotification(
        messageId,
        notification.title,
        notification.body,
        remoteMessage.data,
      );
    }
  });
  return unsubscribe;
};

export const listenToBackgroundNotifications = async () => {
  const unsubscribe = messaging().setBackgroundMessageHandler(
    async remoteMessage => {
      console.log(
        'A new message arrived! (BACKGROUND)',
        JSON.stringify(remoteMessage),
      );
      const {messageId, notification} = remoteMessage;
      if (notification != null) {
        onDisplayNotification(
          messageId,
          notification.title,
          notification.body,
          remoteMessage.data,
        );
      }
    },
  );
  return unsubscribe;
};

export const onNotificationOpenedAppFromBackground = async () => {
  const unsubscribe = messaging().onNotificationOpenedApp(
    async remoteMessage => {
      console.log(
        'App opened from BACKGROUND by tapping notification:',
        JSON.stringify(remoteMessage),
      );
    },
  );
  return unsubscribe;
};

export const onNotificationOpenedAppFromQuit = async () => {
  const message = await messaging().getInitialNotification();

  if (message) {
    console.log(
      'App opened from QUIT by tapping notification:',
      JSON.stringify(message),
    );
  }
};

//method was called to display notification
async function onDisplayNotification(id, title, body, data) {
  // Request permissions (required for iOS)
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'fotei',
    name: 'Fotei Channel',
    sound: 'default',
    vibration: false,
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    id: id,
    title: title,
    body: body,
    data: data,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
