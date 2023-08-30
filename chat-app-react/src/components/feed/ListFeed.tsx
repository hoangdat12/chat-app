import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { deletePost, selectPost } from '../../features/post/postSlice';
import { PostType } from '../../ultils/constant';
import Feed from './Feed';
import PostShared from './PostShared';
import { getUserLocalStorageItem } from '../../ultils';
import { IPost } from '../../ultils/interface';
import { postService } from '../../features/post/postService';
import { setIsError, setIsSuccess } from '../../features/showError';

export interface IPropListFeed {
  background?: string;
}

const userLocal = getUserLocalStorageItem();

const ListFeed: FC<IPropListFeed> = ({ background }) => {
  const { posts } = useAppSelector(selectPost);

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
    <div className='flex flex-col gap-8 w-full'>
      {posts.map((post) => {
        return post.post_type === PostType.POST ? (
          <Feed
            key={post._id}
            isOwner={userLocal._id === post.user._id}
            post={post}
            background={background}
            handleDeletePost={handleDeletePost}
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
