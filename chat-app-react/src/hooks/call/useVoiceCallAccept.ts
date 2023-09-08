import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { WebsocketEvents } from '../../ultils/constant';
import { ICallAcceptPayload } from '../../ultils/interface';
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
import { getUserLocalStorageItem } from '../../ultils';
import { useNavigate } from 'react-router-dom';

const userLocal = getUserLocalStorageItem();

export const useVoiceCallAccept = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { peer, localStream } = useAppSelector(selectCall);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(
      WebsocketEvents.ON_VOICE_CALL_ACCEPT,
      (data: ICallAcceptPayload) => {
        if (!peer) return console.log('AUDIO: No Peer');
        dispatch(setActiveConversationId(data.conversation._id));
        dispatch(setIsCallInProgress(true));
        dispatch(setIsReceivingCall(false));
        dispatch(setIsCalling(false));
        if (data.caller.userId === userLocal!._id) {
          console.log('AUDIO: connecting to peer now');
          const connection = peer.connect(data.acceptor.peerId);
          dispatch(setConnection(connection));
          if (!connection) return console.log('No connection');
          if (localStream) {
            console.log('AUDIO: calling peer now');
            const newCall = peer.call(data.acceptor.peerId, localStream);
            dispatch(setCall(newCall));
          }
        }
        dispatch(setTimeStartCall(new Date()));
        navigate('/call/audio');
      }
    );

    return () => {
      socket.off(WebsocketEvents.ON_VOICE_CALL_ACCEPT);
    };
  }, [peer, localStream]);
};
