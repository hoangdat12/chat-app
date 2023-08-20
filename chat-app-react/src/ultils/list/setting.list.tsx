import { AiFillDelete, AiFillFileImage, AiOutlineLike } from 'react-icons/Ai';
import { BsChevronDown, BsFillPeopleFill } from 'react-icons/bs';
import { FaPushed } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { MdVideoLibrary } from 'react-icons/md';
import { VscTextSize } from 'react-icons/vsc';
import { BiLogOutCircle } from 'react-icons/bi';

import { ListConversationSetting } from '../../ultils/constant/setting.constant';

export const getListSetting = (type: string | undefined) => {
  if (!type) return [];
  return [
    {
      SubMenu: {
        title: ListConversationSetting.CHAT_DETAIL,
        icon: <BsChevronDown />,
      },
      List: [
        type === 'group'
          ? {
              title: ListConversationSetting.MEMBER,
              icon: <BsFillPeopleFill />,
            }
          : undefined,
        {
          title: ListConversationSetting.DELETE_MESSAGES,
          icon: <AiFillDelete />,
        },
        type === 'group'
          ? {
              title: ListConversationSetting.LEAVE_GROUP,
              icon: <BiLogOutCircle />,
            }
          : undefined,
      ],
    },
    {
      SubMenu: {
        title: ListConversationSetting.CUSTOME_CONVERSATION,
        icon: <BsChevronDown />,
      },
      List: [
        {
          title: ListConversationSetting.CHANGE_THEME,
          icon: <FaPushed />,
        },
        {
          title: ListConversationSetting.CHANGE_EMOJI,
          icon: <AiOutlineLike />,
        },
        {
          title: ListConversationSetting.CHANGE_USERNAME,
          icon: <VscTextSize />,
        },
        {
          title: ListConversationSetting.SEARCH_IN_CONVERSATION,
          icon: <IoSearchSharp />,
        },
      ],
    },
    {
      SubMenu: {
        title: ListConversationSetting.SHARED,
        icon: <BsChevronDown />,
      },
      List: [
        {
          title: ListConversationSetting.IMAGE,
          icon: <AiFillFileImage />,
        },
        {
          title: ListConversationSetting.VIDEO,
          icon: <MdVideoLibrary />,
        },
      ],
    },
  ];
};
