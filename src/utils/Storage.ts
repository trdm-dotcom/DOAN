import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Token} from '../models/Token';

const storage: Storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 7 * 1000 * 3600 * 24, // 7 days
  enableCache: true,
});

export type CredentialType = {
  token: Token;
  type: string;
  data: any;
};

export const saveFCMToken = async (token: string) => {
  await storage.save({
    key: 'proximity:fcm',
    data: token,
    expires: null,
  });
};

export const loadFCMToken = () => {
  return new Promise<string | null>(resolve => {
    storage
      .load<string>({
        key: 'proximity:fcm',
        autoSync: false,
        syncInBackground: false,
      })
      .then((token: string) => resolve(token))
      .catch(() => {
        resolve(null);
      });
  });
};

export const removeFCMToken = async () => {
  await storage.remove({
    key: 'proximity:fcm',
  });
};

export const saveToken = async (data: CredentialType) => {
  await storage.save({
    key: 'proximity:credential',
    data: data,
  });
};

export const loadToken = (): Promise<CredentialType | null> => {
  return new Promise<CredentialType | null>(resolve => {
    storage
      .load<CredentialType>({
        key: 'proximity:credential',
        autoSync: false,
        syncInBackground: false,
      })
      .then((credential: CredentialType) => resolve(credential))
      .catch(() => {
        resolve(null);
      });
  });
};

export const removeToken = async () => {
  await storage.remove({
    key: 'proximity:credential',
  });
};

export const saveThemeType = async (themeType: string) => {
  await storage.save({
    key: 'proximity:theme',
    data: themeType,
    expires: null, // never expires until changed
  });
};

export const loadThemeType = () => {
  return new Promise<string | null>(resolve => {
    storage
      .load({
        key: 'proximity:theme',
        autoSync: false,
        syncInBackground: false,
      })
      .then((themeType: string) => resolve(themeType))
      .catch(() => {
        resolve(null);
      });
  });
};
