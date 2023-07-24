import Avatar from '../avatars/Avatar';
import { IPost } from '../../ultils/interface';
import { FC, useRef, useState } from 'react';
import { getTimeCreatePost, getUsername } from '../../ultils';
import { CgMoreVertical } from 'react-icons/cg';
import { RiEarthFill } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa';
import { MdReportProblem } from 'react-icons/md';
import useClickOutside from '../../hooks/useClickOutside';
import { PostMode, PostType } from '../../ultils/constant';
import { postService } from '../../features/post/postService';

export interface IPropPostOwner {
  post: IPost;
  isOwner: boolean;
  shared?: boolean;
  saved?: boolean;
}

const PostOwner: FC<IPropPostOwner> = ({
  post,
  isOwner,
  shared = false,
  saved = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef<HTMLUListElement | null>(null);

  const handleShowOptions = () => {
    setShowOptions(false);
  };

  const handleClickShowMore = () => {
    setShowOptions(true);
  };

  const handleSavePost = async () => {
    if (saved) {
      const formData = new FormData();
      const data = {
        post_type: PostType.SAVE,
        post_mode: PostMode.PRIVATE,
        post_share: post.post_type === PostType.POST ? post : post.post_share,
      };
      formData.append('data', JSON.stringify(data));
      await postService.createNewPost(formData);
    }
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
            <span className='cursor-pointer' onClick={handleClickShowMore}>
              <CgMoreVertical />
            </span>
            <ul
              className={`absolute right-0 ${
                !showOptions && 'hidden'
              } w-[132px] ${
                saved ? 'bottom-8' : 'h-24 top-more-feed'
              } bg-white rounded-lg overflow-hidden shadow-default`}
              ref={optionRef}
            >
              <li
                onClick={handleSavePost}
                className={`h-12 ${
                  saved ? 'hidden' : 'flex'
                } items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer`}
              >
                <FaRegBookmark />
                <span>Save post</span>
              </li>
              <li className='h-12 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer'>
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
