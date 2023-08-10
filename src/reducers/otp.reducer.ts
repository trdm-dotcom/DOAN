import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import IOtpRequest from '../models/request/IOtpRequest.model';
import {serializeAxiosError} from './reducer.utils';
import IVerifyOtpRequest from '../models/request/IVerifyOtprRequest';
import IOtpResponse from '../models/response/IOtpResponse';
import IVerifyOtpResponse from '../models/response/IVerifyOtpResponse';
import {apiPost} from '../utils/Api';

export const initialState: any = {
  dataGetOtp: {} as IOtpResponse,
  dataVerifyOtp: {} as IVerifyOtpResponse,
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
      .addCase(getOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.dataGetOtp = action.payload.data;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.dataVerifyOtp = action.payload.data;
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
