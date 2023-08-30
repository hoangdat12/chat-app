import Avatar from '../avatars/Avatar';
import { IPost } from '../../ultils/interface';
import { FC, useEffect, useRef, useState } from 'react';
import { getTimeCreatePost, getUsername } from '../../ultils';
import { CgMoreVertical } from 'react-icons/cg';
import { FaRegBookmark } from 'react-icons/fa';
import { MdReportProblem } from 'react-icons/md';
import useClickOutside from '../../hooks/useClickOutside';
import { PostMode as PostModeType, PostType } from '../../ultils/constant';
import { postService } from '../../features/post/postService';
import PostMode from './PostMode';
import { postMode } from '../../ultils/list/post.list';
import CreatePostWith from './CreatePostWith';
import { useAppDispatch } from '../../app/hook';
import { setIsError, setIsSuccess } from '../../features/showError';
import { useNavigate } from 'react-router-dom';

export interface IPropPostOwner {
  post: IPost;
  isOwner: boolean;
  shared?: boolean;
  saved?: boolean;
  feedSave?: IPost;
  handleDeletePost: (post: IPost) => void;
}

export interface IPostMode {
  title: string;
  Icon: any;
}

const PostOwner: FC<IPropPostOwner> = ({
  post,
  isOwner,
  shared = false,
  saved = false,
  feedSave,
  handleDeletePost,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showChangePostMode, setShowChangePostMode] = useState(false);
  const [modeDefault, setModeDefault] = useState<IPostMode | null>(null);
  const optionRef = useRef<HTMLUListElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleShowOptions = () => {
    setShowOptions(false);
  };

  const handleClickShowMore = () => {
    setShowOptions(true);
  };

  const handleSavePost = async () => {
    if (!saved) {
      const formData = new FormData();
      const data = {
        post_type: PostType.SAVE,
        post_mode: PostModeType.PRIVATE,
        post_share: post.post_type === PostType.POST ? post : post.post_share,
      };
      formData.append('data', JSON.stringify(data));
      const res = await postService.createNewPost(formData);
      if (res.status === 200 || res.status === 201) {
        dispatch(setIsSuccess());
      } else {
        dispatch(setIsError);
      }
    }
    setShowOptions(false);
  };

  const handleShowPostMode = async () => {
    if (isOwner) {
      setShowChangePostMode(true);
    }
  };

  const handleChangePostMode = async (mode: IPostMode) => {
    if (mode.title !== modeDefault?.title) {
      setModeDefault(mode);
      if (modeDefault) {
        const data = {
          postId: post._id,
          post_mode: mode.title,
        };
        const res = await postService.changePostMode(data);
        if (res.status === 200) {
          setModeDefault(mode);
        } else {
          dispatch(setIsError());
        }
      }
    }
    setShowChangePostMode(false);
  };

  useClickOutside<HTMLUListElement>(optionRef, handleShowOptions, 'mousedown');

  useEffect(() => {
    if (modeDefault === null) {
      for (let mode of postMode) {
        if (mode.title === post.post_mode) {
          setModeDefault(mode);
          return;
        }
      }
    }
  }, [post]);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          <Avatar
            avatarUrl={post?.user?.avatarUrl}
            className={'w-12 h-12 min-h-[3rem] min-w-[3rem]'}
            onClick={() => navigate(`/profile/${post?.user?._id}`)}
          />
          <div>
            <div className='flex items-center'>
              <h1 className='text-base'>{getUsername(post?.user)}</h1>
              {post && post.post_tag && (
                <CreatePostWith listFriendTag={post.post_tag} />
              )}
            </div>
            <div className='relative flex gap-1 items-center'>
              <span
                onClick={handleShowPostMode}
                className='text-sm cursor-pointer text-[#565252]'
              >
                {modeDefault && <modeDefault.Icon />}
              </span>
              {isOwner && showChangePostMode && (
                <PostMode
                  setShowChangePostMode={setShowChangePostMode}
                  handleChangePostMode={handleChangePostMode}
                  position={'top-6 left-0'}
                />
              )}
              <p className='text-xs text-[#678]'>
                {getTimeCreatePost(post?.createdAt)}
              </p>
            </div>
          </div>
        </div>
        {!shared && (
          <div className='relative'>
            <span className='cursor-pointer' onClick={handleClickShowMore}>
              <CgMoreVertical />
            </span>
            <ul
              className={`absolute right-0 ${
                !showOptions && 'hidden'
              } w-[132px] ${
                saved ? 'bottom-8' : 'h-24 top-more-feed'
              } bg-white rounded-lg overflow-hidden shadow-default`}
              ref={optionRef}
            >
              <li
                onClick={handleSavePost}
                className={`h-12 ${
                  saved ? 'hidden' : 'flex'
                } items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer`}
              >
                <FaRegBookmark />
                <span>Save post</span>
              </li>
              <li
                onClick={() =>
                  handleDeletePost(saved && feedSave ? feedSave : post)
                }
                className='h-12 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer'
              >
                <span className='text-red-500'>
                  <MdReportProblem />
                </span>
                <span>{isOwner ? 'Delete post' : 'Repot post'}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOwner;
