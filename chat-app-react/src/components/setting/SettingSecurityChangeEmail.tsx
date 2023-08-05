import { useEffect, useState } from 'react';
import Button from '../button/Button';
import InputDefault from '../input/InputDefault';
import { authService } from '../../features/auth/authService';
import { getUserLocalStorageItem, isValidEmail } from '../../ultils';
import { ILoginData } from '../../pages/authPage/Login';
import InputEmail from '../input/InputEmail';

const SettingSecurityChangeEmail = () => {
  const [emailValue, setEmailValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');
  const [invalidMessagePassoword, setInvalidMessagePassword] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const confirmPassword = async () => {
    if (passwordValue !== '') {
      const userLocal = getUserLocalStorageItem();

      const data: ILoginData = {
        email: userLocal.email,
        password: passwordValue,
      };

      const res = await authService.verifyPassword(data);
      if (res.data.metaData.isValid) {
        setIsValid(true);
        setInvalidMessagePassword('');
      } else {
        setIsValid(false);
        setInvalidMessagePassword('Wrong password!');
      }
    }
  };

  const handleChangeEmail = async () => {
    if (emailValue !== '') {
      if (isValidEmail(emailValue)) {
        // Call api
        await authService.changeEmail(emailValue);
        setIsValid(true);
        setInvalidMessage('');
      } else {
        setIsValid(false);
        setInvalidMessage('Invalid Email');
      }
      setEmailValue('');
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

  return isValid ? (
    <div className='p-2 text-gray-500 text-sm'>
      <h1>Change email successfully!</h1>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center border py-6 rounded-lg'>
      <div className='w-4/5'>
        <InputDefault
          value={passwordValue}
          changeValue={setPasswordValue}
          placeHolder='Enter current password...'
          className={`${invalidMessage !== '' && 'border-red-500'}`}
        />
        {invalidMessagePassoword !== '' && (
          <p className='px-2 mt-1 text-red-500 text-xs'>
            {invalidMessagePassoword}
          </p>
        )}
        {isValid ? (
          <>
            <InputEmail
              value={emailValue}
              setValue={setEmailValue}
              placeholder={'Enter new email...'}
              className={`${!isValid && 'cursor-not-allowed opacity-50'}`}
            />
            {invalidMessage !== '' && (
              <p className='px-2 mt-1 text-red-500 text-xs'>{invalidMessage}</p>
            )}
          </>
        ) : (
          <div
            placeholder='Enter new email...'
            className={`flex items-center gap-2 text-sm border mt-3 px-4 py-2 outline-none rounded-lg w-full cursor-not-allowed opacity-50`}
          >
            <p className='opacity-50'>Enter new Email...</p>
          </div>
        )}
      </div>
      <div className='flex justify-end w-4/5 text-gray-500 text-xs mt-2'>
        {isValid
          ? 'Enter the new Email you want to change'
          : 'Enter current password to Lock Account'}
      </div>
      <div className='flex gap-2 w-4/5 justify-end mt-4'>
        <Button
          text={isValid ? 'Change' : 'Confirm'}
          border={'border-none'}
          background={'bg-blue-500'}
          color={'text-white'}
          hover={'hover:bg-blue-600 duration-300'}
          onClick={isValid ? handleChangeEmail : confirmPassword}
        />
      </div>
    </div>
  );
};

export default SettingSecurityChangeEmail;
