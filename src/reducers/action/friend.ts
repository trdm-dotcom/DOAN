import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';
import {IParam} from '../../models/IParam';

export const getSuggestFriend = async (queryParams: IParam) =>
  await apiGet<any>('/user/friend/suggestByContact', {
    params: queryParams,
  });

export const requestAddFriend = async (id: number) =>
  await apiPost<any>(
    '/user/friend/request',
    {data: {friend: id}},
    {
      'Content-Type': 'application/json',
    },
  );

export const getFriendRequest = async (queryParams: IParam) =>
  await apiGet<any>('/user/friend/request', {
    params: queryParams,
  });

export const acceptFriendRequest = async (id: number) =>
  await apiPut<any>(
    'user/friend',
    {
      data: {friend: id},
    },
    {
      'Content-Type': 'application/json',
    },
  );

export const rejectFriend = async (id: number) =>
  await apiDelete<any>('user/friend', {params: {friend: id}});

export const getFriendList = async (queryParams: IParam) =>
  await apiGet<any>('/user/friend', {
    params: queryParams,
  });

export const blockUser = async (id: number) =>
  await apiPost<any>(
    '/user/friend/block',
    {data: {friend: id}},
    {
      'Content-Type': 'application/json',
    },
  );

export const unblockUser = async (id: number) =>
  await apiDelete<any>('/user/friend/block', {params: {friend: id}});

export const getBlockList = async (queryParams: IParam) =>
  await apiGet<any>('/user/friend/block', {params: queryParams});

export const checkFriend = async (queryParams: IParam) =>
  await apiGet<any>('/user/checkFriend', {params: queryParams});

export const getFriendOfUser = async (queryParams: IParam) =>
  await apiGet<any>('/user/friendOfUser', {params: queryParams});

export const searchFriend = async (queryParams: IParam) =>
  await apiGet<any>('/user/friend/search', {params: queryParams});
