import axios, {AxiosResponse} from 'axios';
import {ILoginRequest} from '../models/request/ILoginRequest.model';
import {createAsyncThunk, createSlice, isPending} from '@reduxjs/toolkit';
import {serializeAxiosError} from './reducer.utils';
import {AppThunk} from './store';
import {ILoginResponse, IUserData} from '../models/response/ILoginResponse';
import {IRegisterRequest} from '../models/request/IRegisterRequest';
import {ICheckExistRequest} from '../models/request/ICheckExistRequest';
import {ICheckExistResponse} from '../models/response/ICheckExistResponse';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {apiGet, apiPost} from '../utils/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IBiometricLoginRequest} from '../models/request/IBiometricLoginRequest';

export const initialState: any = {
  userData: {} as IUserData,
  userInfo: {} as IUserInfoResponse,
  exist: {} as ICheckExistResponse,
  loading: false,
  errorMessage: null,
  isAuthenticated: false,
};

type AuthenticationType = {
  type: 'password' | 'biometric';
  data: ILoginRequest | IBiometricLoginRequest;
};

export type AuthenticationState = Readonly<typeof initialState>;

export const authenticate = createAsyncThunk(
  'authentication/login',
  async (body: AuthenticationType) => {
    switch (body.type) {
      case 'password':
        return await apiPost('/login', body.data, {
          'Content-Type': 'application/x-www-form-urlencoded',
        });
      case 'biometric':
        return await apiPost('/biometric', body.data, {
          'Content-Type': 'application/x-www-form-urlencoded',
        });
      default:
        return await Promise.reject('Invalid type');
    }
  },
  {
    serializeError: serializeAxiosError,
  },
);

export const registerNewAccount = createAsyncThunk(
  'authentication/register',
  async (body: IRegisterRequest) =>
    await apiPost('/register', body, {
      'Content-Type': 'application/json',
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const getAccount = createAsyncThunk(
  'authentication/get_account',
  async () => await apiGet('/user/info'),
  {
    serializeError: serializeAxiosError,
  },
);

export const checkExist = createAsyncThunk(
  'authentication/check_exist',
  async (body: ICheckExistRequest) => axios.post<any>('/checkExist', body),
  {
    serializeError: serializeAxiosError,
  },
);

export const register: (body: IRegisterRequest) => AppThunk =
  body => async dispatch => {
    await dispatch(registerNewAccount(body));
    dispatch(
      login({
        username: body.username,
        password: body.password,
        hash: body.hash,
        grant_type: 'password',
        client_secret: 'secret',
      }),
    );
  };

export const login: (body: ILoginRequest) => AppThunk =
  (body: ILoginRequest) => async dispatch => {
    const result = await dispatch(authenticate({type: 'password', data: body}));
    const response = result.payload.data as ILoginResponse;
    AsyncStorage.setItem(
      'loginCredentials',
      JSON.stringify({
        token: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          accExpiredTime: response.accExpiredTime,
          refExpiredTime: response.refExpiredTime,
        },
        type: 'password',
        data: body,
      }),
    );
    dispatch(getAccount());
  };

export const biometric: (body: IBiometricLoginRequest) => AppThunk =
  (body: IBiometricLoginRequest) => async dispatch => {
    const result = await dispatch(
      authenticate({type: 'biometric', data: body}),
    );
    const response = (result.payload as AxiosResponse).data as ILoginResponse;
    AsyncStorage.setItem(
      'loginCredentials',
      JSON.stringify({
        token: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          accExpiredTime: response.accExpiredTime,
          refExpiredTime: response.refExpiredTime,
        },
        type: 'biometric',
        data: body,
      }),
    );
    dispatch(getAccount());
  };

export const clearAuthentication = () => (dispatch: any) => {
  clearAuthToken();
  dispatch(clearAuth());
};

export const clearAuthToken = () => {
  AsyncStorage.removeItem('token');
  AsyncStorage.removeItem('userInfo');
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
      }))
      .addCase(authenticate.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        userData: (action.payload.data as ILoginResponse).userInfo,
      }))
      .addCase(getAccount.rejected, (state, action) => {
        // showError(action.error.message);
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          errorMessage: action.error.message,
        };
      })
      .addCase(getAccount.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: true,
        userInfo: action.payload.data as IUserInfoResponse,
      }))
      .addCase(checkExist.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        exist: action.payload.data as ICheckExistResponse,
      }))
      .addCase(checkExist.rejected, (state, action) => ({
        ...state,
        loading: false,
        errorMessage: action.error.message,
      }))
      .addMatcher(isPending(authenticate, getAccount, checkExist), state => {
        state.loading = true;
      });
  },
});

export const {reset, clearAuth} = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
