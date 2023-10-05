import {showMessage} from 'react-native-flash-message';

export const showError = (message: string) =>
  showMessage({
    message: message,
    type: 'danger',
    duration: 4000,
  });
