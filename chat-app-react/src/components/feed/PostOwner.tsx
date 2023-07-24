import Avatar from '../avatars/Avatar';
import { IPost } from '../../ultils/interface';
import { FC, useRef, useState } from 'react';
import { getTimeCreatePost, getUsername } from '../../ultils';
import { CgMoreVertical } from 'react-icons/cg';
import { RiEarthFill } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa';
import { MdReportProblem } from 'react-icons/md';
import useClickOutside from '../../hooks/useClickOutside';

export interface IPropPostOwner {
  post: IPost;
  isOwner: boolean;
  shared?: boolean;
}

const PostOwner: FC<IPropPostOwner> = ({ post, isOwner, shared = false }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef<HTMLUListElement | null>(null);

  const handleShowOptions = () => {
    setShowOptions(false);
  };

  useClickOutside<HTMLUListElement>(optionRef, handleShowOptions, 'mousedown');

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          <Avatar avatarUrl={post?.user?.avatarUrl} className={'w-12 h-12'} />
          <div>
            <h1 className='text-base'>{getUsername(post?.user)}</h1>
            <div className='flex gap-1 items-center'>
              <span>
                <RiEarthFill />
              </span>
              <p className='text-sm text-[#678]'>
                {getTimeCreatePost(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
        {!shared && (
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
        )}
      </div>
    </div>
  );
};

export default PostOwner;
