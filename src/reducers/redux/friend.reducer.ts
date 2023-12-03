import {createReducer} from '@reduxjs/toolkit';

const initialState: any = {
  totalFriends: 0,
  friends: [],
  requisitions: [],
  suggestions: [],
  blocks: [],
  isLoading: true,
  error: null,
  nextPage: 0,
  totalPages: 0,
};

export const friendReducer = createReducer(initialState, {
  getBlockRequest: state => {
    state.error = null;
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
    state.error = null;
    state.isLoading = true;
  },
  getFriendSuccess: (state, action) => {
    state.isLoading = false;
    state.nextPage = action.payload.page + 1;
    state.totalPages = action.payload.totalPages;
    state.totalFriends = action.payload.total;
    if (action.payload.page === 0) {
      state.friends = action.payload.datas;
    } else {
      const newFriends = action.payload.filter(
        newFriend =>
          !state.friends.datas.some(friend => friend.id === newFriend.id),
      );
      state.friends = [...state.friends, ...newFriends];
    }
  },
  getFriendFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  removeFriend: (state, action) => {
    const existingIndex = state.friends.findIndex(
      friend => friend.id === action.payload.id,
    );
    if (existingIndex !== -1) {
      state.friends.splice(existingIndex, 1);
    }
  },
  addFriend: (state, action) => {
    const newFriends = action.payload.filter(
      newFriend => !state.friends.some(friend => friend.id === newFriend.id),
    );
    state.friends = [...state.friends, ...newFriends];
  },
  incrementTotalFriend: state => {
    state.totalFriends++;
  },
  decrementTotalFriend: state => {
    state.totalFriends--;
  },
  clearErrors: state => {
    state.error = null;
  },
});
