import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  resetState,
  selectCall,
  setEndCall,
} from '../../features/call/callSlice';
import { WebsocketEvents } from '../../ultils/constant';

export const useVoiceCallClose = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { call, connection, localStream, remoteStream } =
    useAppSelector(selectCall);

  useEffect(() => {
    socket.on(WebsocketEvents.ON_VOICE_CLOSE, () => {
      localStream &&
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      remoteStream &&
        remoteStream.getTracks().forEach((track) => {
          track.stop();
        });
      call && call.close();
      connection && connection.close();
      dispatch(resetState());
      dispatch(setEndCall(true));
    });

    return () => {
      socket.off(WebsocketEvents.ON_VOICE_CLOSE);
    };
  }, [call, remoteStream, localStream, connection]);
};
