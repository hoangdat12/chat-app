import { FiMoreHorizontal } from 'react-icons/fi';
import Avatar from '../avatars/Avatar';
import { useState } from 'react';
import OptionDeleteAndUpdate from '../options/OptionDeleteAndUpdate';

const CommentContent = () => {
  const [showOption, setShowOption] = useState<boolean>(false);

  const handleShowOption = () => {
    setShowOption(true);
  };

  const handleDeleteComment = () => {};

  const handleUpdateComment = () => {};

  return (
    <div className='flex gap-3'>
      <Avatar
        avatarUrl={
          'https://toigingiuvedep.vn/wp-content/uploads/2021/01/avatar-dep-cute.jpg'
        }
        className={'w-10 h-10'}
      />
      <div>
        <div className='px-3 py-1 text-sm md: text-[16px] rounded-lg bg-white'>
          <h1 className='font-medium cursor-pointer'>Hoang Dat</h1>
          <p className='text-gray-700 text-[15px]'>Beautiful</p>
        </div>
        <div className='flex gap-3 px-3 mt-1 text-sm'>
          <span className='cursor-pointer hover:opacity-80'>Like</span>
          <span className='cursor-pointer hover:opacity-80'>Reply</span>
          <span className='cursor-pointer hover:opacity-80'>16 minus</span>
        </div>
      </div>
      <div className='relative ml-1 flex items-start mt-2'>
        <span
          onClick={handleShowOption}
          className='rounded-full cursor-pointer p-1 hover:bg-white duration-300'
        >
          <FiMoreHorizontal />
        </span>
        {showOption && (
          <OptionDeleteAndUpdate
            position={'-top-2 left-[130%]'}
            handleDelete={handleDeleteComment}
            handleUpdate={handleUpdateComment}
            setShowOption={setShowOption}
          />
        )}
      </div>
    </div>
  );
};

export default CommentContent;
