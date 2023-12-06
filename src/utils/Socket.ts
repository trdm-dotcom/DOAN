import {Socket, io} from 'socket.io-client';
import {SOCKET_URL} from '@env';

let socket: Socket;

export const connectSocket = () => {
  socket = io(SOCKET_URL);
};

export const getSocket = () => {
  return socket;
};
