import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  chats: [],
  isLoading: true,
  error: null,
  nextPage: 0,
  totalPages: 0,
};

export const chatReducer = createReducer(initialState, {
  getChatsRequest: state => {
    state.error = null;
    state.isLoading = true;
  },
  getChatsSuccess: (state, action) => {
    state.isLoading = false;
    state.chats = action.payload;
    state.nextPage = action.payload.page + 1;
    state.totalPages = action.payload.totalPages;
    if (action.payload.page === 0) {
      state.chats = action.payload.datas;
    } else {
      state.chats = [...state.chats, ...action.payload.datas];
    }
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
  deleteChat: (state, action) => {
    state.chats = state.chats.filter(
      chat => chat.id !== action.payload.data.id,
    );
  },
  clearErrors: state => {
    state.error = null;
  },
});
