import { FC, useEffect, useRef, useState } from 'react';

import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import {
  IFriend,
  IPost,
  PostMode as PostModeInterface,
} from '../../ultils/interface';
import useClickOutside from '../../hooks/useClickOutside';
import CreatePostWith from '../feed/CreatePostWith';
import OptionCreatePost from '../feed/OptionCreatePost';
import { PostType } from '../../ultils/constant';
import { useAppDispatch } from '../../app/hook';
import { createNewPost, createPost } from '../../features/post/postSlice';
import PostMode from '../feed/PostMode';
import { postMode } from '../../ultils/list/post.list';
import { IPropCreateFeed, ModeCreateFeed } from '../feed/CreateFeed';
import {
  convertUserToFriend,
  getUserLocalStorageItem,
  getUsername,
} from '../../ultils';
import { PostMode as PostModeType } from '../../ultils/constant/index';
import { setIsError } from '../../features/showError';

export interface IPropCreatePostModel extends IPropCreateFeed {
  setShow: (value: boolean) => void;
  type?: string;
  post?: IPost;
}

const userLocal = getUserLocalStorageItem();

const CreatePostModel: FC<IPropCreatePostModel> = ({
  setShow,
  type = PostType.POST,
  post = null,
  placeHolder,
  mode,
  user,
}) => {
  const [postContent, setPostContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const [listFriendTag, setListFriendTag] = useState<IFriend[]>([]);
  const [postModeDefault, setPostModeDefault] = useState<PostModeInterface>(
    postMode[0]
  );
  const [showChangePostMode, setShowChangePostMode] = useState(false);
  const [msgError, setMsgError] = useState('');

  const modalRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();

  useClickOutside(modalRef, () => setShow(false), 'mousedown');

  const handleChangeImage = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSelectEmoji = (emoji: any) => {
    setPostContent((prev) => `${prev ?? ''}${emoji.native}`);
  };

  const handleChangePostMode = (mode: PostModeInterface) => {
    setPostModeDefault(mode);
    setShowChangePostMode(false);
  };

  const handleCreatePost = async () => {
    if (file || postContent !== '' || type !== PostType.POST) {
      const formData = new FormData();
      const data = {
        post_content: postContent,
        post_type: type,
        // If have friend tag, only public or friend
        post_mode: postModeDefault.title.toLowerCase(),
        post_share: post?.post_type === PostType.POST ? post : post?.post_share,
        post_tag: listFriendTag.length !== 0 ? listFriendTag : undefined,
      };
      if (
        listFriendTag.length !== 0 &&
        postModeDefault.title.toLowerCase() === PostModeType.PRIVATE
      ) {
        // handle Error
        setMsgError('Can only be set as Public mode or Friend mode');
        return;
      }
      if (file) formData.append('file', file);
      formData.append('data', JSON.stringify(data));
      const res = (await dispatch(createPost(formData))) as any;
      if (res?.payload?.status === 200 || res?.payload?.status === 201) {
        dispatch(createNewPost(res?.payload?.data?.metaData));
      } else {
        dispatch(setIsError());
      }
      window.URL.revokeObjectURL(previewPicture ?? '');
      setPostContent('');
      setFile(null);
      setShow(false);
    }
  };

  useEffect(() => {
    if (file) {
      if (previewPicture) {
        window.URL.revokeObjectURL(previewPicture ?? '');
      }
      setPreviewPicture(window.URL.createObjectURL(file));
    }
  }, [file]);

  useEffect(() => {
    if (
      mode === ModeCreateFeed.WRITE_TIME &&
      listFriendTag.length === 0 &&
      user
    ) {
      const friend = convertUserToFriend(user);
      setListFriendTag([friend]);
    }
  }, [mode]);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 right-0 w-screen ${
        true ? 'flex' : 'hidden'
      } items-center justify-center h-screen bg-blackOverlay z-[1001] px-3 sm:px-0`}
    >
      <div
        ref={modalRef}
        className='relative flex flex-col gap-2 w-full sm:w-[60%] lg:w-[40%] p-4 bg-white animate__animated animate__fadeInDown rounded sm:rounded-md'
      >
        <h1 className='text-2xl text-center'>
          {type === PostType.POST ? 'Create new Post' : `Share Post`}
        </h1>

        <div className='flex gap-3 items-center'>
          <Avatar
            avatarUrl={userLocal.avatarUrl}
            className='w-12 h-12 min-h-[3rem] min-w-[3rem]'
          />
          <div>
            <div className='flex items-center gap-1'>
              <h1 className='text-lg'>{getUsername(userLocal)}</h1>
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

              {showChangePostMode && (
                <PostMode
                  setShowChangePostMode={setShowChangePostMode}
                  handleChangePostMode={handleChangePostMode}
                  position={'top-7 left-0'}
                />
              )}
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
              placeholder={placeHolder ?? 'What are you think ...?'}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              autoFocus={true}
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
            placeholder={
              placeHolder ??
              (type === PostType.POST
                ? 'What are you think ...?'
                : 'What are you think about Post...?')
            }
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            autoFocus={true}
          ></textarea>
        )}

        <OptionCreatePost
          handleChangeImage={handleChangeImage}
          handleSelectEmoji={handleSelectEmoji}
          setListFriendTag={setListFriendTag}
          type={type}
        />

        <div>
          <Button
            text={'Post'}
            className={'w-full'}
            paddingY={'py-2'}
            background={'bg-blue-500'}
            border={'border-none'}
            color={'text-white'}
            hover={'hover:bg-blue-700 duration-300'}
            onClick={handleCreatePost}
          />
          {msgError && <p className='text-red-500 text-xs'>{msgError}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModel;
