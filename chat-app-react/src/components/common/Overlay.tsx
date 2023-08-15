import { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children?: ReactNode;
}

const Overlay: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={`${className} fixed top-0 left-0 right-0 bottom-0 bg-blackOverlay flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default Overlay;
