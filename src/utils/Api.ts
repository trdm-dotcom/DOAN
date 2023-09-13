import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {Token} from '../models/Token';
import {IRefreshTokenResponse} from '../models/response/IRefreshTokenResponse';
import {showError} from './Toast';

let token: Token;
let isRefreshing: boolean = false;
let failedQueue: any[] = [];

export const getToken = (): Token => {
  return token;
};

const instance: AxiosInstance = axios.create({
  baseURL: 'http://192.168.101.7:3000/api/v1',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

export const fethToken = async () => {
  const result: string | null = await AsyncStorage.getItem('loginCredentials');
  if (result != null) {
    token = JSON.parse(result).token as Token;
  }
};

export const setupAxiosInterceptors = (onUnauthenticated: any) => {
  const processQueue = (error: any, jwtToken: string | null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(jwtToken);
      }
    });
    failedQueue = [];
  };
  const onRequestSuccess = async (config: InternalAxiosRequestConfig<any>) => {
    if (token) {
      if (token.refExpiredTime > Date.now()) {
        if (token.accExpiredTime > Date.now()) {
          config.headers.Authorization = `jwt ${token.accessToken}`;
        } else {
          try {
            const result = await apiPost('/refreshToken', {
              grant_type: 'refresh_token',
              refresh_token: token.accessToken,
            });
            const response = (result as AxiosResponse)
              .data as IRefreshTokenResponse;
            token = {
              ...token,
              accessToken: response.accessToken,
              accExpiredTime: response.accExpiredTime,
            };
            config.headers.Authorization = `jwt ${token.accessToken}`;
            await AsyncStorage.mergeItem(
              'loginCredentials',
              JSON.stringify({
                token: token,
              }),
            );
          } catch (error: any) {
            onUnauthenticated();
          }
        }
      } else {
        onUnauthenticated();
      }
    }
    return config;
  };

  const onResponseSuccess = (response: AxiosResponse<any>) => response;

  const onResponseError = async (error: any) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      if (token.refExpiredTime > Date.now()) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({resolve, reject});
          })
            .then(jwtToken => {
              originalRequest.headers.Authorization = `jwt ${jwtToken}`;
              return axios(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const result = await apiPost('/refreshToken', {
            grant_type: 'refresh_token',
            refresh_token: token.accessToken,
          });
          const response = (result as AxiosResponse)
            .data as IRefreshTokenResponse;
          token = {
            ...token,
            accessToken: response.accessToken,
            accExpiredTime: response.accExpiredTime,
          };
          await AsyncStorage.mergeItem(
            'token',
            JSON.stringify({
              token: token,
            }),
          );
          originalRequest.headers.Authorization = `jwt ${token.accessToken}`;
          processQueue(null, token.accessToken);
          await instance(originalRequest);
        } catch (err: any) {
          processQueue(err, null);
          onUnauthenticated();
        } finally {
          isRefreshing = true;
        }
      } else {
        onUnauthenticated();
      }
    } else {
      console.log(error.response);
      showError(` (${originalRequest.headers.rId})`);
    }
    return Promise.reject(error);
  };

  instance.interceptors.request.use(onRequestSuccess);
  instance.interceptors.response.use(onResponseSuccess, onResponseError);
};

const apiReq = (
  endPoint: string,
  data: any,
  method: string,
  headers = {},
  requestOptions = {},
): Promise<any> => {
  const rId: string = Math.floor(Math.random() * Date.now()).toString(8);

  headers = {
    ...headers,
    rId: rId,
  };

  return new Promise((resolve, reject) => {
    instance({
      method: method,
      url: endPoint,
      data: data,
      params: requestOptions,
      headers: headers,
    })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const apiPost = (
  endPoint: string,
  data: any,
  headers = {},
): Promise<any> => {
  return apiReq(endPoint, data, 'post', headers);
};

export const apiDelete = (endPoint: string, headers = {}): Promise<any> => {
  return apiReq(endPoint, null, 'delete', headers);
};

export const apiGet = (
  endPoint: string,
  headers = {},
  requestOptions = {},
): Promise<any> => {
  return apiReq(endPoint, null, 'get', headers, requestOptions);
};

export const apiPut = (
  endPoint: string,
  data: any,
  headers = {},
): Promise<any> => {
  return apiReq(endPoint, data, 'put', headers);
};
