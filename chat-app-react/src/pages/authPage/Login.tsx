import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import { VscGithub } from 'react-icons/vsc';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/Ai';

import BannerLogin from '../../assets/banner.mp4';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { login, selectAuth } from '../../features/auth/authSlice';
import { getInforUserWithOauth2 } from '../../features/auth/authSlice';
import axios from 'axios';
import { IConversation, IResponse } from '../../ultils/interface';

export interface IProp {
  className?: string;
  Icon: React.ElementType;
  name: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export const LoginWith: React.FC<IProp> = ({ className, name, Icon }) => {
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

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, status, token, isLoading } = useAppSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required field'),
    password: yup.string().min(5).required('Password is required field'),
  });
  const handleLogin = async (data: ILoginData) => {
    await dispatch(login(data));
  };

  const { errors, touched, handleBlur, handleChange, handleSubmit } = useFormik(
    {
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: loginSchema,
      onSubmit: handleLogin,
    }
  );

  useEffect(() => {
    const handleNavigate = async () => {
      if (user) {
        const res = (await axios.get(
          `http://localhost:8080/api/v1/user/conversation/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'x-client-id': user?._id,
            },
            withCredentials: true,
          }
        )) as IResponse<{ conversations: IConversation[] }>;
        if (res.data.metaData.conversations.length) {
          window.location.href = `/conversation/${res.data.metaData.conversations[0]?._id}`;
        } else {
          navigate('/');
        }
      }
    };
    if (user && status === 'idle') {
      handleNavigate();
    }
  }, [user, status, navigate]);

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
        <div className='absolute w-full h-full flex sm:flex-col items-center justify-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
          {/* <div className='relative h-[70px] w-full px-10 hidden sm:flex items-center justify-between mb-10'>
           
          </div> */}
          <div className='sm:w-[550px] w-[90%] h-[80%] mx-auto rounded-xl bg-white px-8 py-12'>
            <h1 className='sm:text-4xl text-2xl font-bold text-center'>
              Welcome back to Fasty
            </h1>
            <div className='sm:mt-12 mt-6'>
              <LoginWith
                className={'bg-btn-github'}
                name={'Github'}
                Icon={VscGithub}
              />
              <LoginWith
                className={'bg-btn-google mt-6'}
                name={'Google'}
                Icon={FcGoogle}
              />
            </div>
            <h2 className='w-full text-center text-xl my-4 text-gray-blur'>
              Or
            </h2>
            <form action='' onSubmit={handleSubmit} autoComplete='off'>
              <input
                name='email'
                className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                  errors.email && touched.email ? 'border-2 border-red-500' : ''
                }`}
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='Email'
              />
              {errors.email && touched.email && (
                <p className='text-red-500'>{errors.email}</p>
              )}
              <div className='relative sm:mt-8 mt-4'>
                <input
                  name='password'
                  className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                    errors.password && touched.password
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete='current-password'
                  placeholder='Password'
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 cursor-pointer top-1/2 -translate-y-1/2'
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className='sm:text-xl' />
                  ) : (
                    <AiOutlineEye className='sm:text-xl' />
                  )}
                </span>
              </div>
              {errors.password && touched.password && (
                <p className='text-red-500'>{errors.password}</p>
              )}
              <button
                type='submit'
                className='bg-amber-300 w-full rounded-lg  px-4 py-2  text-white text-lg sm:mt-8 mt-6'
              >
                Sign In
              </button>
              <div className='sm:flex justify-between sm:mt-8 mt-4 cursor-pointer text-sm font-light text-gray-blur '>
                <div className=''>
                  <span className='text-[#929aaa] font-light mr-3 inline cursor-pointer'>
                    Do not have account?
                  </span>
                  <Link to='/sign-up'>
                    <button className='text-[#282a37] hover:text-red-500 duration-300 font-medium'>
                      Sign Up
                    </button>
                  </Link>
                </div>
                <h4 className=''>Forget password?</h4>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`absolute ${
            isLoading ? 'flex' : 'hidden'
          } items-center justify-center w-full h-full top-0 left-0 bottom-0 right-0 bg-blackOverlay`}
        >
          <span className='loading-spinner'></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
