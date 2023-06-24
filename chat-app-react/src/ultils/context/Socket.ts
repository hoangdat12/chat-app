import { createContext } from 'react';
import { io } from 'socket.io-client';
import { getUserLocalStorageItem } from '..';

const user = getUserLocalStorageItem();
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
