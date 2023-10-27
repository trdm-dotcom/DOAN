import {IParam} from '../../models/IParam';
import {apiDelete, apiGet, apiPost, apiPut} from '../../utils/Api';

export const getConversations = async (params: IParam) =>
  await apiGet<any[]>('/chat/conversation', {params: params});

export const getMessagesByRoomId = async (roomId: string) =>
  await apiGet<any[]>('/chat/conversation/messages', {params: {roomId}});

export const deleteChat = async (roomId: string) =>
  await apiDelete<any>('/chat/conversation', {params: {roomId}});

export const sendMessage = async (recipientId: number, message: string) =>
  await apiPost<any>('/chat/message', {
    data: {
      message: message,
      recipientId: recipientId,
    },
  });

export const messageSeen = async (roomId: string) =>
  await apiPut<any>('/chat/conversation', {params: roomId});
