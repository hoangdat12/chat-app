import { FC, memo, useRef, useState } from 'react';
import { CgMoreVertical } from 'react-icons/cg';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/Ai';
import { MdComment, MdReportProblem } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa';

import Avatar from '../avatars/Avatar';
import useClickOutside from '../../hooks/useClickOutside';

export interface IFeedProp {
  isOwner: boolean;
}

const Feed: FC<IFeedProp> = memo(({ isOwner }) => {
  const [activeHeart, setActiveHeart] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const optionRef = useRef<HTMLUListElement | null>(null);

  const handleLikePost = () => {
    setActiveHeart(!activeHeart);
  };

  const handleActice = () => {
    setShowOptions(false);
  };

  useClickOutside<HTMLUListElement>(optionRef, handleActice, 'mousedown');

  return (
    <div className='bg-gray-100 p-4 rounded'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          <Avatar
            avatarUrl={
              'https://flowbite.com/application-ui/demo/images/users/neil-sims.png'
            }
            className={'w-12 h-12'}
          />
          <div>
            <h1 className='text-base'>Hoang dat</h1>
            <p className='text-sm text-[#678]'>12 April at 09.28 PM</p>
          </div>
        </div>
        <div className='relative'>
          <span onClick={() => setShowOptions(!showOptions)}>
            <CgMoreVertical />
          </span>
          <ul
            className={`absolute top-more-feed right-0 ${
              !showOptions && 'hidden'
            } w-[132px] h-24 bg-white rounded-lg overflow-hidden shadow-default`}
            ref={optionRef}
          >
            <li className='h-12 flex items-center justify-center gap-2 hover:bg-gray-50'>
              <FaRegBookmark />
              <span>Save post</span>
            </li>
            <li className='h-12 flex items-center justify-center gap-2 hover:bg-gray-50'>
              <span className='text-red-500'>
                <MdReportProblem />
              </span>
              <span>{isOwner ? 'Delete post' : 'Repot post'}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='mt-6'>
        <p className='text-[#678]'>
          Hi @everyone, the new designs are attached. Go check them out and let
          me know if I missed anything. Thanks!
        </p>
        <div className='grid grid-cols-2 gap-2 mt-4 border'>
          <div className='col-span-2 rounded overflow-hidden'>
            <img
              className='w-full'
              src={
                'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png'
              }
              alt=''
            />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between px-4 py-2 mt-4 border-y'>
        <div className='flex gap-2 items-center'>
          <span
            onClick={handleLikePost}
            className={`${activeHeart && 'text-red-500'} text-[140%]`}
          >
            {activeHeart ? <AiFillHeart /> : <AiOutlineHeart />}
          </span>
          <div className='text-sm text-[#788695]'>
            <span className='pr-1'>450</span>
            <span>Likes</span>
          </div>
        </div>
        <div className='flex gap-2 items-center text-[#788695]'>
          <MdComment />
          <div className='text-sm'>
            <span className='pr-1'>450</span>
            <span>Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Feed;
