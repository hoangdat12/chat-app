import { FC } from 'react';
import { useAppDispatch } from '../../app/hook';
import { getInforUserWithOauth2 } from '../../features/auth/authSlice';

export interface IProp {
  className?: string;
  Icon: React.ElementType;
  name: string;
}

const LoginWith: FC<IProp> = ({ className, name, Icon }) => {
  const dispatch = useAppDispatch();
  const handleLoginWithOauth2 = () => {
    const nameUrl = name.charAt(0).toLowerCase() + name.slice(1);
    const loginOauth2Api = `http://localhost:8080/api/v1/auth/login/${nameUrl}`;
    const newWindow = window.open(
      loginOauth2Api,
      '_blank',
      'width=500,height=600'
    );

    if (newWindow) {
      let timer = setInterval(() => {
        if (newWindow.closed) {
          dispatch(getInforUserWithOauth2());
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };

  return (
    <button
      onClick={handleLoginWithOauth2}
      className={`relative flex items-center justify-between w-full p-1 text-white rounded-md ${className}`}
    >
      <span className={`${name === 'Google' ? 'bg-white' : ''} p-1 rounded-md`}>
        <Icon className='text-3xl' />
      </span>
      <span className='text-lg text-center font-semibold mr-6'>{`Join with ${name}`}</span>
      <span></span>
    </button>
  );
};

export default LoginWith;
