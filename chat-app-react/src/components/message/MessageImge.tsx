import { FC, useEffect, useState } from 'react';
import { messageService } from '../../features/message/messageService';
import { IMessage } from '../../ultils/interface';
import './index.scss';
import { ButtonRounded } from '../button/ButtonRounded';
import { AiOutlineArrowLeft } from 'react-icons/Ai';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

export interface IProps {
  conversationId?: string;
  setShowListImage: (value: boolean) => void;
}

const MessageImge: FC<IProps> = ({ conversationId, setShowListImage }) => {
  const [messageImages, setMessageImages] = useState<IMessage[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (conversationId) {
      const handleGetMessageImages = async () => {
        const res = await messageService.getMessageImageOfConversation(
          conversationId
        );
        if (res.status === 200) {
          setMessageImages(res.data.metaData);
        } else {
          dispatch(setIsError());
        }
      };

      handleGetMessageImages();
    }
  }, [conversationId]);

  return (
    <div className='absolute top-0 left-0 bottom-0 w-full h-full p-2 bg-[#f2f3f4] lg:bg-white animate__animated animate__fadeInRight'>
      <div className='flex gap-4 items-center mt-3 mb-6'>
        <ButtonRounded
          icon={<AiOutlineArrowLeft />}
          className='bg-white w-10 h-10'
          onClick={() => setShowListImage(false)}
        />
        <h1 className='text-2xl font-medium text-center'>Images</h1>
      </div>

      <div className='columns-3 gap-2'>
        {messageImages &&
          messageImages.map((img) => (
            <div key={img._id} className='mb-2'>
              <img src={img.message_content} alt='' />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageImge;
