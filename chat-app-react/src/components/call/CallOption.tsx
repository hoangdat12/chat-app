import { BsFillChatFill } from 'react-icons/bs';
import { Button } from '../../pages/callerPage/VideoCall';
import { MdZoomInMap } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectCall, setIsMini } from '../../features/call/callSlice';

const CallOption = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeConversationId } = useAppSelector(selectCall);

  const handleResize = () => {
    dispatch(setIsMini(true));
    navigate(-1);
  };

  const handleChat = () => {
    dispatch(setIsMini(true));
    navigate(`/conversation/${activeConversationId}`);
  };

  return (
    <div className='absolute sm:static top-4 left-4 flex gap-2'>
      <Button
        className='text-white w-10 h-10 sm:w-12 sm:h-12'
        active={true}
        onClick={handleChat}
      >
        <BsFillChatFill />
      </Button>
      <Button
        className='text-white w-10 h-10 sm:w-12 sm:h-12'
        active={true}
        onClick={handleResize}
      >
        <MdZoomInMap />
      </Button>
    </div>
  );
};

export default CallOption;
