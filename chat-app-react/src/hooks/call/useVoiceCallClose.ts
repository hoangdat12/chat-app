import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { WebsocketEvents } from '../../ultils/constant';

export const useVoiceCallClose = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { call, connection, localStream, remoteStream } =
    useAppSelector(selectCall);

  useEffect(() => {
    socket.on(WebsocketEvents.ON_VOICE_CLOSE, () => {
      console.log('received onVoiceCallHangUp');
      localStream &&
        localStream.getTracks().forEach((track) => {
          console.log(localStream.id);
          console.log('stopping local track: ', track);
          track.stop();
        });
      console.log(remoteStream);
      remoteStream &&
        remoteStream.getTracks().forEach((track) => {
          console.log(remoteStream.id);
          console.log('stopping remote track', track);
          track.stop();
        });
      call && call.close();
      connection && connection.close();
      dispatch(resetState());
    });

    return () => {
      socket.off(WebsocketEvents.ON_VOICE_CLOSE);
    };
  }, [call, remoteStream, localStream, connection]);
};
