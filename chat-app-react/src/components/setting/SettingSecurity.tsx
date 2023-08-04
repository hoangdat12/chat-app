import { FC, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { listSecurity } from '../../ultils/list/settingSiderBar.list';

export interface IPropSecurityButton {
  item: any;
}

const SettingSecurity = () => {
  return (
    <div className='flex flex-col gap-5 w-full h-full'>
      <h1 className='text-lg'>Security</h1>
      <ul className='w-full lg:w-4/5 xl:w-1/2'>
        {listSecurity.map((item, idx) => (
          <SecurityButton key={idx} item={item} />
        ))}
      </ul>
    </div>
  );
};

export const SecurityButton: FC<IPropSecurityButton> = ({ item }) => {
  const [show, setShow] = useState(false);
  return (
    <li className='px-4 py-2'>
      <div
        onClick={() => setShow(!show)}
        className='flex items-center justify-between cursor-pointer'
      >
        <span>{item.title}</span>
        <span className={`${show && '-rotate-90'} duration-300 text-sm`}>
          <BsChevronDown />
        </span>
      </div>
      {show && item.chilrend && <item.chilrend />}
    </li>
  );
};

export default SettingSecurity;
