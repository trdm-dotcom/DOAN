import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  notifications: [],
  isLoading: true,
  error: null,
};

export const notifiReducer = createReducer(initialState, {
  getNotificationRequest: state => {
    state.isLoading = true;
  },
  getNotificationSuccess: (state, action) => {
    state.isLoading = false;
    state.notifications.push(...action.payload);
  },
  getNotificationFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  remarkNotificationRequest: state => {
    state.isLoading = true;
  },
  remarkNotificationSuccess: state => {
    state.isLoading = false;
  },
  remarkNotificationFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: state => {
    state.error = null;
  },
});
