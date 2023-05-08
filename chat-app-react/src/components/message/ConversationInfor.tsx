import { FC } from "react";
import Avatar, { IPropAvatar } from "../avatars/Avatar";

export interface IPropConversation {
  active?: boolean;
  avatarUrl: string;
  nickName: string;
  status: string;
  lastMessage: string;
}

const ConversationInfor: FC<IPropConversation> = ({
  active,
  avatarUrl,
  nickName,
  status,
  lastMessage,
}) => {
  return (
    <div
      className={`flex gap-3 py-4 px-4 xl:px-6 border-b-[2px] ${
        active ? "border-white" : "border-[#e8ebed]"
      }`}
    >
      <div>
        <Avatar className={"xl:w-14 xl:h-14 h-12 w-12"} avatarUrl={avatarUrl} />
      </div>
      <div className='w-user-conversation flex flex-col justify-center'>
        <div className='flex justify-between items-center '>
          <h1 className='text-lg xl:text-lg font-medium font-poppins'>
            {nickName}
          </h1>
          <span className='text-[10px] font-medium text-green-500'>
            {status}
          </span>
        </div>

        <div className='flex justify-between text-[13px]'>
          <p className=' w-[80%] whitespace-nowrap overflow-hidden text-ellipsis font-poppins'>
            {lastMessage}
          </p>
          <span className='w-[20px] h-[20px] rounded-full flex items-center justify-center text-white bg-gray-500 text-[12px]'>
            2
          </span>
        </div>
      </div>
    </div>
  );
};

export const ConversationInforMobile: FC<IPropAvatar> = ({ avatarUrl }) => {
  return (
    <div className='flex justify-center py-2'>
      <Avatar className={"xl:w-14 xl:h-14 h-12 w-12"} avatarUrl={avatarUrl} />
    </div>
  );
};

export default ConversationInfor;
