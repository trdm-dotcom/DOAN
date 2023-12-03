import {Socket, io} from 'socket.io-client';

let socket: Socket;

export const connectSocket = () => {
  socket = io('http://103.90.227.59:3000');
};

export const getSocket = () => {
  return socket;
};
