import {createSlice} from '@reduxjs/toolkit';
import IFriendResponse from '../../models/response/IFriendResponse';

const initialState: any = {
  friendRequest: [] as IFriendResponse[],
  friendList: [] as IFriendResponse[],
  loading: false,
};

export type FriendState = Readonly<typeof initialState>;

export const FriendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    friendsRequest: (state, action) => {
      state.friendRequest = action.payload;
    },
    friendsList: (state, action) => {
      state.friendList = action.payload;
    },
  },
});

export const {friendsRequest, friendsList} = FriendSlice.actions;
