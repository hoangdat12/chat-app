import { IPost } from '../../ultils/interface';
import { FC } from 'react';
import PostOwner from './PostOwner';
import Feed, { PostLikeShareComment } from './Feed';

export interface IPropPostShared {
  post: IPost;
  isOwner: boolean;
}

const PostShared: FC<IPropPostShared> = ({ post, isOwner }) => {
  return (
    <div className='bg-gray-100 p-4 rounded-lg'>
      <PostOwner post={post} isOwner={isOwner} />
      <div className='mt-6 border-2'>
        <Feed isOwner={false} post={post.post_share} shared={true} />
      </div>
      <PostLikeShareComment post={post} />
    </div>
  );
};

export default PostShared;
