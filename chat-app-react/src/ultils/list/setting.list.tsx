import { AiFillDelete, AiFillFileImage, AiOutlineLike } from 'react-icons/Ai';
import { BsChevronDown, BsFillPeopleFill } from 'react-icons/bs';
import { FaPushed } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { MdVideoLibrary } from 'react-icons/md';
import { VscTextSize } from 'react-icons/vsc';
import { BiLogOutCircle } from 'react-icons/bi';

export const ListDetailSetting = [
  {
    SubMenu: {
      title: 'Chat Detail',
      icon: <BsChevronDown />,
    },
    List: [
      { title: 'Member', icon: <BsFillPeopleFill /> },
      { title: 'Delete messages', icon: <AiFillDelete /> },
      { title: 'Leave group', icon: <BiLogOutCircle /> },
    ],
  },
  {
    SubMenu: {
      title: 'Custome conversation',
      icon: <BsChevronDown />,
    },
    List: [
      {
        title: 'Change theme',
        icon: <FaPushed />,
      },
      {
        title: 'Change emoji',
        icon: <AiOutlineLike />,
      },
      {
        title: 'Change username',
        icon: <VscTextSize />,
      },
      {
        title: 'Search in conversation',
        icon: <IoSearchSharp />,
      },
    ],
  },
  {
    SubMenu: {
      title: 'Shared',
      icon: <BsChevronDown />,
    },
    List: [
      {
        title: 'File',
        icon: <AiFillFileImage />,
      },
      {
        title: 'Video',
        icon: <MdVideoLibrary />,
      },
    ],
  },
];
