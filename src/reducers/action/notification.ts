import {IParam} from '../../models/IParam';
import {apiGet, apiPut} from '../../utils/Api';

export const getNotifications = async (params: IParam) =>
  await apiGet('/notification', {params: params});

export const countUnreadNotifications = async () =>
  await apiGet('/notification/count');

export const remarkNotification = async () => await apiPut('/notification');

export const settingReceiveNotification = async (params: IParam) => {
  await apiPut('/notification/receive', {data: params});
};
