import {Dispatch, createSlice} from '@reduxjs/toolkit';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {removeToken} from '../../utils/Storage';

const initialState: any = {
  userInfo: {} as IUserInfoResponse,
  isAuthenticated: false,
};

export type AuthenticateState = Readonly<typeof initialState>;

export const clearAuthentication = () => async (dispatch: Dispatch) => {
  await removeToken();
  dispatch(logout());
};

export const AuthenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: state => {
      state.isAuthenticated = true;
    },
    logout: () => ({
      ...initialState,
    }),
    getAccountInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const {authenticated, logout, getAccountInfo} =
  AuthenticationSlice.actions;
