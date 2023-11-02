import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  chats: [],
  isLoading: true,
  error: null,
};

export const chatReducer = createReducer(initialState, {
  getChatRequest: state => {
    state.isLoading = true;
  },
  getChatSuccess: (state, action) => {
    state.isLoading = false;
    state.chats = action.payload;
  },
  getChatFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: state => {
    state.error = null;
  },
});
