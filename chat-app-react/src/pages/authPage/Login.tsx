import BannerLogin from '../../assets/banner.mp4';
import { useAppSelector } from '../../app/hook';
import { selectAuth } from '../../features/auth/authSlice';
import LoadingScreen from '../../components/button/LoadingScreen';
import LoginForm from '../../components/login/LoginForm';
import ForgotPasswordForm from '../../components/login/ForgotPasswordForm';
import { Route, Routes } from 'react-router-dom';
import ChangePasswordForm from '../../components/login/ChangePasswordForm';
import { FC } from 'react';

export interface ILoginData {
  email: string;
  password: string;
}

export interface IPropButtonLogin {
  onClick: any;
  text: string;
  className?: string;
}

const Login = () => {
  const { isLoading } = useAppSelector(selectAuth);

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={BannerLogin}
          loop
          muted
          controls={false}
          autoPlay
          className='w-full h-full object-cover'
        />
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route path='/forgot-password' element={<ForgotPasswordForm />} />
          <Route path='/change-password' element={<ChangePasswordForm />} />
        </Routes>
        {isLoading && <LoadingScreen />}
      </div>
    </div>
  );
};

export const ButtonLogin: FC<IPropButtonLogin> = ({
  onClick,
  className,
  text,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} bg-[#579a90] w-full rounded-lg  px-4 py-2 text-white text-lg`}
    >
      {text}
    </button>
  );
};

export const TitleLogin = () => {
  return <h1 className='text-center text-lg text-[#b9d7d3] font-medium'>{}</h1>;
};

export default Login;
