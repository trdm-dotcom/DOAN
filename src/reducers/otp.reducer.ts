import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import IOtpRequest from '../models/request/IOtpRequest.model';
import {serializeAxiosError} from './reducer.utils';
import IVerifyOtpRequest from '../models/request/IVerifyOtprRequest';
import {apiPost} from '../utils/Api';

export const initialState: any = {
  loading: false,
  errorMessage: null,
};

export type OtpState = Readonly<typeof initialState>;

export const getOtp = createAsyncThunk(
  'otp/get',
  async (body: IOtpRequest) =>
    await apiPost('/otp', body, {
      'Content-Type': 'application/json',
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const verifyOtp = createAsyncThunk(
  'otp/verify',
  async (body: IVerifyOtpRequest) =>
    await apiPost('/otp/verify', body, {
      'Content-Type': 'application/json',
    }),
  {
    serializeError: serializeAxiosError,
  },
);

export const OtpSlice = createSlice({
  name: 'otp',
  initialState: initialState as OtpState,
  reducers: {
    reset() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getOtp, verifyOtp), state => {
        state.loading = false;
      })
      .addMatcher(isPending(getOtp, verifyOtp), state => {
        state.loading = true;
      })
      .addMatcher(isRejected(getOtp, verifyOtp), (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const {reset} = OtpSlice.actions;

// Reducer
export default OtpSlice.reducer;
