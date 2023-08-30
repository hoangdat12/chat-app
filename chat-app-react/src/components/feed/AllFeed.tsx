import { FC, memo } from 'react';
import { IPost } from '../../ultils/interface';
import Feed from './Feed';
import PostShared from './PostShared';
import { PostType } from '../../ultils/constant';
import { getUserLocalStorageItem } from '../../ultils';
import { useAppDispatch } from '../../app/hook';
import { postService } from '../../features/post/postService';
import { deletePost } from '../../features/post/postSlice';
import { setIsError, setIsSuccess } from '../../features/showError';

export interface IProps {
  posts: IPost[] | null;
}

const userLocal = getUserLocalStorageItem();

const AllFeed: FC<IProps> = memo(({ posts }) => {
  const dispatch = useAppDispatch();

  const handleDeletePost = async (post: IPost) => {
    const res = await postService.deletePost(post._id);
    if (res.status === 200) {
      dispatch(deletePost(post._id));
      dispatch(setIsSuccess());
    } else {
      dispatch(setIsError());
    }
  };

  return (
    <div className='flex flex-col gap-4 lg:gap-6 xl:gap-8 w-full'>
      {posts &&
        posts.map((post) => {
          return post.post_type === PostType.POST ? (
            <Feed
              key={post._id}
              isOwner={userLocal._id === post.user._id}
              post={post}
              background={'bg-gray-100'}
              handleDeletePost={handleDeletePost}
            />
          ) : (
            <PostShared
              key={post._id}
              isOwner={true}
              post={post}
              background={'bg-gray-100'}
            />
          );
        })}
    </div>
  );
});

export default AllFeed;
