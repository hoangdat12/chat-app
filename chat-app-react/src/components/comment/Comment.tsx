import { FiImage } from 'react-icons/fi';
import { BsEmojiSmile } from 'react-icons/bs';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import CommentContent from './CommentContent';

const Comment = () => {
  return (
    <div className='flex flex-col gap-2 mt-6'>
      <h1 className='text-lg cursor-pointer mb-2'>Comment</h1>
      <div className='flex flex-col gap-4 max-h-[340px] overflow-y-scroll'>
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <CommentContent />
        <div className='flex justify-between w-full px-6'>
          <span>...</span>
          <span className='border-b-2 border-b-transparent hover:border-b-black text-sm cursor-pointer'>
            Show 10 comment
          </span>
        </div>
      </div>
      <div
        className={`relative flex items-start gap-2 mt-4 border p-3 rounded-lg`}
      >
        <Avatar
          avatarUrl={
            'https://toigingiuvedep.vn/wp-content/uploads/2021/01/avatar-dep-cute.jpg'
          }
          className='w-12 h-12'
        />
        <div className='w-full'>
          <div className='flex items-center gap-2 sm:gap-4 pl-3 sm:pl-4 w-full bg-white rounded-lg overflow-hidden'>
            <input
              type='text'
              placeholder='Enter your message...'
              className='text-sm sm:text-base font-medium w-full py-2 outline-none bg-transparent'
            />
            <Button text={'Send'} border={'border-none'} paddingX={'px-4'} />
          </div>
          <div className='flex items-center gap-3 mt-1 text-lg pl-2 text-gray-600'>
            <span className='cursor-pointer'>
              <FiImage />
            </span>
            <span className='cursor-pointer'>
              <BsEmojiSmile />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
