import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Token} from '../models/Token';
import {IRefreshTokenResponse} from '../models/response/IRefreshTokenResponse';
import {CredentialType, loadToken} from './Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, CLIENT_SECRET} from '@env';

let token: Token = {} as Token;

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

export const fetchToken = async () => {
  const credential: CredentialType | null = await loadToken();
  if (credential != null) {
    token = credential.token;
  }
};

const getToken = async () => {
  return token;
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
            client_secret: CLIENT_SECRET,
          },
        })
          .then((response: IRefreshTokenResponse) => resolve(response))
          .catch((error: any) => reject(error));
      }
    });
  };

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
        onUnauthenticated();
      }
    }
    return Promise.reject(error);
  };
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
    ...headers,
    rId: rId,
  };

  if (token.accessToken != null) {
    headers['Authorization'] = `jwt ${token.accessToken}`;
  }

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
        resolve(logResponseAndReturnJson(result));
      })
      .catch(error => {
        reject(new Error(error.response.data.code || error.message));
      });
  });
}

const logResponseAndReturnJson = async <T>(
  response: AxiosResponse,
): Promise<T> => {
  const resStr: T = response.data;
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

export {apiDelete, apiGet, apiPut, apiPost, setupAxiosInterceptors, getToken};
