import { HiLockClosed } from 'react-icons/hi';
import { FaUserFriends } from 'react-icons/fa';
import { RiEarthFill } from 'react-icons/ri';
import { PostMode } from '../constant';

export const postMode = [
  {
    title: PostMode.PUBLIC,
    Icon: RiEarthFill,
  },
  {
    title: PostMode.PRIVATE,
    Icon: HiLockClosed,
  },
  {
    title: PostMode.FRIEND,
    Icon: FaUserFriends,
  },
];
