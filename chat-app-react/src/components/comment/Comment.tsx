import { IComment } from '../../ultils/interface';
import { Dispatch, FC, SetStateAction, memo } from 'react';
import CommentContent from './CommentContent';
import CommentInput from './CommentInput';

export interface IPropCommentContent {
  comments: IComment[] | null;
  remainComment: number | null;
  setComments: Dispatch<SetStateAction<IComment[] | null>>;
  postId: string;
}

const Comment: FC<IPropCommentContent> = memo(
  ({ comments, setComments, remainComment, postId }) => {
    return (
      <div className='flex flex-col gap-2 mt-6'>
        <h1 className='text-lg cursor-pointer mb-2'>Comment</h1>
        <CommentContent comments={comments} />
        <div className='flex flex-col gap-2 max-h-[340px] overflow-y-scroll mt-1'>
          <div
            className={`${
              remainComment === 0 && 'hidden'
            } flex justify-between w-full px-6`}
          >
            <span>...</span>
            <span className='border-b-2 border-b-transparent hover:border-b-black text-sm cursor-pointer'>
              {`Show ${remainComment} comments`}
            </span>
          </div>
        </div>
        <CommentInput setComments={setComments} postId={postId} />
      </div>
    );
  }
);

export default Comment;
