import {Socket, io} from 'socket.io-client';

let socket: Socket;

export const connectSocket = () => {
  socket = io('http://192.168.101.7:3000');
};

export const getSocket = () => {
  return socket;
};
