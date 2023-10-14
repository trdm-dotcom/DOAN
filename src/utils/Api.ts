import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {Token} from '../models/Token';
import {IRefreshTokenResponse} from '../models/response/IRefreshTokenResponse';
import {CredentialType, loadToken} from './Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token: Token;

const instance: AxiosInstance = axios.create({
  baseURL: 'http://192.168.101.7:3000/api/v1',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

const fetchToken = async () => {
  const credential: CredentialType | null = await loadToken();
  if (credential) {
    token = credential.token;
  }
};

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
  const refreshToken = (): Promise<IRefreshTokenResponse> => {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject();
      } else {
        apiPost<IRefreshTokenResponse>('/refreshToken', {
          data: {
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
            client_secret: 'iW4rurIrZJ',
          },
        })
          .then((response: IRefreshTokenResponse) => resolve(response))
          .catch((error: any) => reject(error));
      }
    });
  };

  const onRequestSuccess = async (config: InternalAxiosRequestConfig<any>) => {
    if (!token) {
      await fetchToken();
    }
    if (token) {
      config.headers.Authorization = `jwt ${token.accessToken}`;
    }
    return config;
  };

  const onRequestError = async (error: any) => Promise.reject(error);

  const onResponseSuccess = (response: AxiosResponse<any>) => response;

  const onResponseError = async (error: any) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config!;
      if (token.refExpiredTime > Date.now()) {
        try {
          const tokenResponse: IRefreshTokenResponse = await refreshToken();
          token = {
            ...token,
            accessToken: tokenResponse.accessToken,
            accExpiredTime: tokenResponse.accExpiredTime,
          };
          await AsyncStorage.mergeItem(
            'proximity:credential',
            JSON.stringify({
              token: token,
            }),
          );
          originalRequest.headers.Authorization = `jwt ${tokenResponse.accessToken}`;
          return await instance(originalRequest);
        } catch (err: any) {
          onUnauthenticated();
        }
      } else {
        return Promise.reject(error);
      }
    } else if (error.response && error.response.status === 400) {
      return Promise.reject(error.response.code);
    }
    return Promise.reject(error);
  };

  instance.interceptors.request.use(onRequestSuccess, onRequestError);
  instance.interceptors.response.use(onResponseSuccess, onResponseError);
};

function apiReq<T>(
  endPoint: string,
  method: string,
  requestOptions = {},
  headers = {},
): Promise<T> {
  const rId: string = Math.floor(Math.random() * Date.now()).toString(8);

  headers = {
    ...{
      rId: rId,
    },
    ...headers,
  };

  return new Promise((resolve, reject) => {
    const options: AxiosRequestConfig = {
      ...{
        url: endPoint,
        method: method,
        headers: headers,
      },
      ...requestOptions,
    };
    instance(options)
      .then((result: AxiosResponse) => {
        resolve(logResponseAndReturnJson(result, endPoint, rId));
      })
      .catch(error => {
        reject(new Error(error.response.data.code));
      });
  });
}

const logResponseAndReturnJson = async <T>(
  response: AxiosResponse,
  url: string,
  msgId: string,
): Promise<T> => {
  const resStr: T = response.data;
  if (JSON.stringify(resStr).length > 16384) {
    console.log(
      msgId,
      'response',
      url,
      JSON.stringify(resStr).substring(0, 16384),
      '...',
      JSON.stringify(resStr).length,
    );
  } else {
    console.log(msgId, 'response', url, JSON.stringify(resStr));
  }
  return resStr;
};

function apiPost<T>(
  endPoint: string,
  requestOptions = {},
  headers = {},
): Promise<T> {
  return apiReq(endPoint, 'post', requestOptions, headers);
}

function apiDelete<T>(
  endPoint: string,
  requestOptions = {},
  headers = {},
): Promise<T> {
  return apiReq(endPoint, 'delete', requestOptions, headers);
}

function apiGet<T>(
  endPoint: string,
  requestOptions = {},
  headers = {},
): Promise<T> {
  return apiReq(endPoint, 'get', requestOptions, headers);
}

function apiPut<T>(
  endPoint: string,
  requestOptions = {},
  headers = {},
): Promise<T> {
  return apiReq(endPoint, 'put', requestOptions, headers);
}

export {apiDelete, apiGet, apiPut, apiPost, setupAxiosInterceptors};
