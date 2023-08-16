import Avatar from '../components/avatars/Avatar';
import Layout from '../components/layout/Layout';
import { AiOutlineSearch } from 'react-icons/Ai';

import happyBirthday from '../assets/happyBirthday.png';
import CreateFeed, { ModeCreateFeed } from '../components/feed/CreateFeed';
import ListFriendOfUser from '../components/friend/ListFriend';
import AllFeed from '../components/feed/AllFeed';
import { memo, useEffect, useRef, useState } from 'react';
import { postService } from '../features/post/postService';
import { IPagination, IPost } from '../ultils/interface';

const Home = () => {
  return (
    <Layout>
      <div className='relative md:grid md:grid-cols-12 flex gap-4 lg-gap-6 xl:gap-8 px-4 lg-px-6 xl:px-10 w-full h-full overflow-hidden bg-white'>
        <div className='hidden xl:flex flex-col gap-8 xl:col-span-3 pt-6'>
          <div className='p-3 bg-gray-100 rounded cursor-pointer'>
            <h1 className='text-gray-400 text-sm'>May are you know</h1>
            <div className='mt-2'>
              <img
                src='https://images.pexels.com/photos/17494608/pexels-photo-17494608/free-photo-of-police-station.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                alt=''
              />
            </div>
          </div>
        </div>

        <MainContent />

        <div className='flex flex-col pb-4 gap-4 xl:gap-8 max-h-[calc(100vh-76px)] h-[calc(100vh-76px)] overflow-y-auto scrollbar-hide xl:col-span-3 col-span-4 pt-6'>
          <div className='relative bg-gray-100 rounded p-2'>
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

          <div className='flex flex-col bg-gray-100 p-3 rounded-md'>
            <div className='flex gap-4 items-center'>
              <div className='flex items-center gap-2 w-full bg-white pl-3 pr-2 rounded-md'>
                <input
                  className='outline-none text-sm py-1 rounded w-full bg-transparent'
                  type='text'
                />
                <span className='text-xl'>
                  <AiOutlineSearch />
                </span>
              </div>
            </div>
            <ListFriendOfUser />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const MainContent = memo(() => {
  const bottomOfListRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [endCall, setEndCall] = useState(false);

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
        setPosts(res.data.metaData);
      }
    } else {
      setEndCall(true);
    }
  };

  useEffect(() => {
    getPost();
  }, [currentPage]);

  return (
    <div className='xl:col-span-6 col-span-8 pt-6'>
      <div
        onScroll={handleScroll}
        className='max-h-[calc(100vh-76px)] h-[calc(100vh-76px)] overflow-y-auto scrollbar-hide flex flex-col items-center gap-4 lg:gap-6 xl:gap-8'
      >
        <div className='p-4 rounded-md bg-gray-100 w-full'>
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
