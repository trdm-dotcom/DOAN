import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';
import {IParam} from '../../models/IParam';
import IFriendResponse from '../../models/response/IFriendResponse';

export const getSuggestFriend = async (queryParams: IParam) =>
  await apiGet<IFriendResponse[]>('/user/friend/suggestByContact', {
    params: queryParams,
  });

export const requestAddFriend = async (id: number) =>
  await apiPost<any>(
    '/user/friend',
    {data: {friend: id}},
    {
      'Content-Type': 'application/json',
    },
  );

export const getFriendRequest = async () =>
  await apiGet<IFriendResponse[]>('/user/friend/request');

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

export const getFriendList = async () =>
  await apiGet<IFriendResponse[]>('/user/friend');

export const blockUser = async (id: number) =>
  await apiPost<any>(
    '/user/block',
    {data: {block: id}},
    {
      'Content-Type': 'application/json',
    },
  );

export const unblockUser = async (id: number) =>
  await apiDelete<any>('/user/block', {params: {block: id}});

export const getBlockList = async () => await apiGet<any[]>('/user/block');
