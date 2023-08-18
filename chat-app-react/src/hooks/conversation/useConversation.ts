import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useCountDown } from '../useCountDown';

export const useConversation = (
  receivedNewMessage: boolean,
  setReceivedNewMessage: any
) => {
  const socket = useContext(SocketContext);

  useCountDown(
    receivedNewMessage,
    () => setReceivedNewMessage(false),
    receivedNewMessage
  );

  useEffect(() => {
    socket.on('onReceivedNewMessage', () => {
      setReceivedNewMessage(true);
    });

    return () => {
      socket.off('onReceivedNewMessage');
    };
  }, []);
};
