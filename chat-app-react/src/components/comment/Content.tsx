import { FiMoreHorizontal } from 'react-icons/fi';
import Avatar from '../avatars/Avatar';
import {
  Dispatch,
  FC,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import OptionDeleteAndUpdate from '../options/OptionDeleteAndUpdate';
import {
  IComment,
  IDataDeleteComment,
  IDataUpdateComment,
  IPost,
} from '../../ultils/interface';
import {
  getTimeComment,
  getUserLocalStorageItem,
  getUsername,
} from '../../ultils';
import { commentService } from '../../features/comment/commentService';
import CommentInput from './CommentInput';
import useClickOutside from '../../hooks/useClickOutside';
import useEnterListener from '../../hooks/useEnterEvent';
import CommentContent from './CommentContent';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';
import { useNavigate } from 'react-router-dom';

export interface IPropComment {
  comment: IComment;
  sizeAvatar?: string;
  space?: string;
  setComments: Dispatch<SetStateAction<IComment[] | null>>;
  post: IPost;
}

const user = getUserLocalStorageItem();

export const Content: FC<IPropComment> = memo(
  ({ comment, sizeAvatar, space, setComments, post }) => {
    const [showOption, setShowOption] = useState<boolean>(false);
    const [isReply, setIsReply] = useState(false);
    const [updateContent, setUpdateContent] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [childComments, setChildComments] = useState<IComment[] | null>(null);
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [remainChildComment, setRemainChildComment] = useState<number | null>(
      null
    );
    const [commentLikeNum, setCommentLikeNum] = useState(
      comment.comment_likes_num
    );

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();

    const handleGetListComment = async () => {
      const data = {
        comment_post_id: comment.comment_post_id,
        parentCommentId: comment._id,
      };
      const res = await commentService.getListComment(data);
      setChildComments(res.data.metaData.comments);
      setRemainChildComment(res.data.metaData.remainComment);
    };

    const handleShowOption = () => {
      setShowOption(true);
    };

    const handleShowUpdate = () => {
      setUpdateContent(comment.comment_content);
      setIsUpdate(true);
      setShowOption(false);
      inputRef?.current?.focus();
    };

    const handleDeleteComment = async () => {
      const data: IDataDeleteComment = {
        comment_id: comment._id,
        comment_post_id: comment.comment_post_id,
      };
      const res = await commentService.deleteComment(data);
      if (res.status === 200) {
        setComments((prevs) => {
          if (prevs) {
            return prevs.filter((prev) => prev._id !== comment._id);
          } else {
            return prevs;
          }
        });
      } else {
        dispatch(setIsError);
      }
      setShowOption(false);
    };

    const handleUpdateComment = async () => {
      const data: IDataUpdateComment = {
        comment_content: updateContent.trim(),
        comment_id: comment._id,
        comment_post_id: comment.comment_post_id,
      };
      const res = await commentService.updateComment(data);
      if (res.status === 200) {
        comment.comment_content = res.data.metaData.comment_content;
      } else {
        dispatch(setIsError);
      }
      setIsUpdate(false);
    };

    const handleLikeComment = async () => {
      // Call api like
      const data: IDataDeleteComment = {
        comment_id: comment._id,
        comment_post_id: comment.comment_post_id,
      };
      const res = await commentService.likeComment(data);
      if (res.status === 200 || res.status === 201) {
        setCommentLikeNum(res.data.metaData.comment_likes_num);
      } else {
        dispatch(setIsError());
      }
      setIsLiked(!isLiked);
    };

    useEffect(() => {
      if (isUpdate) {
        inputRef?.current?.focus();
      }
    }, [isUpdate]);

    useClickOutside(inputRef, () => setIsUpdate(false), 'mousedown');

    useEnterListener(
      handleUpdateComment,
      updateContent.trim(),
      updateContent.trim() !== comment.comment_content.trim()
    );

    return (
      <div className='flex flex-col'>
        <div className={`flex ${space ?? 'gap-3'} py-1`}>
          <Avatar
            avatarUrl={comment.comment_user_id.avatarUrl}
            className={sizeAvatar ?? 'w-10 h-10 min-h-[2.5rem] min-w-[2.5rem]'}
            onClick={() => navigate(`/profile/${comment.comment_user_id._id}`)}
          />
          <div className='max-w-[80%]'>
            <div className='relative hover-parent px-3 py-2 text-sm rounded-lg bg-white'>
              <h1 className='flex flex-wrap whitespace-nowrap font-semibold cursor-pointer'>
                {getUsername(comment.comment_user_id)}
              </h1>
              {isUpdate ? (
                <input
                  ref={inputRef}
                  type='text'
                  className='outline-none border px-2 rounded'
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                />
              ) : (
                <p className='text-gray-700 text-[15px]'>
                  {comment.comment_content}
                </p>
              )}
              <div className='absolute top-0 -right-[50px] h-full hover-child hidden items-start'>
                <div className='flex items-center h-full border-x-[20px] border-transparent'>
                  <span
                    onClick={handleShowOption}
                    className='flex rounded-full cursor-pointer p-1 hover:bg-white duration-300'
                  >
                    <FiMoreHorizontal />
                  </span>
                </div>
                <div className='relative'>
                  {showOption &&
                    (user._id === comment.comment_user_id._id ||
                      user._id === post.user._id) && (
                      <OptionDeleteAndUpdate
                        position={'-top-2 left-[130%]'}
                        handleDelete={handleDeleteComment}
                        handleUpdate={handleShowUpdate}
                        setShowOption={setShowOption}
                      />
                    )}
                </div>
              </div>
            </div>
            <div className='flex gap-3 px-3 mt-1 text-[13px]'>
              <span
                onClick={handleLikeComment}
                className={`${
                  isLiked && 'text-blue-700'
                } relative cursor-pointer hover:opacity-80`}
              >
                Like
                {commentLikeNum !== 0 && (
                  <span className='absolute -bottom-1 -right-2 px-1 bg-blue-500 text-white text-[8px] rounded-full'>
                    {commentLikeNum}
                  </span>
                )}
              </span>
              <span
                onClick={() => setIsReply(true)}
                className='cursor-pointer hover:opacity-80'
              >
                Reply
              </span>
              <span className='cursor-pointer hover:opacity-80'>
                {getTimeComment(comment.createdAt)}
              </span>
            </div>
            <div
              onClick={handleGetListComment}
              className={`${
                (comment.comment_right - comment.comment_left === 1 ||
                  childComments?.length === 0 ||
                  remainChildComment === 0) &&
                'hidden'
              } flex justify-start text-xs cursor-pointer px-3 pt-2`}
            >
              Show more comment ...
            </div>
          </div>
        </div>
        <div className='pl-10'>
          {isReply && (
            <CommentInput
              sizeAvatar={'w-10 h-10'}
              fontSize={'text-base'}
              isReply={true}
              setShowReply={setIsReply}
              parentCommentId={comment._id}
              setComments={setChildComments}
              postId={comment.comment_post_id}
            />
          )}
        </div>
        <div className='pl-10'>
          {childComments && (
            <CommentContent
              comments={childComments}
              sizeAvatar={'w-8 h-8'}
              space={'gap-2'}
              setComments={setChildComments}
              post={post}
            />
          )}
        </div>
      </div>
    );
  }
);
