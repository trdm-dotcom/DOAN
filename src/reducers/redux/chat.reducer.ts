import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  chats: [],
  isLoading: true,
  error: null,
};

export const chatReducer = createReducer(initialState, {
  getChatsRequest: state => {
    state.isLoading = true;
  },
  getChatsSuccess: (state, action) => {
    state.isLoading = false;
    state.chats = action.payload;
  },
  getChatsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  updateChats: (state, action) => {
    const existingIndex = state.chats.findIndex(
      chat => chat.id === action.payload.data.id,
    );
    existingIndex !== -1
      ? (state.chats[existingIndex] = action.payload.data)
      : state.chats.push(action.payload.data);
  },
  clearErrors: state => {
    state.error = null;
  },
});
