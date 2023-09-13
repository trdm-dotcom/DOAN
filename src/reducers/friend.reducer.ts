import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import {apiDelete, apiGet, apiPost, apiPut} from '../utils/Api';
import {serializeAxiosError} from './reducer.utils';
import IFriendResponse from '../models/response/IFriendResponse';

export const initialState: any = {
  friendSuggest: [] as IFriendResponse[],
  friendRequest: [] as IFriendResponse[],
  friendList: [] as IFriendResponse[],
  result: {} as any,
  loading: false,
  errorMessage: null,
};

export type FriendState = Readonly<typeof initialState>;

export const getSuggestByContact = createAsyncThunk(
  'friend/get_friend_suggest_by_contact',
  async () => await apiGet('/friend/suggestByContact'),
  {
    serializeError: serializeAxiosError,
  },
);

export const requestAddFriend = createAsyncThunk(
  'friend/request_add_friend',
  async (id: number) => await apiPost('/user/friend', {friend: id}),
  {
    serializeError: serializeAxiosError,
  },
);

export const getFriendRequest = createAsyncThunk(
  'friend/get_friend_request',
  async () => await apiGet('/user/friend/request'),
  {
    serializeError: serializeAxiosError,
  },
);

export const acceptFriendRequest = createAsyncThunk(
  'friend/accept_friend_request',
  async (id: number) => await apiPut('user/friend', {friend: id}),
  {
    serializeError: serializeAxiosError,
  },
);

export const rejectFriend = createAsyncThunk(
  'friend/reject_friend',
  async (id: number) => await apiDelete(`user/friend?friend=${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const getFriendList = createAsyncThunk(
  'friend/get_friend_list',
  async () => await apiGet('/user/friend'),
  {
    serializeError: serializeAxiosError,
  },
);

export const blockUser = createAsyncThunk(
  'friend/block_user',
  async (id: number) => await apiPost('/user/block', {block: id}),
  {
    serializeError: serializeAxiosError,
  },
);

export const unblockUser = createAsyncThunk(
  'friend/unblock_user',
  async (id: number) => await apiDelete(`/user/block?block=${id}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const FriendSlice = createSlice({
  name: 'friend',
  initialState: initialState as FriendState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getFriendList.fulfilled, (state, action) => {
        state.loading = false;
        state.friendList = action.payload.data as IFriendResponse[];
      })
      .addCase(getSuggestByContact.fulfilled, (state, action) => {
        state.loading = false;
        state.friendSuggest = action.payload.data as IFriendResponse[];
      })
      .addCase(getFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequest = action.payload.data as IFriendResponse[];
      })
      .addMatcher(
        isFulfilled(
          rejectFriend,
          acceptFriendRequest,
          rejectFriend,
          blockUser,
          unblockUser,
        ),
        (state, action) => ({
          ...state,
          loading: false,
          result: action.payload.data,
        }),
      )
      .addMatcher(
        isRejected(
          getFriendList,
          getSuggestByContact,
          getFriendRequest,
          requestAddFriend,
          acceptFriendRequest,
          rejectFriend,
          blockUser,
          unblockUser,
        ),
        (state, action) => ({
          ...state,
          loading: false,
          errorMessage: action.error.message,
        }),
      )
      .addMatcher(
        isPending(
          getFriendList,
          getSuggestByContact,
          getFriendRequest,
          requestAddFriend,
          acceptFriendRequest,
          rejectFriend,
          blockUser,
          unblockUser,
        ),
        state => {
          state.loading = true;
        },
      );
  },
});

export const {reset} = FriendSlice.actions;

// Reducer
export default FriendSlice.reducer;
