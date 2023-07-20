import { AiOutlineFileImage } from 'react-icons/Ai';
import Avatar from '../avatars/Avatar';
import { useState } from 'react';
import CreatePostModel from '../modal/CreatePostModel';

const CreateFeed = () => {
  const [show, setShow] = useState(false);

  const setShowModelCreatePost = () => {
    setShow(true);
  };

  return (
    <div className='w-full p-3 rounded bg-white'>
      <div className='flex justify-between gap-3 '>
        <Avatar
          avatarUrl={
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg'
          }
          className='w-12 h-12'
        />
        <div className='flex items-center w-full'>
          <input
            type='text'
            name=''
            id=''
            className='w-full outline-none'
            placeholder='What are you think?'
            onClick={setShowModelCreatePost}
          />
          <span onClick={setShowModelCreatePost} className='p-1 cursor-pointer'>
            <AiOutlineFileImage />
          </span>
        </div>
      </div>
      {show && <CreatePostModel setShow={setShow} />}
    </div>
  );
};

export default CreateFeed;
