import { FiMoreHorizontal } from 'react-icons/fi';
import Avatar from '../avatars/Avatar';
import { FC, memo, useEffect, useState } from 'react';
import OptionDeleteAndUpdate from '../options/OptionDeleteAndUpdate';
import { IComment } from '../../ultils/interface';
import { getUsername } from '../../ultils';
import { commentService } from '../../features/comment/commentService';
import { CommentInput } from './Comment';

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
    const [childComments, setChildComments] = useState<IComment[] | null>(null);

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

    const handleDeleteComment = () => {};

    const handleUpdateComment = () => {};

    const handleLikeComment = () => {};

    return (
      <div>
        <div className={`flex ${space ?? 'gap-3'} hover-parent py-1`}>
          <Avatar
            avatarUrl={comment.comment_user_id.avatarUrl}
            className={sizeAvatar ?? 'w-10 h-10'}
          />
          <div className='max-w-[80%]'>
            <div className='gap-2 px-3 py-2 text-sm md: text-[16px] rounded-lg bg-white'>
              <h1 className='flex flex-wrap whitespace-nowrap font-semibold cursor-pointer'>
                {getUsername(comment.comment_user_id)}
              </h1>
              <p className='text-gray-700 text-[15px]'>
                {comment.comment_content}
              </p>
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
              <span className='cursor-pointer hover:opacity-80'>16 minus</span>
            </div>
          </div>
          <div className='relative hover-child ml-1 hidden items-start mt-2'>
            <span
              onClick={handleShowOption}
              className='rounded-full cursor-pointer p-1 hover:bg-white duration-300'
            >
              <FiMoreHorizontal />
            </span>
            {showOption && (
              <OptionDeleteAndUpdate
                position={'-top-2 left-[130%]'}
                handleDelete={handleDeleteComment}
                handleUpdate={handleUpdateComment}
                setShowOption={setShowOption}
              />
            )}
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
