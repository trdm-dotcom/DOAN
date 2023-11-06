import {createReducer} from '@reduxjs/toolkit';

const intialState = {
  isAuthenticated: false,
  user: {},
  isLoading: false,
  loading: false,
  error: null,
};

export const userReducer = createReducer(intialState, {
  authenticated: state => {
    state.isAuthenticated = true;
  },
  userRegisterRequest: state => {
    state.loading = true;
  },
  userRegisterSuccess: state => {
    state.loading = false;
  },
  userRegisterFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  userLoginRequest: state => {
    state.isAuthenticated = false;
    state.loading = true;
  },
  userLoginSuccess: state => {
    state.isAuthenticated = true;
    state.loading = false;
  },
  userLoginFailed: (state, action) => {
    state.isAuthenticated = false;
    state.loading = false;
    state.error = action.payload;
  },
  userLogoutRequest: state => {
    state.loading = true;
  },
  userLogoutSuccess: state => {
    state.loading = false;
    state.isAuthenticated = false;
  },
  userLogoutFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  updateUserRequest: state => {
    state.loading = true;
  },
  updateUserSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
  },
  updateUserFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  getUsersRequest: state => {
    state.isLoading = true;
  },
  getUsersSuccess: (state, action) => {
    state.isLoading = false;
    state.user = action.payload;
  },
  getUsersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: state => {
    state.error = null;
  },
});
