import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  notifications: [],
  isLoading: true,
  error: null,
  nextPage: 0,
  totalPages: 0,
};

export const notifiReducer = createReducer(initialState, {
  getNotificationRequest: state => {
    state.error = null;
    state.isLoading = true;
  },
  getNotificationSuccess: (state, action) => {
    state.isLoading = false;
    state.nextPage = action.payload.page + 1;
    state.totalPages = action.payload.totalPages;
    if (action.payload.page === 0) {
      state.notifications = action.payload.datas;
    } else {
      const newNotifications = action.payload.datas.filter(
        newNoti => !state.notifications.some(noti => noti.id === newNoti.id),
      );
      state.notifications = [...state.notifications, ...newNotifications];
    }
  },
  getNotificationFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: state => {
    state.error = null;
  },
});
