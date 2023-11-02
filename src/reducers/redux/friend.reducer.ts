import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  friends: [],
  requisitions: [],
  suggestions: [],
  blocks: [],
  isLoading: true,
  error: null,
};

export const friendReducer = createReducer(initialState, {
  getBlockRequest: state => {
    state.isLoading = true;
  },
  getBlockSuccess: (state, action) => {
    state.isLoading = false;
    state.blocks.push(...action.payload);
  },
  getBlockFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  getFriendRequest: state => {
    state.isLoading = true;
  },
  getFriendSuccess: (state, action) => {
    state.isLoading = false;
    state.friends.push(...action.payload);
  },
  getFriendFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  getRequestFriendRequest: state => {
    state.isLoading = true;
  },
  getRequestFriendSuccess: (state, action) => {
    state.isLoading = false;
    state.requisitions.push(...action.payload);
  },
  getRequestFriendFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: state => {
    state.error = null;
  },
});
