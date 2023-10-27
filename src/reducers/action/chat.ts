import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

export const getConversations = async (params: IParam) =>
  await apiGet<any[]>('/chat/conversation', {params: params});

export const getMessagesByRoomId = async (params: IParam) =>
  await apiGet<any[]>('/chat/conversation/messages', {params: params});

export const deleteChat = async (roomId: string) =>
  await apiDelete<any>('/chat/conversation', {params: {roomId}});

export const sendMessage = async (body: IParam) =>
  await apiPost<any>('/chat/message', {
    data: body,
  });

export const messageSeen = async (roomId: string) =>
  await apiPut<any>('/chat/conversation', {params: roomId});
