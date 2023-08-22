import { IPost } from '../../ultils/interface';
import { FC } from 'react';
import PostOwner from './PostOwner';
import Feed, { PostLikeShareComment } from './Feed';
import { getUserLocalStorageItem } from '../../ultils';

export interface IPropPostShared {
  post: IPost;
  isOwner: boolean;
  background?: string;
}

const userLocal = getUserLocalStorageItem();

const PostShared: FC<IPropPostShared> = ({ post, isOwner, background }) => {
  return (
    <div className={`${background ?? 'bg-gray-100'} p-4 rounded-lg shadow-box`}>
      <PostOwner post={post} isOwner={isOwner} />
      <div className='mt-6 border-2 rounded-lg'>
        <Feed
          isOwner={userLocal._id === post.user._id}
          post={post.post_share}
          shared={true}
          background={background}
        />
      </div>
      <PostLikeShareComment post={post} />
    </div>
  );
};

export default PostShared;
