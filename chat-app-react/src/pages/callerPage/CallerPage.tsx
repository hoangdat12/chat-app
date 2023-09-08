import { Outlet, useParams } from 'react-router-dom';
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
import { useContext, useEffect, useState } from 'react';
import { getUserLocalStorageItem } from '../../ultils';
import Peer from 'peerjs';
import { useVideoCallAccept } from '../../hooks/call/useVideoCallAccept';
import { useVideoCallRejected } from '../../hooks/call/useVideoCallRejected';
import { useVideoClose } from '../../hooks/call/useVideoClose';
import { useVoiceCall } from '../../hooks/call/useVoiceCall';
import { useVoiceCallAccept } from '../../hooks/call/useVoiceCallAccept';
import { useVoiceCallRejected } from '../../hooks/call/useVoiceCallRejected';
import { useVoiceCallClose } from '../../hooks/call/useVoiceCallClose';
import CallHidden from '../../components/call/VideoCallHidden';
import VoiceCallHidden from '../../components/call/VoiceCallHidden';
import CallEndNotify from '../../components/call/CallEndNotify';
import {
  ErrorAlert,
  NotifyAlert,
  SuccessAlert,
} from '../../components/alert/Alert';
import { SocketContext } from '../../ultils/context/Socket';
import { useCountDown } from '../../hooks/useCountDown';
import {
  deleteNotify,
  receivedNotify,
} from '../../features/notify/notifySlice';
import { IMessage, INotify } from '../../ultils/interface';
import {
  selectMessage,
  setUnReadNumberMessage,
} from '../../features/message/messageSlice';
import { fetchConversationOfUser } from '../../features/conversation/conversationSlice';
import { selectShowError } from '../../features/showError';
import WaitingAcceptCall from '../../components/call/WaitingAcceptCall';
import { useSenderRejectCall } from '../../hooks/call/useSenderRejectCall';

const userLocal = getUserLocalStorageItem();

const CallerPage = () => {
  const [showNotify, setShowNotify] = useState(false);
  const [showNewMessageConversation, setShowNewMessageConversation] =
    useState(false);
  const { conversationId } = useParams();

  const dispatch = useAppDispatch();
  const {
    isReceivingCall,
    caller,
    peer,
    callType,
    connection,
    call,
    isCallInProgress,
    isMini,
    endCall,
    isCalling,
  } = useAppSelector(selectCall);
  const { unReadMessageOfConversation } = useAppSelector(selectMessage);
  const { isError, isSuccess, isNotify } = useAppSelector(selectShowError);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!userLocal) return;
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
  useVoiceCall();

  useEffect(() => {
    if (!peer) {
      return;
    }
    peer.on('call', async (incomingCall: any) => {
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
  useVoiceCallAccept();
  useVoiceCallRejected();
  useVoiceCallClose();
  useSenderRejectCall();

  useEffect(() => {
    if (connection) {
      if (connection) {
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

  useCountDown(showNotify, () => setShowNotify(false), showNotify);

  // Socket received request add friend
  const handleReceivedNotify = (data: INotify) => {
    setShowNotify(true);
    dispatch(receivedNotify(data));
  };

  // Socket received Friend cancel request
  const handleDeleteNotify = (data: INotify) => {
    dispatch(deleteNotify(data));
  };

  useEffect(() => {
    socket.on('connection', (data: any) => {
      console.log(data);
    });
    socket.on('receivedNotify', handleReceivedNotify);
    socket.on('deleteNotify', handleDeleteNotify);

    return () => {
      socket.off('connection', (data: any) => {
        console.log(data);
      });
      socket.off('receivedNotify');
      socket.off('deleteNotify');
    };
  }, []);

  useCountDown(
    showNewMessageConversation,
    () => setShowNewMessageConversation(false),
    showNewMessageConversation,
    5000
  );

  useEffect(() => {
    socket.on('onMessage', (data: IMessage) => {
      if (conversationId) return;
      console.log('Show');
      if (
        unReadMessageOfConversation.indexOf(data.message_conversation) === -1
      ) {
        setShowNewMessageConversation(true);
        dispatch(
          setUnReadNumberMessage({
            quantity: 1,
            conversationId: data.message_conversation,
          })
        );
      }
    });

    return () => {
      socket.off('onMessage');
    };
  }, []);

  useEffect(() => {
    dispatch(fetchConversationOfUser(userLocal._id));
  }, [userLocal]);

  return (
    <div className='relative'>
      {isReceivingCall && caller && <CallReceiveDialog />}
      {isCalling && caller && <WaitingAcceptCall />}
      {isCallInProgress &&
        isMini &&
        (callType === 'video' ? <CallHidden /> : <VoiceCallHidden />)}
      {endCall && <CallEndNotify />}
      {(showNotify || isNotify) && (
        <NotifyAlert msg={'You have some new notify'} />
      )}
      {showNewMessageConversation && (
        <NotifyAlert msg={'You have some new message'} />
      )}
      {isError && <ErrorAlert msg={'Have some error, please try again!'} />}
      {isSuccess && <SuccessAlert msg={'Successfully!'} />}
      <Outlet />
    </div>
  );
};

export default CallerPage;
