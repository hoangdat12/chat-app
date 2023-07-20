import { useEffect, useRef, useState } from 'react';

import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { postMode } from '../../ultils/list/post.list';
import { IFriend, PostMode } from '../../ultils/interface';
import useClickOutside from '../../hooks/useClickOutside';
import CreatePostWith from '../feed/CreatePostWith';
import OptionCreatePost from '../feed/OptionCreatePost';

const CreatePostModel = () => {
  const [postModeDefault, setPostModeDefault] = useState<PostMode>(postMode[0]);
  const [showChangePostMode, setShowChangePostMode] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const [listFriendTag, setListFriendTag] = useState<IFriend[]>([]);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const postModeRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(postModeRef, () => setShowChangePostMode(false), 'mousedown');

  const handleChangePostMode = (mode: PostMode) => {
    setPostModeDefault(mode);
    setShowChangePostMode(false);
  };

  const handleChangeImage = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSelectEmoji = (emoji: any) => {
    setPostContent((prev) => `${prev ?? ''} ${emoji.native}`);
  };

  useEffect(() => {
    if (file) {
      if (previewPicture) {
        window.URL.revokeObjectURL(previewPicture ?? '');
      }
      setPreviewPicture(window.URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 right-0 w-screen ${
        true ? 'flex' : 'hidden'
      } items-center justify-center h-screen bg-gray-200 sm:bg-blackOverlay z-[1001]`}
    >
      <div
        ref={modalRef}
        className='relative flex flex-col gap-2 w-[60%] lg:w-[40%] p-4 bg-white animate__animated animate__fadeInDown sm:rounded-md'
      >
        <h1 className='text-2xl text-center'>Create new Post</h1>
        <div className='flex gap-3 items-center'>
          <Avatar
            avatarUrl={
              'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg'
            }
            className='w-12 h-12'
          />
          <div>
            <div className='flex items-center gap-1'>
              <h1 className='text-lg'>Hoang Dat</h1>
              <CreatePostWith listFriendTag={listFriendTag} />
            </div>
            <div className='relative flex'>
              <div
                onClick={() => setShowChangePostMode(true)}
                className='flex items-center justify-start bg-gray-100 px-1 py-[2px] gap-1 rounded cursor-pointer'
              >
                <span className='text-lg'>
                  <postModeDefault.Icon />
                </span>
                <span className='text-sm'>{postModeDefault.title}</span>
              </div>

              <div
                ref={postModeRef}
                className={`absolute top-7 left-0 ${
                  !showChangePostMode && 'hidden'
                } min-w-[120px] rounded shadow-default bg-white`}
              >
                {postMode.map((mode) => (
                  <div
                    key={mode.title}
                    onClick={() => handleChangePostMode(mode)}
                    className='flex items-center justify-start p-2 gap-1 cursor-pointer hover:bg-gray-50 duration-300'
                  >
                    <span className='text-lg'>
                      <mode.Icon />
                    </span>
                    <span className='text-sm'>{mode.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {previewPicture ? (
          <div>
            <input
              type='text'
              name=''
              id=''
              className='w-full outline-none mb-2 px-3 py-2 whitespace-pre-wrap overflow-x-auto border rounded-md'
              placeholder='What are you think?'
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className='flex items-center justify-center mb-2'>
              <img
                src={previewPicture}
                alt=''
                style={{
                  maxHeight: '50vh',
                  minHeight: '250px',
                  maxWidth: '100vh',
                  minWidth: '200px',
                }}
              />
            </div>
          </div>
        ) : (
          <textarea
            name=''
            id=''
            cols={25}
            rows={9}
            className='w-full p-2 mt-2 outline-none'
            placeholder='What are you think ...?'
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>
        )}

        <OptionCreatePost
          handleChangeImage={handleChangeImage}
          handleSelectEmoji={handleSelectEmoji}
          setListFriendTag={setListFriendTag}
        />

        <Button
          text={'Post'}
          className={'w-full'}
          paddingY={'py-2'}
          background={'bg-blue-500'}
          border={'border-none'}
          color={'text-white'}
          hover={'hover:bg-blue-700 duration-300'}
        />
      </div>
    </div>
  );
};

export default CreatePostModel;
