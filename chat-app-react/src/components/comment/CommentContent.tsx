import { FC, memo } from 'react';
import { IComment } from '../../ultils/interface';

import { Content } from './Content';

export interface IPropCommentContent {
  comments: IComment[] | null;
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

export default CommentContent;
