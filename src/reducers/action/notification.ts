import {Dispatch} from '@reduxjs/toolkit';
import {IParam} from '../../models/IParam';
import {apiGet, apiPut} from '../../utils/Api';

export const getNotifications =
  (params: IParam) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: 'getNotificationRequest',
      });
      const res = await apiGet<any[]>('/notification', {params: params});
      dispatch({
        type: 'getNotificationSuccess',
        payload: res,
      });
    } catch (error: any) {
      dispatch({
        type: 'getNotificationFailed',
        payload: error.message,
      });
    }
  };

export const countUnreadNotifications = async () =>
  await apiGet<any>('/notification/count');

export const remarkNotification = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'remarkNotificationRequest',
    });
    await apiPut<any>('/notification');

    dispatch({
      type: 'remarkNotificationSuccess',
    });
  } catch (error: any) {
    dispatch({
      type: 'getNotificationFailed',
      payload: error.message,
    });
  }
};

export const settingReceiveNotification = async (body: IParam) =>
  await apiPut<any>(
    '/notification/receive',
    {data: body},
    {
      'Content-Type': 'application/json',
    },
  );

export const getNotificationSetting = async (params: IParam) =>
  await apiGet<any>('/notification/setting', {params: params});
