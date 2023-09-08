import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch } from '../../app/hook';
import { resetState } from '../../features/call/callSlice';
import { WebsocketEvents } from '../../ultils/constant';

export function useSenderRejectCall() {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on(WebsocketEvents.ON_SENDER_REJECT_CALL, () => {
      dispatch(resetState());
    });

    return () => {
      socket.off(WebsocketEvents.ON_VIDEO_CALL);
    };
  }, []);
}
