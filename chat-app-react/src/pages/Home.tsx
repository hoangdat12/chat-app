import Avatar from '../components/avatars/Avatar';
import Layout from '../components/layout/Layout';

import happyBirthday from '../assets/happyBirthday.png';
import CreateFeed, { ModeCreateFeed } from '../components/feed/CreateFeed';
import ListFriendOfUser from '../components/friend/ListFriend';
import AllFeed from '../components/feed/AllFeed';
import { memo, useEffect, useRef, useState } from 'react';
import { postService } from '../features/post/postService';
import { IPagination } from '../ultils/interface';
import { getUserLocalStorageItem } from '../ultils';
import { profileService } from '../features/profile/profileService';
import { IProfile } from '../ultils/interface/profile.interface';
import ProfileInformation from '../components/profile/ProfileInformation';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/button/Loading';
import { setIsError } from '../features/showError';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { selectPost, getPost as setPost } from '../features/post/postSlice';

const userLocal = getUserLocalStorageItem();

const Home = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    const getProfile = async () => {
      const res = await profileService.viewProfile(userLocal._id);
      if (res.status === 200 || res.status === 201) {
        setProfile(res.data.metaData);
      } else {
        dispatch(setIsError());
      }
    };
    // Get data
    getProfile();
  }, [userLocal]);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timmer);
    };
  }, [userLocal]);

  return (
    <Layout>
      {isLoading ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Loading />
        </div>
      ) : (
        <div className='relative md:grid md:grid-cols-12 flex gap-4 lg-gap-6 xl:gap-8 px-4 lg-px-6 xl:px-10 w-full h-full overflow-hidden bg-white'>
          <div className='hidden xl:flex flex-col items-center justify-start bg-gray-100 mt-6 py-8 px-5 gap-6 xl:col-span-3 shadow-box'>
            <div
              onClick={() => navigate(`/profile/${profile?.profile_user._id}`)}
              className='w-20 h-20 max-w-[5rem] max-h-[5rem] border-2 rounded-full'
            >
              <Avatar
                avatarUrl={profile?.profile_user.avatarUrl ?? ''}
                className='w-full h-full'
              />
            </div>
            <ProfileInformation
              profile={profile}
              isOwner={true}
              className='p-0 w-full'
            />
          </div>

          <MainContent />

          <div className='hidden sm:flex flex-col pb-4 gap-4 xl:gap-8 max-h-[calc(100vh-76px)] h-[calc(100vh-76px)] overflow-y-auto scrollbar-hide xl:col-span-3 col-span-4 pt-6'>
            <div className='relative bg-gray-100 rounded p-2 shadow-box'>
              <div className='absolute top-2 right-2 left-2 flex justify-between text-sm p-3 text-white bg-blue-500'>
                <div className='flex gap-2 items-center'>
                  <Avatar
                    avatarUrl={
                      'https://thuthuatnhanh.com/wp-content/uploads/2021/02/Avatar-ngau-dep.jpg'
                    }
                    className={'w-12 h-12 min-h-[3rem] min-w-[3rem]'}
                  />
                  <div>
                    <p>Hoang Dat</p>
                    <h1>22th Birthday</h1>
                  </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <span className='text-xl'>19</span>
                  <span>November</span>
                </div>
              </div>
              <div>
                <img src={happyBirthday} alt='' />
              </div>
            </div>

            <ListFriendOfUser />
          </div>
        </div>
      )}
    </Layout>
  );
};

export const MainContent = memo(() => {
  const bottomOfListRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [endCall, setEndCall] = useState(false);

  const dispatch = useAppDispatch();
  const { posts } = useAppSelector(selectPost);

  const handleScroll = () => {
    if (
      bottomOfListRef.current &&
      bottomOfListRef.current.getBoundingClientRect().bottom <= 764 &&
      !endCall
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getPost = async () => {
    const pagination: IPagination = {
      limit: 20,
      page: currentPage,
      sortedBy: 'ctime',
    };
    const res = await postService.getAllPost(pagination);
    if (res.status === 200) {
      if (!res.data.metaData.length) {
        setEndCall(true);
      } else {
        dispatch(setPost(res.data.metaData));
      }
    } else {
      setEndCall(true);
      dispatch(setIsError());
    }
  };

  useEffect(() => {
    getPost();
  }, [currentPage]);

  return (
    <div className='xl:col-span-6 col-span-8 pt-6 w-full'>
      <div
        onScroll={handleScroll}
        className='max-h-[calc(100vh-76px)] h-[calc(100vh-76px)] overflow-y-auto scrollbar-hide flex flex-col items-center gap-4 lg:gap-6 xl:gap-8'
      >
        <div className='p-4 rounded-md bg-gray-100 w-full shadow-box'>
          <CreateFeed mode={ModeCreateFeed.CREATE} />
        </div>
        <div
          ref={bottomOfListRef}
          className='flex flex-col gap-4 lg:gap-6 xl:gap-8 w-full pb-10'
        >
          <AllFeed posts={posts} />
        </div>
      </div>
    </div>
  );
});

export default Home;
