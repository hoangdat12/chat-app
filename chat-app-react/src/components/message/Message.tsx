import { FC } from "react";
import Avatar from "../avatars/Avatar";

export interface IPropMyMessage {
  className?: string;
  contents: string[];
}

export interface IPropOtherMessage {
  className?: string;
  avatarUrl: string;
  contents: string[];
}

const MyMessage: FC<IPropMyMessage> = ({ contents, className }) => {
  return (
    <div className={`${className} flex items-center justify-end mt-2`}>
      {contents.map((content, idx) => (
        <span key={idx} className='px-4 py-1 bg-[#f2f3f4] rounded-xl'>
          {content}
        </span>
      ))}
    </div>
  );
};

export const OtherMessage: FC<IPropOtherMessage> = ({
  avatarUrl,
  contents,
  className,
}) => {
  return (
    <div className={`${className} flex items-end gap-3`}>
      <Avatar className={"w-10 h-10"} avatarUrl={avatarUrl} />
      <div className=''>
        {contents.map((content, idx) => (
          <div key={idx} className='flex mt-2'>
            <p className='px-4 py-1 bg-[#f2f3f4] rounded-xl'>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MyMessageMobile: FC<IPropMyMessage> = ({
  contents,
  className,
}) => {
  return (
    <div className={`${className} flex items-center justify-end mt-1`}>
      {contents.map((content, idx) => (
        <span key={idx} className='text-sm px-3 py-1 bg-[#f2f3f4] rounded-xl'>
          {content}
        </span>
      ))}
    </div>
  );
};

export const OtherMessageMobile: FC<IPropOtherMessage> = ({
  avatarUrl,
  contents,
  className,
}) => {
  return (
    <div className={`${className} flex items-end gap-3`}>
      <Avatar className={"w-8 h-8"} avatarUrl={avatarUrl} />
      <div className=''>
        {contents.map((content, idx) => (
          <div key={idx} className='flex mt-1'>
            <p className='text-sm px-3 py-1 bg-[#f2f3f4] rounded-xl'>
              {content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMessage;
