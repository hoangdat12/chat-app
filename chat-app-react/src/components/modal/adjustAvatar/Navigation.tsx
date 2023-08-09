import { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from 'react';
import { BiCrop, BiSun } from 'react-icons/bi';
import { IoWaterOutline } from 'react-icons/io5';
import { Button } from './Button';
import { BsCircle, BsCircleHalf, BsUpload } from 'react-icons/bs';

interface Props {
  className?: string;
  mode?: string;
  onChange?: (mode: string) => void;
  onChangeAvatar?: () => void;
  onUpload?: (blob: string) => void;
  setFile: Dispatch<SetStateAction<File | null>>;
  src: string;
}

export const Navigation: FC<Props> = ({
  className,
  onChange,
  onUpload,
  onChangeAvatar,
  mode,
  setFile,
  src,
}) => {
  const setMode = (mode: string) => () => {
    onChange?.(mode);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    // Reference to the DOM input element
    const { files } = event.target;

    // Ensure that you have a file before attempting to read it
    if (files && files[0]) {
      if (onUpload) {
        if (src) {
          URL.revokeObjectURL(src);
        }
        onUpload(URL.createObjectURL(files[0]));
        setFile(files[0]);
      }
    }
    // Clear the event target value to give the possibility to upload the same image:
    event.target.value = '';
  };

  return (
    <div
      className={`${className} bg-gray-900 h-20 border-t border-gray-700 flex items-center justify-between px-4`}
    >
      <Button className={'mx-1 sm:mx-2'} onClick={onUploadButtonClick}>
        <BsUpload />
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          onChange={onLoadImage}
          className='hidden'
        />
      </Button>
      <div className='flex items-center justify-center'>
        <Button
          className={'mx-1 sm:mx-2'}
          active={mode === 'crop'}
          onClick={setMode('crop')}
        >
          <BiCrop />
        </Button>
        <Button
          className={'mx-1 sm:mx-2'}
          active={mode === 'saturation'}
          onClick={setMode('saturation')}
        >
          <IoWaterOutline />
        </Button>
        <Button
          className={'mx-1 sm:mx-2'}
          active={mode === 'brightness'}
          onClick={setMode('brightness')}
        >
          <BiSun />
        </Button>
        <Button
          className={'mx-1 sm:mx-2'}
          active={mode === 'contrast'}
          onClick={setMode('contrast')}
        >
          <BsCircleHalf />
        </Button>
        <Button
          className={'mx-1 sm:mx-2'}
          active={mode === 'hue'}
          onClick={setMode('hue')}
        >
          <BsCircle />
        </Button>
      </div>
      <button
        className={
          'mx-1 sm:mx-2 px-4 py-2 rounded hover:bg-white hover:bg-opacity-[0.03] duration-300'
        }
        onClick={onChangeAvatar}
      >
        Change
      </button>
    </div>
  );
};
