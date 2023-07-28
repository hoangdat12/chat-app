import { Dispatch, FC, SetStateAction, memo } from 'react';
import { IComment, IPost } from '../../ultils/interface';

import { Content } from './Content';

export interface IPropCommentContent {
  comments: IComment[] | null;
  sizeAvatar?: string;
  space?: string;
  setComments: Dispatch<SetStateAction<IComment[] | null>>;
  post: IPost;
}

const CommentContent: FC<IPropCommentContent> = memo(
  ({ comments, sizeAvatar, space, setComments, post }) => {
    return (
      <div className={`flex flex-col gap-2`}>
        {comments &&
          comments.map((comment) => (
            <div key={comment._id}>
              <Content
                comment={comment}
                sizeAvatar={sizeAvatar}
                space={space}
                setComments={setComments}
                post={post}
              />
            </div>
          ))}
      </div>
    );
  }
);

export default CommentContent;
