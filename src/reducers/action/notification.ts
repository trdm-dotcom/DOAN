import {IParam} from '../../models/IParam';
import {apiGet, apiPut} from '../../utils/Api';

export const getNotifications = async (params: IParam) =>
  await apiGet<any[]>('/notification', {params: params});

export const countUnreadNotifications = async () =>
  await apiGet<any>('/notification/count');

export const remarkNotification = async () =>
  await apiPut<any>('/notification');

export const settingReceiveNotification = async (params: IParam) =>
  await apiPut<any>('/notification/receive', {data: params});
