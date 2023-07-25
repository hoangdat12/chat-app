import Avatar, { AvatarOnline } from '../components/avatars/Avatar';
import Layout from '../components/layout/Layout';
import { AiOutlineSearch } from 'react-icons/Ai';

import happyBirthday from '../assets/happyBirthday.png';
import CreateFeed, { ModeCreateFeed } from '../components/feed/CreateFeed';

const Home = () => {
  return (
    <Layout>
      <div className='relative md:grid md:grid-cols-12 flex w-full h-full overflow-hidden px-4 bg-gray-100'>
        <div className='hidden xl:flex flex-col gap-4 xl:col-span-3 pt-6 px-3'>
          <div className='p-2 bg-white rounded'>
            <h1 className='text-gray-400 text-sm'>May are you know</h1>
            <div className='mt-2'>
              <img
                src='https://images.pexels.com/photos/17494608/pexels-photo-17494608/free-photo-of-police-station.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                alt=''
              />
            </div>
          </div>

          <div className='p-2 bg-white rounded'>
            <h1 className='text-gray-400 text-sm'>May are you know</h1>
            <div className='mt-2 flex flex-col gap-2'>
              <AvatarOnline
                avatarUrl={
                  'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau-601x600.jpg'
                }
                className='w-12 h-12'
              />
              <AvatarOnline
                avatarUrl={
                  'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau-601x600.jpg'
                }
                className='w-12 h-12'
              />
              <AvatarOnline
                avatarUrl={
                  'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau-601x600.jpg'
                }
                className='w-12 h-12'
              />
              <AvatarOnline
                avatarUrl={
                  'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau-601x600.jpg'
                }
                className='w-12 h-12'
              />
            </div>
          </div>
        </div>

        <div className='xl:col-span-6 col-span-8 px-6 xl:px-10 pt-6 overflow-y-auto scrollbar-hide'>
          <div className='max-h-[calc(100vh-76px-5rem)] h-[calc(100vh-76px-5rem)] flex flex-col items-center gap-4 '>
            <CreateFeed mode={ModeCreateFeed.CREATE} />
            <div className='p-3 bg-white'>{/* <Feed isOwner={false} /> */}</div>
          </div>
        </div>

        <div className='max-h-[calc(100vh-76px)] h-[calc(100vh-76px)] overflow-y-auto xl:col-span-3 col-span-4 pt-6 px-3 flex flex-col gap-3'>
          <div className='relative bg-white rounded p-2'>
            <div className='absolute top-2 right-2 left-2 flex justify-between text-sm p-2 text-white bg-blue-500'>
              <div className='flex gap-2 items-center'>
                <Avatar
                  avatarUrl={
                    'https://thuthuatnhanh.com/wp-content/uploads/2021/02/Avatar-ngau-dep.jpg'
                  }
                  className={'w-12 h-12'}
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

          <div className='flex flex-col gap-2 mt-2'>
            <div className='flex gap-4 items-center'>
              <h1>Friend</h1>
              <div className='flex items-center gap-2 w-full'>
                <input
                  className='outline-none px-2 text-sm py-1 rounded w-full'
                  type='text'
                />
                <span className='text-xl'>
                  <AiOutlineSearch />
                </span>
              </div>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((ele) => (
              <div key={ele} className='flex gap-2 items-center'>
                <AvatarOnline
                  avatarUrl={
                    'https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau-601x600.jpg'
                  }
                  className='w-12 h-12'
                />
                <div>
                  <p>Hoang Dat</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
