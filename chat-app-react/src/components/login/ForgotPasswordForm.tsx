import { useEffect, useState } from 'react';
import InputEmail from '../input/InputEmail';
import { Link } from 'react-router-dom';
import Avatar from '../avatars/Avatar';
import { IUser } from '../../ultils/interface';
import Button from '../button/Button';
import { userService } from '../../features/user/userService';
import { getUsername, isValidEmail } from '../../ultils';
import useEnterListener from '../../hooks/useEnterEvent';
import { authService } from '../../features/auth/authService';
import { OtpType } from '../../ultils/constant';
import { ButtonLogin } from '../../pages/authPage/Login';
import LoadingScreen from '../button/LoadingScreen';

const ForgotPasswordForm = () => {
  const [emailValue, setEmailValue] = useState('');
  const [account, setAccount] = useState<IUser | null>(null);
  const [selectAccount, setSelectAccount] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindAccount = async () => {
    if (emailValue !== '') {
      if (isValidEmail(emailValue)) {
        setIsLoading(true);
        const res = await userService.findUserByEmail(emailValue);
        const user = res.data.metaData.user;
        if (user) {
          setEmailValue('');
          setAccount(user);
          setInvalidMessage('');
        } else {
          setAccount(null);
          setInvalidMessage('User not found!');
        }
        setIsLoading(false);
      } else {
        setInvalidMessage('Invalid email!');
      }
    }
  };

  const handleConfirm = async () => {
    if (account && selectAccount) {
      setIsLoading(true);
      const res = await authService.verifyEmail(
        OtpType.PASSWORD,
        account.email
      );
      if (res.status === 200 || res.status === 201) {
        setIsSuccess(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (invalidMessage !== '') {
      timer = setTimeout(() => {
        setInvalidMessage('');
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [invalidMessage]);

  useEnterListener(handleFindAccount, emailValue);

  return (
    <div className='absolute w-full h-full text-white flex sm:flex-col items-center justify-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
      <div
        className={`${
          isSuccess && 'flex flex-col justify-between'
        } sm:w-[550px] w-[90%] h-3/5 mx-auto rounded-xl backdropModel px-8 py-12`}
      >
        <h1 className='sm:text-4xl text-2xl font-bold text-center'>
          Welcome back to Fasty
        </h1>
        {isSuccess ? (
          <>
            <div className='flex items-center justify-center'>
              <h1 className='text-center text-lg text-[#b9d7d3] font-medium'>
                We have sent email to change your password, please follow to get
                your password
              </h1>
            </div>
            <Link
              to='/login'
              onClick={account ? handleConfirm : handleFindAccount}
              className='bg-[#579a90] hover:bg-[#62b4a8] duration-300 w-full rounded-lg text-center px-4 py-2 text-white text-lg sm:mt-8 mt-6'
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <div className='flex flex-col gap-4 mt-10'>
              <div className='flex items-center justify-center gap-2 w-full'>
                <h1 className='text-center text-lg text-[#b9d7d3] font-medium'>
                  {account
                    ? 'Is this your Account?'
                    : 'Enter your account email, we will send an email to verify your account'}
                </h1>
                {account && (
                  <Button
                    text={'Not my Account'}
                    hover={'hover:bg-[#448278] duration-300'}
                    onClick={() => setAccount(null)}
                  />
                )}
              </div>
              {account ? (
                <div
                  onClick={() => setSelectAccount(!selectAccount)}
                  className={`flex items-center gap-4 mt-4 w-full ${
                    selectAccount ? 'bg-[#437d73]' : 'hover:bg-[#437d73]'
                  } duration-300 px-4 py-3 rounded-lg cursor-pointer`}
                >
                  <Avatar
                    avatarUrl={account.avatarUrl}
                    className={`h-12 w-12 min-h-[3rem] min-w-[3rem] md:w-16 md:h-16 md:min-h-[4rem] md:min-w-[4rem]`}
                  />
                  <div className='font-poppins'>
                    <h1 className='text-xl'>{getUsername(account)}</h1>
                    <p className='text-[13px] text-gray-300'>
                      {account.isActive ? 'Activative' : 'InActivated'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <InputEmail
                    value={emailValue}
                    setValue={setEmailValue}
                    placeholder={'Enter new email...'}
                    className={`${
                      invalidMessage !== '' && 'border-red-500'
                    } px-4 py-3 text-black`}
                  />
                  <p className='text-xs text-red-500 px-2 mt-1'>
                    {invalidMessage}
                  </p>
                </div>
              )}
              <ButtonLogin
                onClick={account ? handleConfirm : handleFindAccount}
                text={account ? 'Confirm' : 'Submit'}
                className={'sm:mt-8 mt-6'}
              />
            </div>
            <div className='flex justify-end text-sm text-gray-blur mt-2'>
              <span className='hover:text-[#bdc7da] duration-300 mr-3 inline cursor-pointer'>
                Do not have account?
              </span>
              <Link to='/register'>
                <button className='text-white hover:text-red-500 duration-300 font-medium'>
                  Sign Up
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default ForgotPasswordForm;
