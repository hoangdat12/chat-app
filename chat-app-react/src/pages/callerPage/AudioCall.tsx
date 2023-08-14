import { useEffect, useRef, useState } from 'react';
import { BsFillChatFill, BsFillPersonPlusFill } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { resetState, selectCall } from '../../features/call/callSlice';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/avatars/Avatar';
import { Button } from './VideoCall';
import { getUserLocalStorageItem } from '../../ultils';
import { IParticipant } from '../../ultils/interface';
import VoiceCallControll from '../../components/call/VoiceCallControllt';

const userLocal = getUserLocalStorageItem();

export const getUserAvatar = (
  caller: IParticipant | undefined,
  receiver: IParticipant | undefined
) => {
  if (caller && receiver) {
    if (userLocal._id === caller.userId)
      return {
        owner: caller,
        friend: receiver,
      };
    else
      return {
        owner: receiver,
        friend: caller,
      };
  } else
    return {
      owner: null,
      friend: null,
    };
};

const AudioCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [owner, setOwner] = useState<IParticipant | null>(null);
  const [friend, setFriend] = useState<IParticipant | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isCalling, localStream, remoteStream, caller, receiver } =
    useAppSelector(selectCall);

  useEffect(() => {
    const getUser = () => {
      const { owner, friend } = getUserAvatar(caller, receiver);
      setOwner(owner);
      setFriend(friend);
    };
    getUser();
  }, [caller, receiver]);

  useEffect(() => {
    if (!isCalling) {
      dispatch(resetState());
      navigate(-1);
    }
  }, [isCalling]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className='relative w-screen h-screen bg-[#414143]'>
      <div className='relative w-full h-full flex items-center justify-center'>
        <audio
          className='w-full h-full'
          ref={remoteVideoRef}
          playsInline
          autoPlay
        ></audio>
        {friend && (
          <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col gap-2 items-center justify-center'>
            <Avatar
              avatarUrl={friend.avatarUrl}
              className='w-32 h-32 object-cover overflow-hidden'
            />
            <h1 className='px-4 py-1 rounded text-white text-lg sm:text-xl'>
              {friend.userName}
            </h1>
          </div>
        )}
      </div>
      <div className='sm:absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-end justify-center sm:justify-between px-10'>
        <div className='absolute sm:static top-4 left-4 flex gap-2'>
          <Button
            className='text-white w-10 h-10 sm:w-12 sm:h-12'
            active={true}
          >
            <BsFillChatFill />
          </Button>
          <Button
            className='text-white w-10 h-10 sm:w-12 sm:h-12'
            active={true}
          >
            <BsFillPersonPlusFill />
          </Button>
        </div>
        <VoiceCallControll
          position='absolute sm:static bottom-6 sm:bottom-8 left-0 right-0 '
          size='text-xl sm:text-2xl w-12 h-12 sm:w-14 sm:h-14'
        />
        <div className='absolute sm:static top-4 right-4 flex items-center gap-3'>
          {owner && (
            <Avatar avatarUrl={owner.avatarUrl} className='w-20 h-20' />
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
