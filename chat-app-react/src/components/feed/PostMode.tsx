import { FC, useRef } from 'react';
import { postMode } from '../../ultils/list/post.list';
import { PostMode as PostModeType } from '../../ultils/interface';
import useClickOutside from '../../hooks/useClickOutside';

export interface IPropPostMode {
  setShowChangePostMode: (value: boolean) => void;
  handleChangePostMode: (mode: PostModeType) => void;
  position: string;
}

const PostMode: FC<IPropPostMode> = ({
  setShowChangePostMode,
  handleChangePostMode,
  position,
}) => {
  const postModeRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(postModeRef, () => setShowChangePostMode(false), 'mousedown');

  return (
    <div
      ref={postModeRef}
      className={`absolute ${position} min-w-[120px] p-[1px] rounded shadow-default bg-white z-10`}
    >
      {postMode.map((mode, idx) => (
        <div
          key={mode.title}
          onClick={() => handleChangePostMode(mode)}
          className={`flex items-center justify-start p-2 gap-1 cursor-pointer hover:bg-gray-100 ${
            idx === 0 && 'hover:rounded-tr hover:rounded-tl'
          } ${
            idx === postMode.length - 1 && 'hover:rounded-br hover:rounded-bl'
          } duration-300`}
        >
          <span className='text-lg'>
            <mode.Icon />
          </span>
          <span className='text-sm'>{mode.title}</span>
        </div>
      ))}
    </div>
  );
};

export default PostMode;
