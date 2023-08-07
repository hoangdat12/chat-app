import { FC, memo, useRef, useState } from 'react';
import ReactCrop, { Crop, makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useParams } from 'react-router-dom';
import Button from '../button/Button';
import useClickOutside from '../../hooks/useClickOutside';
import { FcAddImage } from 'react-icons/fc';
import { ButtonRounded } from '../button/ButtonRounded';
import { MdOutlineArrowBack } from 'react-icons/md';

export interface IPropChangeAvatarGroup {
  imageUrl: string | ArrayBuffer | null;
  setViewImage: (value: string | ArrayBuffer | null) => void;
  isShow: boolean;
  setIsShow: (value: boolean) => void;
  handleChangeAvatar: any;
}

const ChangeAvatarGroup: FC<IPropChangeAvatarGroup> = memo(
  ({ imageUrl, setViewImage, isShow, setIsShow, handleChangeAvatar }) => {
    const [crop, setCrop] = useState<any>();
    const [image, setImage] = useState<HTMLImageElement | undefined>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { conversationId } = useParams();
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleCloseForm = () => {
      window.URL.revokeObjectURL(imagePreview ?? '');
      setViewImage(null);
      setIsShow(false);
    };

    useClickOutside(modalRef, handleCloseForm, 'mousedown');

    function onImageLoad(e: any) {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 75,
          },
          1,
          width,
          height
        ),
        width,
        height
      );

      setCrop(crop);
      setImage(e.target);
    }

    function imageCrop(crop: Crop) {
      setCrop(crop);
    }
    const imageCropComplete = async (crop: Crop) => {
      await userCrop(crop);
    };

    const userCrop = async (crop: Crop) => {
      if (image && crop.width && crop.height) {
        await getCroppedImage(image, crop);
      }
    };

    const getCroppedImage = (
      image: HTMLImageElement,
      crop: Crop,
      action: string = 'move'
    ): Promise<Blob | null> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width! * scaleX;
        canvas.height = crop.height! * scaleY;
        const ctx = canvas.getContext('2d') as any;

        ctx.drawImage(
          image,
          crop.x! * scaleX,
          crop.y! * scaleY,
          crop.width! * scaleX,
          crop.height! * scaleY,
          0,
          0,
          crop.width! * scaleX,
          crop.height! * scaleY
        );
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('The image canvas is empty'));
            return;
          }
          if (action === 'move') {
            let imageURL: string | undefined;
            window.URL.revokeObjectURL(imagePreview ?? '');
            imageURL = window.URL.createObjectURL(blob);
            setImagePreview(imageURL);
            resolve(blob);
          } else {
            resolve(blob);
          }
        }, 'image/jpeg');
      });
    };

    const handleChangeImage = (e: any) => {
      window.URL.revokeObjectURL(typeof imageUrl === 'string' ? imageUrl : '');
      const image = e.target.files?.[0];
      if (image) {
        const imageReader = new FileReader();
        imageReader.readAsDataURL(image);
        imageReader.onloadend = () => {
          setViewImage(imageReader.result);
        };
      }
    };

    const handleSaveImage = async () => {
      if (image) {
        const imageFile = await getCroppedImage(image, crop, 'submit');
        const formData = new FormData();
        if (imageFile) {
          formData.append('file', imageFile, 'croppedImage.jpg');
          if (conversationId) {
            formData.append('conversationId', conversationId);
          }
          handleChangeAvatar(formData);
          window.URL.revokeObjectURL(
            typeof imageUrl === 'string' ? imageUrl : ''
          );
          setViewImage(null);
          handleCloseForm();
        }
      }
    };

    return (
      <div
        className={`fixed top-0 left-0 bottom-0 right-0 w-screen ${
          isShow ? 'flex' : 'hidden'
        } items-center justify-center h-screen bg-gray-200 sm:bg-blackOverlay z-[1001]`}
      >
        <div
          ref={modalRef}
          className='relative grid grid-cols-7 w-full h-full md:w-[90%] lg:w-4/5 md:h-[90%] bg-white animate__animated animate__fadeInDown sm:rounded-md'
        >
          <div className='absolute top-5 left-2 md:hidden'>
            <ButtonRounded
              className={'text-lg p-2 bg-gray-200'}
              icon={<MdOutlineArrowBack />}
              onClick={handleCloseForm}
            />
          </div>

          <div className='col-span-7 lg:col-span-5 flex flex-col items-center justify-center border-r'>
            <ReactCrop
              crop={crop}
              onChange={imageCrop}
              locked={true}
              circularCrop={true}
              onComplete={imageCropComplete}
              style={{
                maxHeight: '75vh',
                minHeight: '250px',
                maxWidth: '90vh',
                minWidth: '200px',
              }}
            >
              <img
                src={imageUrl?.toString()}
                alt=''
                onLoad={(e) => onImageLoad(e)}
                className='w-full'
              />
            </ReactCrop>
          </div>

          <div className='col-span-2 hidden lg:flex flex-col justify-between w-full p-6'>
            {imagePreview && (
              <div className='flex items-center justify-center'>
                <img
                  className=' w-[200px] h-[200px] rounded-full overflow-hidden'
                  src={imagePreview}
                  alt=''
                />
              </div>
            )}
            <div className='relative flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center w-[200px] h-[200px] text-5xl border-2 border-dashed'>
                <FcAddImage />
                <h1 className='mt-2 text-gray-300 text-xl'>Change Image</h1>
              </div>
              <input
                type='file'
                className='absolute top-0 left-0 bottom-0 right-0 opacity-0 cursor-pointer'
                onChange={(e) => handleChangeImage(e)}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                text={'Close'}
                fontSize={'text-md'}
                border={'border-none'}
                color={'text-white'}
                background={'bg-red-500'}
                onClick={handleCloseForm}
                className={'min-w-[80px]'}
              />
              <Button
                text={'Save'}
                fontSize={'text-md'}
                border={'border-none'}
                background={'bg-blue-500'}
                color={'text-white'}
                onClick={handleSaveImage}
                className={'min-w-[80px]'}
              />
            </div>
          </div>

          <div className='absolute bottom-6 right-5 md:hidden flex justify-end gap-2'>
            <Button
              text={'Save'}
              fontSize={'text-md'}
              border={'border-none'}
              background={'bg-blue-500'}
              color={'text-white'}
              onClick={handleSaveImage}
              className={'min-w-[80px]'}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default ChangeAvatarGroup;
