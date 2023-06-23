import { createContext } from 'react';
import { io } from 'socket.io-client';

const userJson = localStorage.getItem('user');
const user = userJson ? (JSON.parse(userJson) as string) : null;
export const socket = io('http://localhost:8080', {
  withCredentials: true,
  transportOptions: {
    polling: {
      extraHeaders: {
        'x-user': JSON.stringify(user),
      },
    },
  },
});
export const SocketContext = createContext(socket);
