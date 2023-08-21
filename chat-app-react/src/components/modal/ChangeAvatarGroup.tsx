import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import {
  Cropper,
  CropperRef,
  CropperPreview,
  CropperPreviewRef,
  CircleStencil,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { Slider } from './adjustAvatar/Slider';
import { AdjustablePreviewBackground } from './adjustAvatar/AdjustablePreviewBackground';
import { Navigation } from './adjustAvatar/Navigation';
import { GrPowerReset } from 'react-icons/gr';
import { AdjustableCropperBackground } from './adjustAvatar/AdjustableCropperBackground';
import { Button } from './adjustAvatar/Button';
import { AiOutlineClose } from 'react-icons/Ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { userService } from '../../features/user/userService';
import { getUserLocalStorageItem } from '../../ultils';
import { conversationService } from '../../features/conversation/conversationService';
import { useAppDispatch } from '../../app/hook';
import { updateAvatarOfGroup } from '../../features/conversation/conversationSlice';
import { LoadingWithText } from '../button/Loading';

const userLocal = getUserLocalStorageItem();

const ChangeAvatarGroup = () => {
  const cropperRef = useRef<CropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);
  const [src, setSrc] = useState('');
  const [mode, setMode] = useState('crop');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  });

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  const onReset = () => {
    setMode('crop');
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    });
  };

  const onUpload = (blob: string) => {
    onReset();
    setMode('crop');
    setSrc(blob);
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const onChangeAvatar = async () => {
    setIsLoading(true);
    const formData = new FormData();
    if (cropperRef.current && file) {
      formData.append('file', file, 'croppedImage.jpg');
      if (location.state.conversationId) {
        formData.append('conversationId', location.state.conversationId);
        const res = await conversationService.handleChangeAvatarOfGroup(
          formData
        );
        if (res && (res.status === 200 || res.status === 201)) {
          URL.revokeObjectURL(src);
          dispatch(
            updateAvatarOfGroup({
              conversationId: location.state.conversationId,
              avatarUrl: res.data.metaData.avatarUrl,
            })
          );
          navigate(-1);
        }
      } else {
        const res = await userService.changeAvatar(formData);
        if (res && (res.status === 200 || res.status === 201)) {
          const avatar = res.data.metaData;
          userLocal.avatarUrl = avatar;
          localStorage.setItem('user', JSON.stringify(userLocal));
          URL.revokeObjectURL(src);
          navigate(-1);
        }
      }
    }
    setIsLoading(false);
  };

  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  const cropperEnabled = mode === 'crop';

  useEffect(() => {
    if (!location.state.file) {
      navigate(-1);
      return; // Early return for invalid states
    }

    const objectURL = URL.createObjectURL(location.state.file);
    setSrc(objectURL);
    setFile(location.state.file);

    return () => {
      URL.revokeObjectURL(objectURL);
    };
  }, [location]);

  return (
    <div className={'image-editor h-screen'}>
      <div className='bg-gray-900 max-h-full relative h-[calc(100%-80px)]'>
        <div className='flex items-center justify-center h-full'>
          {src && (
            <Cropper
              src={src}
              ref={cropperRef}
              stencilProps={{
                movable: cropperEnabled,
                resizable: cropperEnabled,
                lines: cropperEnabled,
                handlers: cropperEnabled,
                overlayClassName: cn(
                  'duration-500',
                  !cropperEnabled && 'text-black text-opacity-90'
                ),
              }}
              backgroundWrapperProps={{
                scaleImage: cropperEnabled,
                moveImage: cropperEnabled,
              }}
              backgroundComponent={AdjustableCropperBackground}
              backgroundProps={adjustments}
              onUpdate={onUpdate}
              stencilComponent={CircleStencil}
            />
          )}
        </div>
        {mode !== 'crop' && (
          <Slider
            className='w-full left-1/2 transform -translate-x-1/2 bottom-[20px] absolute'
            value={adjustments[mode]}
            onChange={onChangeValue}
          />
        )}
        <CropperPreview
          className={
            'h-[45px] w-[45px] md:w-[80px] md:h-[80px] absolute left-10 top-10 rounded-full overflow-hidden'
          }
          ref={previewRef}
          cropper={cropperRef}
          backgroundComponent={AdjustablePreviewBackground}
          backgroundProps={adjustments}
        />
        <div className='absolute flex gap-2 top-4 right-4'>
          <Button
            className={`${
              !changed ? 'hidden' : 'flex'
            } p-1 rounded-full bg-[#2d2c2c] hover:bg-[#484646]`}
            onClick={onReset}
          >
            <GrPowerReset />
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className='p-1 rounded-full bg-[#2d2c2c] hover:bg-[#484646]'
          >
            <AiOutlineClose />
          </Button>
        </div>
      </div>
      <Navigation
        mode={mode}
        onChange={setMode}
        onUpload={onUpload}
        onChangeAvatar={onChangeAvatar}
        setFile={setFile}
        src={src}
      />
      {isLoading && <LoadingWithText text={'Please wait 10 seconds :))'} />}
    </div>
  );
};

export default ChangeAvatarGroup;
