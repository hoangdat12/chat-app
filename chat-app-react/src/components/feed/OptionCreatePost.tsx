import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoMdImages } from 'react-icons/io';
import TagFriendModel from './TagFriend';
import { MdOutlineInsertEmoticon } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import useClickOutside from '../../hooks/useClickOutside';
import { IFriend } from '../../ultils/interface';
import { PostType } from '../../ultils/constant';

export interface IPropOptionCreatePost {
  handleChangeImage: (e: any) => void;
  handleSelectEmoji: (emoji: any) => void;
  setListFriendTag: Dispatch<SetStateAction<IFriend[]>>;
  type: string;
}

const OptionCreatePost: FC<IPropOptionCreatePost> = ({
  handleChangeImage,
  handleSelectEmoji,
  setListFriendTag,
  type,
}) => {
  const [showTagFriend, setShowTagFriend] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(emojiRef, () => setShowEmoji(false), 'mousedown');

  return (
    <div className='flex items-center gap-2 py-2 px-4 bg-gray-100 rounded'>
      <span className='text-lg cursor-pointer'>Add your post</span>

      {type === PostType.POST && (
        <div className='relative flex cursor-pointer'>
          <span className='text-2xl ml-4 text-green-500'>
            <IoMdImages />
          </span>
          <input
            onChange={(e) => handleChangeImage(e)}
            type='file'
            className='absolute top-0 left-0 right-0 bottom-0 cursor-pointer opacity-0'
          />
        </div>
      )}

      <span className='relative'>
        <span
          onClick={() => setShowTagFriend(true)}
          className=' text-2xl text-blue-500 cursor-pointer'
        >
          <BsFillPersonFill />
        </span>
        {showTagFriend && (
          <TagFriendModel
            setListFriendTag={setListFriendTag}
            setShowTagFriend={setShowTagFriend}
          />
        )}
      </span>
      <span className='relative text-2xl cursor-pointer text-yellow-500'>
        <span onClick={() => setShowEmoji(true)}>
          <MdOutlineInsertEmoticon />
        </span>
        <div
          ref={emojiRef}
          className={`absolute -bottom-2 ${
            !showEmoji ? 'hidden animate__zoomOut' : 'animate__zoomIn'
          } max-w-[400px] overflow-hidden right-1/2 translate-x-[35%] sm:translate-x-1/2 animate__animated`}
        >
          <Picker data={data} onEmojiSelect={handleSelectEmoji} />
        </div>
      </span>
    </div>
  );
};

export default OptionCreatePost;
