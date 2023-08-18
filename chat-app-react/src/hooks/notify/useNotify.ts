import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch } from '../../app/hook';
import { INotify } from '../../ultils/interface';
import {
  deleteNotify,
  receivedNotify,
} from '../../features/notify/notifySlice';
import { useCountDown } from '../useCountDown';

export const useNotify = (showNotify: boolean, setShowNotify: any) => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useCountDown(showNotify, () => setShowNotify(false), showNotify);

  // Socket received request add friend
  const handleReceivedNotify = (data: INotify) => {
    setShowNotify(true);
    dispatch(receivedNotify(data));
  };

  // Socket received Friend cancel request
  const handleDeleteNotify = (data: INotify) => {
    dispatch(deleteNotify(data));
  };
  useEffect(() => {
    socket.on('connection', (data: any) => {
      console.log(data);
    });
    socket.on('receivedNotify', handleReceivedNotify);
    socket.on('deleteNotify', handleDeleteNotify);

    return () => {
      socket.off('receivedNotify');
      socket.off('deleteNotify');
    };
  }, []);
};
