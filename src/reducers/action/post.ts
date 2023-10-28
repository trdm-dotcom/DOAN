import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

export const deleteComment = async (params: IParam) =>
  await apiDelete<any>('/social/comment', {params: params});

export const addComment = async (data: IParam) =>
  await apiPost<any>(
    '/social/comment',
    {data: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const postLike = async (data: IParam) =>
  await apiPost<any>(
    '/social/reaction',
    {data: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const upPost = async (data: IParam) =>
  await apiPost<any>(
    '/social/post',
    {data: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const deletePost = async (params: IParam) =>
  await apiDelete<any>('/social/post', {params: params});

export const updatePost = async (data: IParam) =>
  await apiPut<any>(
    '/social/post',
    {data: data},
    {
      'Content-Type': 'application/json',
    },
  );

export const disablePost = async (params: IParam) =>
  await apiPut<any>(
    '/social/post/disable',
    {data: params},
    {
      'Content-Type': 'application/json',
    },
  );

export const getCommentsOfPost = async (params: IParam) =>
  await apiGet<any[]>('/social/post/comments', {params: params});

export const getReactionsOfPost = async (params: IParam) =>
  await apiGet<any[]>('/social/post/reactions', {params: params});

export const getPosts = async (params: IParam) =>
  await apiGet<any[]>('/social/post', {params: params});

export const getPostOfUser = async (params: IParam) =>
  await apiGet<any[]>('/social/post/user', {params: params});
