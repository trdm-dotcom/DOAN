import {Dispatch} from 'react';
import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

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

export const upPost = (data: IParam) =>
  apiPost<any>(
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

export const getPosts = (params: IParam) => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: 'getAllPostsRequest',
    });
    const res = await apiGet<any>('/social/post', {params: params});
    dispatch({
      type: 'getAllPostsSuccess',
      payload: res,
    });
  } catch (error: any) {
    dispatch({
      type: 'getAllPostsFailed',
      payload: error.message,
    });
  }
};

export const getPostOfUser = async (params: IParam) =>
  await apiGet<any>('/social/post/user', {params: params});

export const getPostHiden = async (params: IParam) =>
  await apiGet<any>('/social/post/hide', {params: params});

export const getPostTagged = async (params: IParam) =>
  await apiGet<any>('/social/post/tag', {params: params});

export const deleteComment = async (params: IParam) =>
  await apiDelete<any>('/social/post/comments', {params: params});

export const getPostDetail = async (params: IParam) =>
  await apiGet<any>('/social/post/detail', {params: params});
