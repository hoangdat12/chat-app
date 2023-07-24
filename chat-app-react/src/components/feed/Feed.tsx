import { FC, memo, useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/Ai';
import { MdComment } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';

import { IPost } from '../../ultils/interface';
import Comment from '../comment/Comment';
import { useAppDispatch } from '../../app/hook';
import { likePost } from '../../features/post/postSlice';
import CreatePostModel from '../modal/CreatePostModel';
import { PostType } from '../../ultils/constant';
import PostOwner from './PostOwner';

export interface IFeedProp {
  isOwner: boolean;
  post: IPost;
  shared?: boolean;
}

export interface IPropPostLikeShareComment {
  post: IPost;
}

const Feed: FC<IFeedProp> = memo(({ isOwner, post, shared = false }) => {
  return (
    <>
      <div className='bg-gray-100 p-4 rounded-lg'>
        <PostOwner post={post} isOwner={isOwner} shared={shared} />
        <div className='mt-6'>
          <p className='text-[#678]'>{post.post_content}</p>
          <div className='bg-black flex items-center justify-center rounded overflow-hidden gap-2 mt-4 border'>
            <img
              src={post.post_image}
              alt=''
              className='max-h-[50vh] min-h-[250px] max-w-[80vh] min-w-[200px]'
            />
          </div>
        </div>
        {!shared && <PostLikeShareComment post={post} />}
      </div>
    </>
  );
});

export const PostLikeShareComment: FC<IPropPostLikeShareComment> = ({
  post,
}) => {
  const [activeHeart, setActiveHeart] = useState(post.liked);
  const [quantityLike, setQuantityLike] = useState(post.post_likes_num);
  const [showComment, setShowComment] = useState(false);
  const [showShareModel, setShowShareModel] = useState(false);

  const dispatch = useAppDispatch();

  const handleShowComment = () => {
    setShowComment(!showComment);
  };

  const handleLikePost = () => {
    const data = {
      postId: post._id,
      quantity: activeHeart ? -1 : 1,
    };
    dispatch(likePost(data));
    setQuantityLike(activeHeart ? -1 : 1);
    setActiveHeart(!activeHeart);
  };

  return (
    <>
      <div className='flex items-center justify-between px-2 sm:px-4 py-2 mt-4 border-y'>
        <div className='flex gap-1 sm:gap-2 items-center cursor-pointer'>
          <span
            onClick={handleLikePost}
            className={`${activeHeart && 'text-red-500'} text-[140%]`}
          >
            {activeHeart ? <AiFillHeart /> : <AiOutlineHeart />}
          </span>
          <div className='text-sm text-[#788695]'>
            <span className='pr-1'>{quantityLike}</span>
            <span>Likes</span>
          </div>
        </div>

        <div
          onClick={handleShowComment}
          className='flex gap-2 items-center text-[#788695] cursor-pointer'
        >
          <MdComment />
          <div className='text-sm'>
            <span className='pr-1'>{post.post_comments_num}</span>
            <span>Comments</span>
          </div>
        </div>

        <div className='relative'>
          <div
            onClick={() => setShowShareModel(true)}
            className='flex gap-2 items-center text-[#788695] cursor-pointer'
          >
            <IoIosShareAlt />
            <div className='text-sm'>
              <span className='pr-1'>{post.post_comments_num}</span>
              <span>Share</span>
            </div>
          </div>
          {showShareModel && (
            <CreatePostModel
              setShow={setShowShareModel}
              type={PostType.SHARE}
              post={post}
            />
          )}
        </div>
      </div>

      {showComment && <Comment />}
    </>
  );
};

export default Feed;
