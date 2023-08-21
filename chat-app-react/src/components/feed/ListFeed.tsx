import { FC } from 'react';
import { useAppSelector } from '../../app/hook';
import { selectPost } from '../../features/post/postSlice';
import { PostType } from '../../ultils/constant';
import Feed from './Feed';
import PostShared from './PostShared';
import { getUserLocalStorageItem } from '../../ultils';

export interface IPropListFeed {
  background?: string;
}

const userLocal = getUserLocalStorageItem();

const ListFeed: FC<IPropListFeed> = ({ background }) => {
  const { posts } = useAppSelector(selectPost);
  return (
    <div className='flex flex-col gap-8 w-full'>
      {posts.map((post) => {
        return post.post_type === PostType.POST ? (
          <Feed
            key={post._id}
            isOwner={userLocal._id === post.user._id}
            post={post}
            background={background}
          />
        ) : (
          <PostShared
            key={post._id}
            isOwner={true}
            post={post}
            background={background}
          />
        );
      })}
    </div>
  );
};

export default ListFeed;
