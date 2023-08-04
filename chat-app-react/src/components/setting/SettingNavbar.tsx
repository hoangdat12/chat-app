import { Link, useLocation } from 'react-router-dom';
import useInnerWidth from '../../hooks/useInnterWidth';

export const listSettingNavbar = [
  {
    title: 'My Profile',
    link: '/setting',
  },
  {
    title: 'Security',
    link: '/setting/security',
  },
  {
    title: 'Language',
    link: '/setting/language',
  },
];

const SettingNavbar = () => {
  const location = useLocation();

  const innterWidth = useInnerWidth();

  const active = 'bg-blue-500 text-white';
  const inActive = 'hover:bg-white duration-300';

  return innterWidth < 768 ? (
    <ul className='flex gap-1 h-full py-2 px-4'>
      {listSettingNavbar.map((item, idx) => (
        <li
          key={idx}
          className={`${
            location.pathname === item.link ? active : inActive
          } px-4 py-1 cursor-pointer rounded-md`}
        >
          <Link to={item.link}>{item.title}</Link>
        </li>
      ))}
    </ul>
  ) : (
    <ul className='flex flex-col gap-1 h-full px-4 py-4 sm:py-6'>
      {listSettingNavbar.map((item, idx) => (
        <li
          key={idx}
          className={`${
            location.pathname === item.link ||
            (location.pathname.startsWith('/setting/security/') &&
              item.title === 'Security')
              ? active
              : inActive
          } flex text-lg cursor-pointer rounded-md overflow-hidden`}
        >
          <Link className='w-full h-full px-4 py-3 sm:py-4 ' to={item.link}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SettingNavbar;
