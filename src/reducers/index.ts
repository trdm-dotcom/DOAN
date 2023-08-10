import {ReducersMapObject} from 'redux';
import authentication from './authentications.reducer';
import otp from './otp.reducer';

export const rootReducer: ReducersMapObject = {
  authentication,
  otp,
};
