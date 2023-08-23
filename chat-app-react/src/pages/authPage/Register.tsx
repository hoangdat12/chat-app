import * as yup from 'yup';
import { useFormik } from 'formik';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/Ai';
import { useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';

import poster1 from '../../assets/poster/1.png';
import poster2 from '../../assets/poster/2.png';
import poster3 from '../../assets/poster/3.png';
import poster4 from '../../assets/poster/4.png';
import { authService } from '../../features/auth/authService';

export interface IRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IRegisterDataReceived extends IRegisterData {
  rePassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState('');

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const posters = [poster1, poster2, poster3, poster4];

  const registerSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required field'),
    lastName: yup.string().required('Last Name is required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email is required field'),
    password: yup.string().min(5).required('Password is required field'),
    rePassword: yup
      .string()
      .oneOf([yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm password is a required field'),
  });

  const handleRegister = async (data: IRegisterDataReceived) => {
    const { rePassword, ...payload } = data;
    setIsLoading(true);
    const response = await authService.register(payload);
    console.log(response);
    if (response.status === 201) {
      setIsLoading(false);
      setIsError(false);
      navigate('/register/success', {
        state: { link: response.data.metaData.link },
      });
    } else {
      setIsLoading(false);
      setIsError(true);
      setMessageError('Have some error, Please try again!');
    }
  };

  const handleCopy = (event: any) => {
    event.preventDefault();
  };

  const { errors, touched, handleBlur, handleChange, handleSubmit } = useFormik(
    {
      initialValues: {
        email: '',
        password: '',
        rePassword: '',
        firstName: '',
        lastName: '',
      },
      validationSchema: registerSchema,
      onSubmit: handleRegister,
    }
  );
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative flex justify-center flex-col items-center w-full h-full bg-slate-300'>
        <div className='absolute grid grid-cols-1 md:w-[80%] lg:grid-cols-9 xl:w-[70%] w-[90%] h-[90%] mx-auto rounded-xl overflow-hidden bg-white '>
          <div className='relative hidden lg:col-span-4 lg:flex items-center justify-center bg-[#6197fc] overflow-hidden'>
            <Slider className='w-full h-[full] xl:p-10 lg:p-5' {...settings}>
              {posters.map((poster) => (
                <div
                  key={poster}
                  className='flex justify-center items-center outline-none'
                >
                  <img
                    className='w-full object-cover border-none outline-none'
                    src={poster}
                    alt=''
                  />
                </div>
              ))}
            </Slider>
            <h1 className='absolute bottom-10 bg-[#6197fc] text-white z-10 text-3xl font-bold'>
              Welcome to FASTY
            </h1>
          </div>

          <div className='col-span-5 p-5 sm:p-10'>
            <div className={`mb-8`}>
              <h1 className='text-lg text-[#929aaa] font-medium'>
                START FOR FREE
              </h1>
              <h1 className='text-black text-4xl font-bold'>
                Create New Account
              </h1>
              <div className='mt-1'>
                <span className='text-[#929aaa]'>Already A Member? </span>
                <Link
                  to='/login'
                  className='text-[#282a37] font-medium text-lg'
                >
                  Login
                </Link>
              </div>
            </div>
            <form action='' onSubmit={handleSubmit} autoComplete='off'>
              <div className='w-full flex justify-between mb-4'>
                <div className='w-[48%]'>
                  <input
                    name='firstName'
                    className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                      errors.firstName && touched.firstName
                        ? 'border-2 border-red-500'
                        : ''
                    }`}
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete='firstName'
                    placeholder='First Name'
                  />
                  {errors.firstName && touched.firstName && (
                    <p className='text-red-500 text-sm pl-2 xl:text-base'>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className='w-[48%]'>
                  <input
                    name='lastName'
                    className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                      errors.lastName && touched.lastName
                        ? 'border-2 border-red-500'
                        : ''
                    }`}
                    type='text'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete='lastName'
                    placeholder='Last Name'
                  />
                  {errors.lastName && touched.lastName && (
                    <p className='text-red-500 text-sm pl-2 xl:text-base'>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <input
                name='email'
                className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                  errors.email && touched.email ? 'border-2 border-red-500' : ''
                }`}
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete='username'
                placeholder='Email'
              />
              {errors.email && touched.email && (
                <p className='text-red-500 text-sm pl-2 xl:text-base'>
                  {errors.email}
                </p>
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
                  onCopy={handleCopy}
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

              <div className='relative sm:mt-8 mt-4'>
                <input
                  name='rePassword'
                  className={`w-full px-4 py-3 bg-[#f1f1f1] rounded-lg outline-none ${
                    errors.rePassword && touched.rePassword
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete='current-password'
                  placeholder='Confirm Password'
                  onCopy={handleCopy}
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

              {errors.rePassword && touched.rePassword && (
                <p className='text-red-500 text-sm pl-2 xl:text-base'>
                  {errors.rePassword}
                </p>
              )}
              <button
                type='submit'
                className='bg-blue-500 w-full rounded-lg  px-4 py-2  text-white text-lg sm:mt-8 mt-6'
              >
                Sign up
              </button>
              {isError && (
                <p className='text-red-500 mt-2 float-right pr-2'>
                  {messageError}
                </p>
              )}
            </form>
            <div className='mt-5 sm:mt-10 flex gap-2'>
              <input
                className=' cursor-pointer'
                type='checkbox'
                name=''
                id=''
              />
              <h1 className='text-[#929aaa] italic'>
                I agree to the app's terms and services
              </h1>
            </div>
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

export default Register;
