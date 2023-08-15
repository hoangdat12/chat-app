import { BsFillTelephoneFill, BsTelephoneXFill } from 'react-icons/bs';
import Button from '../button/Button';
import { FC, useContext } from 'react';
import { IMessage } from '../../ultils/interface';
import { getTimeSendMessage } from '../../ultils';
import { MessageContentType } from '../../ultils/constant';
import {
  hanldeCallAudio,
  hanldeCallVideo,
} from '../conversation/ConversationContent/HeaderContent';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { SocketContext } from '../../ultils/context/Socket';
import { selectConversation } from '../../features/conversation/conversationSlice';

export interface IPropCallMessage {
  myMessage: boolean | undefined;
  message: IMessage;
}

const CallMessage: FC<IPropCallMessage> = ({ myMessage, message }) => {
  const { conversationId } = useParams();
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { conversations } = useAppSelector(selectConversation);

  const isAccept = message?.message_call?.status === 'accept';

  const handleCallAgain = async () => {
    const conversation = conversations.get(conversationId ?? '');
    if (!conversation) return;
    if (message.message_content_type === MessageContentType.VIDEO_CALL) {
      await hanldeCallVideo(conversationId, socket, conversation, dispatch);
    } else {
      await hanldeCallAudio(conversationId, socket, conversation, dispatch);
    }
  };

  return (
    <div
      className={`relative flex gap-2 items-center ${
        myMessage ? 'justify-end' : 'pl-2'
      } mt-2 w-full`}
    >
      <div className='flex items-center justify-center gap-3 px-4 py-2 rounded-md border'>
        <span className='p-3 text-sm rounded-full bg-gray-200'>
          {isAccept ? <BsFillTelephoneFill /> : <BsTelephoneXFill />}
        </span>
        <div className='text-sm'>
          <h1 className='font-semibold'>
            {isAccept ? 'End Call' : 'Missing call'}
          </h1>
          <p className='text-xs text-gray-500'>
            {isAccept
              ? message.message_call?.time
              : getTimeSendMessage(message.createdAt)}
          </p>
        </div>
        <div>
          <Button
            text='Call again'
            className={`${
              isAccept
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-red-500 hover:bg-red-600'
            } duration-300 text-white border-none text-sm ml-2`}
            onClick={handleCallAgain}
          />
        </div>
      </div>
    </div>
  );
};

export default CallMessage;
