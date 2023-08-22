import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';

import { VscGithub } from 'react-icons/vsc';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/Ai';

import { useAppDispatch, useAppSelector } from '../../app/hook';
import { login, selectAuth } from '../../features/auth/authSlice';
import LoginWith from '../../components/login/LoginWith';
import { ILoginData } from '../../pages/authPage/Login';
import { AuthContext } from '../../ultils/context/Auth';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(AuthContext);

  const dispatch = useAppDispatch();

  const { status, user } = useAppSelector(selectAuth);
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
    const handleNavigate = () => {
      window.location.href = 'http://localhost:5173';
    };
    if (status === 'succeeded' && user) {
      setUser(user);
      handleNavigate();
    }
    if (status === 'failed') {
      setErrorMessage('You have entered an invalid username or password!');
    }
  }, [status]);

  useEffect(() => {
    if (errorMessage !== '') {
      let timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [errorMessage]);

  return (
    <div className='absolute w-full h-full text-white flex sm:flex-col items-center justify-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
      <div className='sm:w-[550px] w-[90%] h-[80%] mx-auto rounded-xl backdropModel px-8 py-12'>
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
        <h2 className='w-full text-center text-xl my-4 text-gray-blur'>Or</h2>
        <form action='' onSubmit={handleSubmit} autoComplete='off'>
          <input
            name='email'
            className={`w-full px-4 py-3 bg-[#f1f1f1] text-black rounded-lg outline-none ${
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
              className={`w-full px-4 py-3 bg-[#f1f1f1] text-black rounded-lg outline-none ${
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

          <div className='flex flex-col'>
            <button
              type='submit'
              className='bg-[#579a90] w-full rounded-lg  px-4 py-2  text-white text-lg sm:mt-8 mt-6'
            >
              Sign In
            </button>
            {errorMessage !== '' && (
              <div className='text-xs text-red-500'>{errorMessage}</div>
            )}
          </div>

          <div className='sm:flex justify-between w-full sm:mt-8 mt-4 cursor-pointer text-sm text-gray-blur'>
            <div className=''>
              <span className='hover:text-[#bdc7da] duration-300 mr-3 inline cursor-pointer'>
                Do not have account?
              </span>
              <Link to='/register'>
                <button className='text-white hover:text-red-500 duration-300 font-medium'>
                  Sign Up
                </button>
              </Link>
            </div>
            <Link
              to='/login/forgot-password'
              className='hover:text-[#bdc7da] duration-300'
            >
              Forget password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
