import {showMessage} from 'react-native-flash-message';

export const showError = (message: string) => {
  showMessage({
    type: 'danger',
    icon: 'danger',
    message,
  });
};

export const showSuccess = (message: string) => {
  showMessage({
    type: 'success',
    icon: 'success',
    message,
  });
};
