import Avatar from '../avatars/Avatar';
import { FC, useState } from 'react';
import CreatePostModel from '../modal/CreatePostModel';
import { IUser } from '../../ultils/interface';
import { FaFileImage } from 'react-icons/fa';

export interface IPropCreateFeed {
  mode: string;
  placeHolder?: string;
  user?: IUser | null;
}

export enum ModeCreateFeed {
  CREATE = 'Create',
  WRITE_TIME = 'Write time',
}

const CreateFeed: FC<IPropCreateFeed> = ({ mode, placeHolder, user }) => {
  const [show, setShow] = useState(false);

  const setShowModelCreatePost = () => {
    setShow(true);
  };

  return (
    <div className='w-full p-3 rounded-lg bg-white'>
      <div className='flex justify-between gap-3 '>
        <Avatar
          avatarUrl={
            'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg'
          }
          className='w-12 h-12 min-h-[3rem] min-w-[3rem]'
        />
        <div className='flex items-center w-full'>
          <input
            type='text'
            name=''
            id=''
            className='w-full outline-none'
            placeholder={placeHolder ?? 'What are you think?'}
            onClick={setShowModelCreatePost}
          />
          <span onClick={setShowModelCreatePost} className='p-1 cursor-pointer'>
            <FaFileImage />
          </span>
        </div>
      </div>
      {show && (
        <CreatePostModel
          mode={mode}
          placeHolder={placeHolder}
          user={user}
          setShow={setShow}
        />
      )}
    </div>
  );
};

export default CreateFeed;
