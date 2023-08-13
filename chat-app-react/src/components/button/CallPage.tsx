import Peer from 'peerjs';
import { useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  setCallType,
  setCaller,
  setIsReceivingCall,
  setPeer,
  setReceiver,
} from '../../features/call/callSlice';
import { SocketContext } from '../../ultils/context/Socket';
import { CallPayload } from '../../ultils/interface';
import { RootState } from '../../app/store';

function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, '0');
}

function generateId(len: any) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

const user = {
  peer: {
    id: generateId(10),
  },
};

const CallPage = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const { isReceivingCall } = useAppSelector((state: RootState) => state.call);

  useEffect(() => {
    if (!user) return;
    const newPeer = new Peer(user.peer.id, {
      config: {
        iceServers: [
          {
            url: 'stun:stun.l.google.com:19302',
          },
          {
            url: 'stun:stun1.l.google.com:19302',
          },
        ],
      },
    });
    dispatch(setPeer(newPeer));
  }, []);

  useEffect(() => {
    socket.on('onVideoCall', (data: CallPayload) => {
      console.log('receiving video call....');
      console.log(data);
      if (isReceivingCall) return;
      dispatch(setCaller(data.caller));
      dispatch(setReceiver(user));
      dispatch(setIsReceivingCall(true));
      dispatch(setCallType('video'));
    });

    return () => {
      socket.off('onVideoCall');
    };
  }, [isReceivingCall]);

  return <div>CallPage</div>;
};

export default CallPage;
