import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

export const deleteComment = async (params: IParam) =>
  await apiDelete<any>('/social/comment', {params: params});

export const addComment = async (data: IParam) =>
  await apiPost<any>(
    '/social/comment',
    {params: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const postLike = async (data: IParam) =>
  await apiPost<any>(
    '/social/like',
    {params: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const upPost = async (data: IParam) =>
  await apiPost<any>(
    '/social/post',
    {params: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const deletePost = async (params: IParam) =>
  await apiDelete<any>('/social/post', {params: params});

export const updatePost = async (data: IParam) =>
  await apiPut<any>(
    '/social/post',
    {params: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const disablePost = async (params: IParam) =>
  await apiPut<any>(
    '/social/post/disable',
    {params: params},
    {
      'Content-Type': 'application/json',
    },
  );

export const getCommentsOfPost = async (postId: string, params: IParam) =>
  await apiGet<any>(`/social/post/${postId}/comments`, {params: params});

export const getReactionsOfPost = async (postId: string, params: IParam) =>
  await apiGet<any>(`/social/post/${postId}/reactions`, {params: params});
