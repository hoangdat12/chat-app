import { useAppSelector } from '../../app/hook';
import { selectPost } from '../../features/post/postSlice';
import { PostType } from '../../ultils/constant';
import Feed from './Feed';
import PostShared from './PostShared';

const ListFeed = () => {
  const { posts } = useAppSelector(selectPost);
  return (
    <div className='flex flex-col gap-8'>
      {posts.map((post) => {
        return post.post_type === PostType.POST ? (
          <Feed key={post._id} isOwner={true} post={post} />
        ) : (
          <PostShared key={post._id} isOwner={true} post={post} />
        );
      })}
    </div>
  );
};

export default ListFeed;
