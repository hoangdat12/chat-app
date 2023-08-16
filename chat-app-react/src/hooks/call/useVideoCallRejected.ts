import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { WebsocketEvents } from '../../ultils/constant';
import { resetState, selectCall } from '../../features/call/callSlice';
import { getUserLocalStorageItem } from '../../ultils';

const userLocal = getUserLocalStorageItem();

export const useVideoCallRejected = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { localStream } = useAppSelector(selectCall);

  useEffect(() => {
    socket.on(WebsocketEvents.ON_VIDEO_CALL_REJECT, (data) => {
      dispatch(resetState());
      if (data.caller.userId === userLocal._id) {
        localStream &&
          localStream.getTracks().forEach((track) => {
            track.stop();
          });
      }
    });

    return () => {
      socket.off(WebsocketEvents.ON_VIDEO_CALL_REJECT);
    };
  }, [localStream]);
};
