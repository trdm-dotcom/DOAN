import {
  AnyAction,
  ReducersMapObject,
  ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';
import authentication from './authentications.reducer';
import otp from './otp.reducer';
import user from './user.reducer';
import friend from './friend.reducer';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

export const rootReducer: ReducersMapObject = {
  authentication,
  otp,
  user,
  friend,
};

const store = configureStore({
  reducer: rootReducer,
});

const getStore = () => store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default getStore;
