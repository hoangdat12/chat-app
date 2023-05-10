import { FC } from "react";
import Avatar from "../avatars/Avatar";
import { IMessage } from "./ConversationContent";

export interface IPropMyMessage {
  className?: string;
  contents: IMessage[];
}

export interface IPropOtherMessage {
  className?: string;
  avatarUrl: string;
  contents: IMessage[];
}

const MyMessage: FC<IPropMyMessage> = ({ contents, className }) => {
  return (
    <div
      className={`${className} flex flex-col-reverse items-end justify-center mt-3`}
    >
      {contents.map((content, idx) => (
        <span
          key={idx}
          className='max-w-[80%] text-sm sm:text-base px-3 sm:px-4 py-1 bg-[#f2f3f4] rounded-xl mt-2'
        >
          {content.message_content}
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
    <div className={`${className} flex items-end gap-3 mt-3`}>
      <Avatar
        className={"w-8 h-8 sm:w-10 sm:h-10 flex items-end"}
        avatarUrl={avatarUrl}
      />
      <div className='flex flex-col-reverse w-full'>
        {contents.map((content, idx) => (
          <div key={idx} className='flex mt-2'>
            <p className='max-w-[80%] text-sm sm:text-base px-3 sm:px-4 py-1 bg-[#f2f3f4] rounded-xl'>
              {content.message_content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const MyMessageMobile: FC<IPropMyMessage> = ({
//   contents,
//   className,
// }) => {
//   return (
//     <div
//       className={`${className} flex flex-col-reverse items-end justify-center mt-2 max-w-[80%]`}
//     >
//       {contents.map((content, idx) => (
//         <span
//           key={idx}
//           className='text-sm px-3 py-1 bg-[#f2f3f4] rounded-xl mt-1'
//         >
//           {content.message_content}
//         </span>
//       ))}
//     </div>
//   );
// };

// export const OtherMessageMobile: FC<IPropOtherMessage> = ({
//   avatarUrl,
//   contents,
//   className,
// }) => {
//   return (
//     <div className={`${className} flex items-end gap-3 mt-2`}>
//       <Avatar className={"w-8 h-8"} avatarUrl={avatarUrl} />
//       <div className=''>
//         {contents.map((content, idx) => (
//           <div key={idx} className='flex mt-1'>
//             <p className='text-sm px-3 py-1 bg-[#f2f3f4] rounded-xl mt-2 max-w-[80%]'>
//               {content.message_content}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export default MyMessage;
