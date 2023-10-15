import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {apiGet, apiPut} from '../../utils/Api';
import {IUpdateUserInfoRequest} from '../../models/request/IUpdateUserInfoRequest';
import IDisableUserRequest from '../../models/request/IDisableUserRequest';
import IUserConfirmRequest from '../../models/request/IUserConfirmRequest';
import {IParam} from '../../models/IParam';

export const initialState: any = {
  userInfo: {} as IUserInfoResponse,
  userInfos: [] as IUserInfoResponse[],
  result: {} as any,
  loading: false,
};

export type UserState = Readonly<typeof initialState>;

export const getUserInfo = async (queryParams?: IParam) =>
  await apiGet<IUserInfoResponse>('/user/info', {params: queryParams});

export const putUserInfo = async (body: IUpdateUserInfoRequest) =>
  await apiPut<any>(
    '/user/info',
    {
      data: body,
    },
    {
      'Content-Type': 'application/json',
    },
  );

export const disableUser = async (body: IDisableUserRequest) =>
  await apiPut<any>(
    '/user/disable',
    {
      data: body,
    },
    {
      'Content-Type': 'application/json',
    },
  );

export const confirmUser = async (body: IUserConfirmRequest) =>
  await apiPut<any>(
    '/user/confirm',
    {
      data: body,
    },
    {
      'Content-Type': 'application/json',
    },
  );
