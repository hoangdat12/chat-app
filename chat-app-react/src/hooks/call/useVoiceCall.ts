import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { WebsocketEvents } from '../../ultils/constant';
import { CallPayload } from '../../ultils/interface';
import { useAppDispatch } from '../../app/hook';
import {
  setActiveConversationId,
  setCallType,
  setCaller,
  setIsReceivingCall,
  setReceiver,
  setTimeStartCall,
} from '../../features/call/callSlice';

export const useVoiceCall = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on(WebsocketEvents.ON_VOICE_CALL, (data: CallPayload) => {
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(data.receiver));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType('audio'));
      dispatch(setActiveConversationId(data.conversationId));
      dispatch(setTimeStartCall(new Date()));
    });

    return () => {
      socket.off(WebsocketEvents.ON_VOICE_CALL);
    };
  }, []);
};
