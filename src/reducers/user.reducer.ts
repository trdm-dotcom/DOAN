import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import {IUserInfoResponse} from '../models/response/IUserInfoResponse';
import {apiGet, apiPut} from '../utils/Api';
import {serializeAxiosError} from './reducer.utils';
import {IUpdateUserInfoRequest} from '../models/request/IUpdateUserInfoRequest';
import IDisableUserRequest from '../models/request/IDisableUserRequest';
import IUserConfirmRequest from '../models/request/IUserConfirmRequest';

export const initialState: any = {
  userInfo: {} as IUserInfoResponse,
  userInfos: [] as IUserInfoResponse[],
  result: {} as any,
  loading: false,
  errorMessage: null,
};

export type UserState = Readonly<typeof initialState>;

export const getUserInfo = createAsyncThunk(
  'user/get_user_info',
  async () => await apiGet('/user/info'),
  {
    serializeError: serializeAxiosError,
  },
);

export const putUserInfo = createAsyncThunk(
  'user/put_user_info',
  async (body: IUpdateUserInfoRequest) => await apiPut('/user/info', body),
  {
    serializeError: serializeAxiosError,
  },
);

export const searchUser = createAsyncThunk(
  'user/search_user',
  async (body: any) => await apiGet(`/user/search?search=${body}`),
  {
    serializeError: serializeAxiosError,
  },
);

export const disableUser = createAsyncThunk(
  'user/disable_user',
  async (body: IDisableUserRequest) => await apiPut('/user/disable', body),
  {
    serializeError: serializeAxiosError,
  },
);

export const confirmUser = createAsyncThunk(
  'user/confirm_user',
  async (body: IUserConfirmRequest) => await apiPut('/user/confirm', body),
  {
    serializeError: serializeAxiosError,
  },
);

export const UserSlice = createSlice({
  name: 'user',
  initialState: initialState as UserState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.data as IUserInfoResponse;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfos = action.payload.data as IUserInfoResponse[];
      })
      .addMatcher(
        isFulfilled(putUserInfo, disableUser, confirmUser),
        (state, action) => ({
          ...state,
          loading: false,
          result: action.payload.data,
        }),
      )
      .addMatcher(
        isRejected(
          getUserInfo,
          searchUser,
          putUserInfo,
          disableUser,
          confirmUser,
        ),
        (state, action) => ({
          ...state,
          loading: false,
          errorMessage: action.error.message,
        }),
      )
      .addMatcher(
        isPending(
          getUserInfo,
          searchUser,
          putUserInfo,
          disableUser,
          confirmUser,
        ),
        state => {
          state.loading = true;
        },
      );
  },
});

export const {reset} = UserSlice.actions;

// Reducer
export default UserSlice.reducer;
