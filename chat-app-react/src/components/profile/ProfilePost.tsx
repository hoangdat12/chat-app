import { FC, memo, useEffect, useRef, useState } from 'react';
import { IPost } from '../../ultils/interface';
import { postService } from '../../features/post/postService';
import Loading from '../button/Loading';
import Feed from '../feed/Feed';
import ListFeed from '../feed/ListFeed';
import CreateFeed, { ModeCreateFeed } from '../feed/CreateFeed';
import { getUserLocalStorageItem, getUsername } from '../../ultils';
import { getPost } from '../../features/post/postSlice';
import { useAppDispatch } from '../../app/hook';
import { IProfile } from '../../ultils/interface/profile.interface';
import { setIsError, setIsSuccess } from '../../features/showError';

export enum modeViewProfilePost {
  FEEDS = 'Feeds',
  SAVE = 'Save',
}

export interface IPropProfilePost {
  userId: string | undefined;
  profile?: IProfile | null;
}

const userLocal = getUserLocalStorageItem();

const ProfilePost: FC<IPropProfilePost> = memo(({ userId, profile }) => {
  const [active, setActive] = useState('Feeds');
  const [postSaves, setPostSaves] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomOfListRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [endPost, setEndPost] = useState(false);
  const [isLoadingCallApi, setIsLoadingCallApi] = useState(false);

  const dispatch = useAppDispatch();

  const handleClickModeView = async (mode: string) => {
    setActive(mode);
    if (mode === modeViewProfilePost.SAVE && userId && postSaves.length === 0) {
      const res = await postService.getPostSaveOfUser(userId);
      if (res.status === 200 || res.status === 201) {
        setPostSaves(res.data.metaData);
      } else {
        dispatch(setIsError());
      }
    }
  };
  const fetchPosts = async () => {
    try {
      if (userId && !endPost) {
        setIsLoadingCallApi(true);
        const pagination = {
          limit: 10,
          page: currentPage + 1,
          sortedBy: 'ctime',
        };
        const res = await postService.getPostOfUser(userId, pagination);
        if (res.data.metaData.length === 0) {
          setEndPost(true);
        }
        if (res.status === 200) {
          dispatch(getPost(res.data.metaData));
        } else {
          setEndPost(true);
          dispatch(setIsError());
        }
        setIsLoadingCallApi(false);
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [active]);

  const handleScroll = () => {
    if (
      bottomOfListRef.current &&
      bottomOfListRef.current.getBoundingClientRect().bottom <= 670
    ) {
      fetchPosts();
    }
  };

  const handleDeletePost = async (post: IPost) => {
    if (userLocal._id === post.user._id) {
      // Delete
      const res = await postService.deletePost(post._id);
      if (res.status === 200) {
        dispatch(setIsSuccess());
        setPostSaves((prev) =>
          prev.filter((postSave) => postSave._id !== post._id)
        );
      } else {
        dispatch(setIsError());
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [endPost]);

  return (
    <div ref={bottomOfListRef} className={`flex flex-col gap-6 md:col-span-2`}>
      <div className='flex flex-col items-center bg-gray-100 py-4 px-4 rounded-md'>
        <CreateFeed
          mode={
            userId === userLocal._id
              ? ModeCreateFeed.CREATE
              : ModeCreateFeed.WRITE_TIME
          }
          placeHolder={
            userId === userLocal._id
              ? undefined
              : `Write on 's timeline ${getUsername(
                  profile?.profile_user ?? null
                )}`
          }
          user={profile?.profile_user}
        />
      </div>
      <div className='flex gap-4 items-center bg-gray-100 py-4 px-4 rounded-md w-full'>
        {userId === userLocal._id ? (
          (
            Object.keys(
              modeViewProfilePost
            ) as (keyof typeof modeViewProfilePost)[]
          ).map((mode) => (
            <h1
              onClick={() => handleClickModeView(modeViewProfilePost[mode])}
              key={mode}
              className={`${
                active === modeViewProfilePost[mode]
                  ? 'bg-blue-500 text-white'
                  : ''
              } text-base md:text-lg px-4 py-[6px] cursor-pointer rounded`}
            >
              {modeViewProfilePost[mode]}
            </h1>
          ))
        ) : (
          <div className='flex justify-start w-full text-lg md:text-xl xl:text-2xl font-medium cursor-pointer'>
            Feeds
          </div>
        )}
      </div>
      {isLoading ? (
        <div className='flex items-center justify-center min-h-[300px]'>
          <Loading />
        </div>
      ) : active === modeViewProfilePost.SAVE ? (
        <div className='flex items-center justify-center w-full min-h-[200px] md:min-h-[300px]'>
          {postSaves.length ? (
            <div className='w-full flex flex-col gap-4 sm:gap-6 xl:gap-8'>
              {postSaves.map((post) => (
                <Feed
                  key={post._id}
                  post={post.post_share}
                  postType={post.post_type}
                  isOwner={true}
                  feedSave={post}
                  handleDeletePost={handleDeletePost}
                />
              ))}
            </div>
          ) : (
            <h1 className='text-lg sm:text-2xl font-base'>
              You have no saved posts
            </h1>
          )}
        </div>
      ) : (
        <ListFeed />
      )}
      {isLoadingCallApi && (
        <div className='flex justify-center w-full'>...Loading</div>
      )}
    </div>
  );
});
export default ProfilePost;
