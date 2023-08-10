import messaging from '@react-native-firebase/messaging';

export const getFcmToken = () => {
  return new Promise((resolve, reject) => {
    messaging()
      .getToken()
      .then(token => {
        resolve(token);
      })
      .catch(error => {
        reject(error);
      });
  });
};
