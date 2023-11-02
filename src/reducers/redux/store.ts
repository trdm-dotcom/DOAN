import {AnyAction, ThunkAction, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AuthenticationSlice} from './authentication.reducer';
import {postReducer} from './post.reducer';
import {notifiReducer} from './notification.reducer';
import {chatReducer} from './chat.reducer';

const store = configureStore({
  reducer: {
    auth: AuthenticationSlice.reducer,
    post: postReducer,
    notification: notifiReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
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
