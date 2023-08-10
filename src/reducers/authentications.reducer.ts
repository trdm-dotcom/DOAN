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

export const initialState: any = {
  userData: {} as IUserData,
  userInfo: {} as IUserInfoResponse,
  exist: {} as ICheckExistResponse,
  loading: false,
  errorMessage: null,
  isAuthenticated: false,
};

export type AuthenticationState = Readonly<typeof initialState>;

export const authenticate = createAsyncThunk(
  'authentication/login',
  async (body: ILoginRequest) =>
    await apiPost('/login', body, {
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
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
  async () => await apiGet('api/v1/user/info'),
  {
    serializeError: serializeAxiosError,
  },
);

export const checkExist = createAsyncThunk(
  'authentication/check_exist',
  async (body: ICheckExistRequest) =>
    axios.post<any>('api/v1/checkExist', body),
  {
    serializeError: serializeAxiosError,
  },
);

export const register: (body: IRegisterRequest) => AppThunk =
  body => async dispatch => {
    await dispatch(registerNewAccount(body));
    await dispatch(
      login({
        username: body.username,
        password: body.password,
        hash: body.hash,
      }),
    );
  };

export const login: (body: ILoginRequest) => AppThunk =
  body => async dispatch => {
    const result = await dispatch(authenticate(body));
    const response = (result.payload as AxiosResponse).data as ILoginResponse;
    await AsyncStorage.setItem(
      'token',
      JSON.stringify({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        accExpiredTime: response.accExpiredTime,
        refExpiredTime: response.refExpiredTime,
      }),
    );
    dispatch(getSession());
  };

export const Init: () => AppThunk = () => async dispatch => {
  const result = await AsyncStorage.getItem('token');
  if (result) {
    const token = JSON.parse(result);
    if (token.refExpiredTime > Date.now()) {
      await dispatch(getSession());
    } else {
      await AsyncStorage.removeItem('token');
    }
  }
};

export const getSession: () => AppThunk = () => async dispatch => {
  const result = await dispatch(getAccount());
  const response = (result.payload as AxiosResponse).data as IUserInfoResponse;
  await AsyncStorage.setItem('userInfo', JSON.stringify(response));
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
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        errorMessage: action.error.message,
      }))
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

export const {reset} = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
