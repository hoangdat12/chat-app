import { useContext, useEffect } from 'react';
import { SocketContext } from '../../ultils/context/Socket';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  selectCall,
  setActiveConversationId,
  setCallType,
  setCaller,
  setIsReceivingCall,
  setReceiver,
} from '../../features/call/callSlice';
import { CallPayload } from '../../ultils/interface';
import { WebsocketEvents } from '../../ultils/constant';

export function useVideoCall() {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { isReceivingCall } = useAppSelector(selectCall);

  useEffect(() => {
    socket.on(WebsocketEvents.ON_VIDEO_CALL, (data: CallPayload) => {
      console.log('Receiving call:::: ', data);
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(data.receiver));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType('video'));
      dispatch(setActiveConversationId(data.conversationId));
    });

    return () => {
      socket.off(WebsocketEvents.ON_VIDEO_CALL);
    };
  }, []);
}
