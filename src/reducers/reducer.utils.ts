import {AnyAction, AsyncThunk, SerializedError} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

const commonErrorProperties: Array<keyof SerializedError> = [
  'name',
  'message',
  'stack',
  'code',
];

export function isRejectedAction(action: AnyAction) {
  return action.type.endsWith('/rejected');
}

export function isFulfilledAction(action: AnyAction) {
  return action.type.endsWith('/fulfilled');
}

export const serializeAxiosError = (
  value: any,
): AxiosError | SerializedError => {
  if (typeof value === 'object' && value !== null) {
    if (value.isAxiosError) {
      return value;
    } else {
      const simpleError: SerializedError = {};
      for (const property of commonErrorProperties) {
        if (typeof value[property] === 'string') {
          simpleError[property] = value[property];
        }
      }

      return simpleError;
    }
  }
  return {message: String(value)};
};
