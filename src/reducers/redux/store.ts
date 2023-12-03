import {
  AnyAction,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {postReducer} from './post.reducer';
import {notifiReducer} from './notification.reducer';
import {chatReducer} from './chat.reducer';
import {userReducer} from './user.reducer';
import {friendReducer} from './friend.reducer';

const rootReducer = (state, action) => {
  if (action.type === 'logout') {
    state = undefined;
  }

  return combineReducers({
    post: postReducer,
    notification: notifiReducer,
    chat: chatReducer,
    user: userReducer,
    friend: friendReducer,
  })(state, action);
};

const store = configureStore({
  reducer: rootReducer,
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
