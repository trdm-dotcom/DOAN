import {Dispatch} from 'react';
import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

export const getConversations =
  (params: IParam) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({
        type: 'getChatsRequest',
      });
      const res = await apiGet<any>('/chat/conversation', {params: params});
      dispatch({
        type: 'getChatsSuccess',
        payload: res,
      });
    } catch (error: any) {
      dispatch({
        type: 'getChatsFailed',
        payload: error.message,
      });
    }
  };

export const getMessagesByRoomId = async (params: IParam) =>
  await apiGet<any[]>('/chat/conversation/messages', {params: params});

export const deleteChat = async (roomId: string) =>
  await apiDelete<any>('/chat/conversation', {params: {roomId}});

export const sendMessage = async (body: IParam) =>
  await apiPost<any>(
    '/chat/message',
    {
      data: body,
    },
    {
      'Content-Type': 'application/json',
    },
  );

export const messageSeen = async (roomId: string) =>
  await apiPut<any>(
    '/chat/conversation',
    {params: roomId},
    {
      'Content-Type': 'application/json',
    },
  );
