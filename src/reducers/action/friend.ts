import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';
import {IParam} from '../../models/IParam';
import IFriendResponse from '../../models/response/IFriendResponse';
import {AppThunk} from '../redux/store';
import {friendsList, friendsRequest} from '../redux/friend.reducer';

export const getSuggestFriend =
  (queryParams: IParam): AppThunk =>
  async dispatch => {
    const response: IFriendResponse[] = await apiGet<IFriendResponse[]>(
      '/user/friend/suggestByContact',
      {params: queryParams},
    );
    dispatch(friendsList(response));
  };

export const requestAddFriend = async (id: number) =>
  await apiPost<any>(
    '/user/friend',
    {data: {friend: id}},
    {
      'Content-Type': 'application/json',
    },
  );

export const getFriendRequest = (): AppThunk => async dispatch => {
  const response: IFriendResponse[] = await apiGet<IFriendResponse[]>(
    '/user/friend/request',
  );
  dispatch(friendsRequest(response));
};

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

export const getFriendList = (): AppThunk => async dispatch => {
  const response: IFriendResponse[] = await apiGet<IFriendResponse[]>(
    '/user/friend',
  );
  dispatch(friendsList(response));
};

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
