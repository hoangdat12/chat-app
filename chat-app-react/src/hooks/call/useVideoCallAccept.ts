import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  selectCall,
  setActiveConversationId,
  setCall,
  setConnection,
  setIsCallInProgress,
  setIsCalling,
  setIsReceivingCall,
  setTimeStartCall,
} from '../../features/call/callSlice';
import { ICallAcceptPayload } from '../../ultils/interface';
import { getUserLocalStorageItem } from '../../ultils';
import { useNavigate } from 'react-router-dom';
import { WebsocketEvents } from '../../ultils/constant';

const userLocal = getUserLocalStorageItem();

export const useVideoCallAccept = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { peer, localStream } = useAppSelector(selectCall);

  useEffect(() => {
    socket.on(
      WebsocketEvents.ON_VIDEO_CALL_ACCEPT,
      (data: ICallAcceptPayload) => {
        dispatch(setIsCallInProgress(true));
        dispatch(setIsReceivingCall(false));
        dispatch(setIsCalling(false));
        dispatch(setActiveConversationId(data.conversation._id));
        if (!peer) return console.log('No peer....');
        if (data.caller.userId === userLocal!._id) {
          const connection = peer.connect(data.acceptor.peerId);
          dispatch(setConnection(connection));
          if (!connection) return console.log('No connection');
          if (localStream) {
            const newCall = peer.call(data.acceptor.peerId, localStream);
            dispatch(setCall(newCall));
          }
        }
        dispatch(setTimeStartCall(new Date()));
        navigate('/call');
      }
    );
    return () => {
      socket.off(WebsocketEvents.ON_VIDEO_CALL_ACCEPT);
    };
  }, [peer, localStream]);
};
