import { FC, memo, useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/Ai';
import { MdComment } from 'react-icons/md';
import { IoIosShareAlt } from 'react-icons/io';

import { IComment, IPost } from '../../ultils/interface';
import Comment from '../comment/Comment';
import { useAppDispatch } from '../../app/hook';
import { likePost } from '../../features/post/postSlice';
import CreatePostModel from '../modal/CreatePostModel';
import { PostType } from '../../ultils/constant';
import PostOwner from './PostOwner';
import { ModeCreateFeed } from './CreateFeed';
import { commentService } from '../../features/comment/commentService';
import Loading from '../button/Loading';

export interface IFeedProp {
  isOwner: boolean;
  post: IPost;
  background?: string;
  shared?: boolean;
  postType?: string;
  feedSave?: IPost;
  handleDeletePost: (post: IPost) => void;
}

export interface IPropPostLikeShareComment {
  post: IPost;
}

const Feed: FC<IFeedProp> = memo(
  ({
    isOwner,
    post,
    background,
    feedSave,
    shared = false,
    postType = PostType.POST,
    handleDeletePost,
  }) => {
    return (
      post && (
        <>
          <div
            className={`${background ?? 'bg-gray-100'} p-4 rounded-lg ${
              !post.post_share && !shared && 'shadow-box'
            }`}
          >
            <PostOwner
              post={post}
              isOwner={isOwner}
              shared={shared}
              saved={postType === PostType.SAVE}
              feedSave={feedSave}
              handleDeletePost={handleDeletePost}
            />
            <div className='mt-6'>
              <p
                className={`${post && !post.post_image && 'px-4'} text-[#678]`}
              >
                {post?.post_content}
              </p>
              {post && post.post_image && (
                <div className='bg-black flex items-center justify-center rounded overflow-hidden gap-2 mt-4 border'>
                  <img
                    src={post?.post_image}
                    alt=''
                    className='max-h-[50vh] min-h-[250px] max-w-[80vh] min-w-[200px]'
                  />
                </div>
              )}
            </div>
            {!shared && <PostLikeShareComment post={post} />}
          </div>
        </>
      )
    );
  }
);

export const PostLikeShareComment: FC<IPropPostLikeShareComment> = ({
  post,
}) => {
  const [activeHeart, setActiveHeart] = useState(post.liked);
  const [quantityLike, setQuantityLike] = useState(post.post_likes_num);
  const [showComment, setShowComment] = useState(false);
  const [showShareModel, setShowShareModel] = useState(false);
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [remainComment, setRemainComment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleShowComment = async () => {
    if (!showComment && comments === null) {
      setIsLoading(true);
      const data = {
        comment_post_id: post._id,
        parentCommentId: null,
      };
      const res = await commentService.getListComment(data);
      setComments(res.data.metaData.comments);
      setRemainComment(res.data.metaData.remainComment);
      setIsLoading(false);
    }
    setShowComment(!showComment);
  };

  const handleLikePost = () => {
    const data = {
      postId: post._id,
      quantity: activeHeart ? -1 : 1,
    };
    dispatch(likePost(data));
    setQuantityLike(activeHeart ? quantityLike - 1 : quantityLike + 1);
    setActiveHeart(!activeHeart);
  };

  return (
    <>
      <div className='flex items-center justify-between px-2 sm:px-4 py-2 mt-4 border-y border-[#b9b9b9]'>
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
              <span className='pr-1'>{post.post_share_num}</span>
              <span>Share</span>
            </div>
          </div>
          {showShareModel && (
            <CreatePostModel
              setShow={setShowShareModel}
              type={PostType.SHARE}
              post={post}
              mode={ModeCreateFeed.CREATE}
            />
          )}
        </div>
      </div>

      {showComment &&
        (isLoading ? (
          <div className='flex items-center justify-center w-full min-h-[120px]'>
            <Loading />
          </div>
        ) : (
          <Comment
            comments={comments}
            setComments={setComments}
            remainComment={remainComment}
            post={post}
          />
        ))}
    </>
  );
};

export default Feed;
