import {AnyAction, ThunkAction, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {FriendSlice} from './friend.reducer';
import {AuthenticationSlice} from './authentication.reducer';

const store = configureStore({
  reducer: {
    auth: AuthenticationSlice.reducer,
    friend: FriendSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          'payload.headers',
          'payload.config',
          'payload.request',
          'error',
          'meta.arg',
        ],
      },
      immutableCheck: {warnAfter: 128},
    }),
});

const getStore = () => store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default getStore;
