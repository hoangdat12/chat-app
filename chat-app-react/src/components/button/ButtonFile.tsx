import {
  ChangeEvent,
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
} from 'react';

export interface IPropButtonFile {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  files: FileList | null;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  inputRef?: any;
}

export const ButtonFile: FC<IPropButtonFile> = ({
  icon,
  className,
  onClick,
  images,
  setImages,
  files,
  setFiles,
  inputRef,
}) => {
  useEffect(() => {
    if (!files) {
      return;
    }

    let updateImages: string[] = [];
    for (let file of files) {
      const objectUrl = URL.createObjectURL(file);
      updateImages.push(objectUrl);
    }
    setImages(updateImages);

    // Free memory when this component is unmounted
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [files]);

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      setFiles(null);
      return;
    }

    setFiles(selectedFiles);
    if (inputRef) {
      inputRef?.current?.focus();
    }
  };

  return (
    <div
      className={`${className} relative flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer`}
      onClick={onClick ? onClick : undefined}
    >
      {icon}
      <input
        type='file'
        className='opacity-0 overflow-visible absolute top-0 right-0 bottom-0 left-0 cursor-pointer'
        onChange={(e: any) => onSelectFile(e)}
      />
    </div>
  );
};
