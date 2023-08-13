import { Outlet } from 'react-router-dom';
import CallReceiveDialog from '../../components/call/CallReceiveDialog';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  selectCall,
  setCall,
  setLocalStream,
  setPeer,
  setRemoteStream,
} from '../../features/call/callSlice';
import { useVideoCall } from '../../hooks/call/useVideoCall';
import { useEffect } from 'react';
import { getUserLocalStorageItem } from '../../ultils';
import Peer from 'peerjs';
import { useVideoCallAccept } from '../../hooks/call/useVideoCallAccept';
import { useVideoCallRejected } from '../../hooks/call/useVideoCallRejected';
import { useVideoClose } from '../../hooks/call/useVideoClose';

const userLocal = getUserLocalStorageItem();

const CallerPage = () => {
  const dispatch = useAppDispatch();
  const { isReceivingCall, caller, peer, callType, connection, call } =
    useAppSelector(selectCall);

  useEffect(() => {
    if (!userLocal) return;
    console.log('Listening peer with Id:::: ', userLocal.peer);
    const newPeer = new Peer(userLocal.peer, {
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
  }, [userLocal]);

  useVideoCall();

  useEffect(() => {
    if (!peer) {
      return;
    }
    peer.on('call', async (incomingCall) => {
      const constraints = { video: callType === 'video', audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      incomingCall.answer(stream);
      dispatch(setLocalStream(stream));
      dispatch(setCall(incomingCall));
    });
    return () => {
      peer.off('call');
    };
  }, [peer, callType, dispatch]);

  useEffect(() => {
    if (!call) {
      return;
    }
    call.on('stream', (remoteStream) => {
      dispatch(setRemoteStream(remoteStream));
    });
    call.on('close', () => console.log('call was closed'));
    return () => {
      call.off('stream');
      call.off('close');
    };
  }, [call]);

  useVideoCallAccept();
  useVideoCallRejected();
  useVideoClose();

  useEffect(() => {
    if (connection) {
      console.log('connection is defined....');
      if (connection) {
        console.log('connection is defined...');
        connection.on('open', () => {
          console.log('connection was opened');
        });
        connection.on('error', () => {
          console.log('an error has occured');
        });
        connection.on('data', (data) => {
          console.log('data received', data);
        });
        connection.on('close', () => {
          console.log('connection closed');
        });
      }
      return () => {
        connection?.off('open');
        connection?.off('error');
        connection?.off('data');
      };
    }
  }, [connection]);

  return (
    <>
      {isReceivingCall && caller && <CallReceiveDialog />}
      {/* {true && true && <CallReceiveDialog />} */}
      <Outlet />
    </>
  );
};

export default CallerPage;
