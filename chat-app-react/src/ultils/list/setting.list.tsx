import { AiOutlineFileImage, AiOutlineLike } from 'react-icons/Ai';
import { BsChevronDown } from 'react-icons/bs';
import { FaPushed } from 'react-icons/fa';
import { IoSearchSharp } from 'react-icons/io5';
import { MdAttachFile, MdOutlineVideoLibrary } from 'react-icons/md';
// import { TfiPin2 } from 'react-icons/tfi';
import { VscTextSize } from 'react-icons/vsc';

export const ListDetailSetting = [
  // {
  //   SubMenu: {
  //     title: 'Chat Detail',
  //     icon: <BsChevronDown />,
  //   },
  //   List: [{ title: 'Pinned messages', icon: <TfiPin2 /> }],
  // },
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
        icon: <AiOutlineFileImage />,
      },
      {
        title: 'Video',
        icon: <MdOutlineVideoLibrary />,
      },
      {
        title: 'Link',
        icon: <MdAttachFile />,
      },
    ],
  },
];
