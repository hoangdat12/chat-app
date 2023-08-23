import { AiOutlineHome } from 'react-icons/Ai';
import { FiSend, FiSettings } from 'react-icons/fi';
import { BsPerson, BsGithub } from 'react-icons/bs';
import {
  IoGameControllerOutline,
  IoHelpBuoyOutline,
  IoMusicalNotesOutline,
} from 'react-icons/io5';
import { getUserLocalStorageItem } from '..';
import { SiAboutdotme } from 'react-icons/si';

const user = getUserLocalStorageItem();

export const selectNav1 = [
  {
    display: 'NewsFeed',
    path: '/',
    icons: <AiOutlineHome />,
  },
  {
    display: 'Messages',
    path: '/conversation',
    icons: <FiSend />,
  },
  {
    display: 'Profile',
    path: `/profile/${user?._id}`,
    icons: <BsPerson />,
  },
];

export const selectNavUtils = [
  {
    display: 'Games',
    path: '/game',
    icons: <IoGameControllerOutline />,
  },
  {
    display: 'Music',
    path: '/page/login',
    icons: <IoMusicalNotesOutline />,
  },
];

export const selectNavExplore = [
  {
    display: 'About me',
    path: '/about',
    icons: <SiAboutdotme />,
  },
  {
    display: 'Github',
    path: 'https://github.com/hoangdat12',
    icons: <BsGithub />,
  },
];

export const selectNav2 = [
  {
    display: 'Setting',
    path: '/setting',
    icons: <FiSettings />,
  },
  {
    display: 'Help',
    path: '/help',
    icons: <IoHelpBuoyOutline />,
  },
];
