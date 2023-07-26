import { FiMoreHorizontal } from 'react-icons/fi';
import Avatar from '../avatars/Avatar';
import { FC, memo, useEffect, useRef, useState } from 'react';
import OptionDeleteAndUpdate from '../options/OptionDeleteAndUpdate';
import {
  IComment,
  IDataDeleteComment,
  IDataUpdateComment,
} from '../../ultils/interface';
import { getTimeComment, getUsername } from '../../ultils';
import { commentService } from '../../features/comment/commentService';
import CommentInput from './CommentInput';
import useClickOutside from '../../hooks/useClickOutside';
import useEnterListener from '../../hooks/useEnterEvent';

export interface IPropCommentContent {
  comments: IComment[] | null;
  sizeAvatar?: string;
  space?: string;
}

export interface IPropComment {
  comment: IComment;
  sizeAvatar?: string;
  space?: string;
}

const CommentContent: FC<IPropCommentContent> = memo(
  ({ comments, sizeAvatar, space }) => {
    return (
      <div className={`flex flex-col gap-2`}>
        {comments &&
          comments.map((comment) => (
            <div key={comment._id}>
              <Content
                comment={comment}
                sizeAvatar={sizeAvatar}
                space={space}
              />
            </div>
          ))}
      </div>
    );
  }
);

export const Content: FC<IPropComment> = memo(
  ({ comment, sizeAvatar, space }) => {
    const [showOption, setShowOption] = useState<boolean>(false);
    const [isReply, setIsReply] = useState(false);
    const [updateContent, setUpdateContent] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [childComments, setChildComments] = useState<IComment[] | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      const handleGetListComment = async () => {
        const data = {
          comment_post_id: comment.comment_post_id,
          parentCommentId: comment._id,
        };
        const res = await commentService.getListComment(data);
        setChildComments(res.data.metaData.comments);
      };
      handleGetListComment();
    }, [comment]);

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
      console.log(res);
      if (res.status === 200) {
        comment.comment_content = updateContent;
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
        setChildComments(null);
      }
      setIsUpdate(false);
    };

    const handleLikeComment = () => {};

    useEffect(() => {
      if (isUpdate) {
        inputRef?.current?.focus();
        console.log('focus');
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
            className={sizeAvatar ?? 'w-10 h-10'}
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
                  {showOption && (
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
            <div className='flex gap-3 px-3 mt-1 text-xs'>
              <span
                onClick={handleLikeComment}
                className='cursor-pointer hover:opacity-80'
              >
                Like
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
            />
          )}
        </div>
      </div>
    );
  }
);

export default CommentContent;
