import {
  FC,
  useState,
  useRef,
  memo,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import { IComment, IDataCreateComment } from '../../ultils/interface';
import { FiImage } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { commentService } from '../../features/comment/commentService';
import { CommentType } from '../../ultils/constant';
import useEnterListener from '../../hooks/useEnterEvent';
import { getUserLocalStorageItem } from '../../ultils';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';
// import { socket } from '../../ultils/context/Socket';

export interface IPropCommentInput {
  sizeAvatar?: string;
  fontSize?: string;
  isReply?: boolean;
  setShowReply?: (value: boolean) => void;
  parentCommentId?: string;
  setComments: Dispatch<SetStateAction<IComment[] | null>>;
  postId: string;
}

const userLocal = getUserLocalStorageItem();

const CommentInput: FC<IPropCommentInput> = memo(
  ({
    sizeAvatar,
    fontSize,
    isReply = false,
    setShowReply,
    parentCommentId,
    setComments,
    postId,
  }) => {
    const [commentContent, setCommentContent] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();

    const handleCreateComment = async () => {
      if (commentContent.trim() !== '') {
        const data: IDataCreateComment = {
          comment_type: CommentType.TEXT,
          comment_content: commentContent.trim(),
          comment_post_id: postId,
          comment_parent_id: parentCommentId ?? null,
        };
        const res = await commentService.createComment(data);
        if (res.status === 201 || res.status === 200) {
          setComments((prev) => {
            return prev !== null
              ? [res.data.metaData, ...prev]
              : [res.data.metaData];
          });
        } else {
          dispatch(setIsError());
        }
        setCommentContent('');
        inputRef?.current?.focus();
      }
    };

    useEnterListener(handleCreateComment, commentContent);

    useEffect(() => {
      if (isReply) {
        inputRef?.current?.focus();
      }
    }, []);

    return (
      <div
        className={`relative flex items-start gap-2 mt-2 mb-4 border p-4 rounded-lg`}
      >
        <Avatar
          avatarUrl={userLocal.avatarUrl}
          className={sizeAvatar ?? 'w-12 h-12 min-h-[3rem] min-w-[3rem]'}
        />
        <div className='w-full'>
          <div className='flex items-center gap-2 sm:gap-4 pl-3 sm:pl-4 w-full bg-white rounded-lg overflow-hidden'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Enter your message...'
              className='text-sm font-medium w-full py-2 outline-none bg-transparent'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            {!isReply && (
              <Button
                text={'Send'}
                border={'border-none'}
                paddingX={'px-4'}
                onClick={handleCreateComment}
              />
            )}
          </div>

          <div
            className={`flex items-center gap-3 mt-2 ${
              fontSize ?? 'text-xl'
            } pl-2 text-gray-700`}
          >
            <span className='cursor-pointer text-green-500'>
              <FiImage />
            </span>
            <span className='cursor-pointer text-yellow-500'>
              <BsEmojiSmile />
            </span>
          </div>
        </div>
        {isReply && (
          <div className='absolute bottom-[5px] right-4 flex gap-2'>
            <Button
              text={'Cancel'}
              paddingY={'py-1'}
              textSize={'text-sm'}
              onClick={setShowReply ? () => setShowReply(false) : null}
            />
            <Button
              text={'Send'}
              border={'border-none'}
              background={'bg-gray-400 hover:bg-gray-500'}
              color='text-white'
              paddingY={'py-1'}
              textSize={'text-sm'}
              onClick={handleCreateComment}
            />
          </div>
        )}
      </div>
    );
  }
);

export default CommentInput;
