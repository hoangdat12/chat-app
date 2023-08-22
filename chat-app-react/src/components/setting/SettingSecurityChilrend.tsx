import { useContext, useEffect, useState } from 'react';
import InputDefault from '../input/InputDefault';
import Button from '../button/Button';
import Confirm from '../modal/Confirm';
import { IDataChangePassword } from '../../ultils/interface';
import { authService } from '../../features/auth/authService';
import { OtpType } from '../../ultils/constant';
import { ILoginData } from '../../pages/authPage/Login';
import { getUserLocalStorageItem } from '../../ultils';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../button/LoadingScreen';
import { AuthContext } from '../../ultils/context/Auth';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

export const ConfirmChangeEmail = () => {
  const [isValid, setIsValid] = useState(false);
  const [showModelConfirm, setShowModelConfirm] = useState('');

  const dispatch = useAppDispatch();

  const handleConfirmChangeEmail = async () => {
    const res = await authService.verifyEmail(OtpType.EMAIL);
    if (res.status === 200) {
      setIsValid(true);
    } else {
      dispatch(setIsError());
    }
  };

  return isValid ? (
    <div className='p-2 text-gray-500 text-sm'>
      <h1>
        We have sent an email to change your email, please follow to change!
      </h1>
    </div>
  ) : (
    <div className='flex flex-col gap-3 w-full mt-2'>
      <div className='py-2'>
        <h1 className='text-gray-500 px-4'>
          If you want change Email, please click 'Change'. We have sent an email
          to verify your email
        </h1>
      </div>
      <div className='flex justify-end'>
        <Button
          text='Change'
          border={'border-none'}
          hover={'hover:bg-blue-500 hover:text-white duration-300'}
          background={'bg-blue-500'}
          color={'text-white'}
          onClick={() => setShowModelConfirm('true')}
        />
      </div>
      {showModelConfirm !== '' && (
        <Confirm
          title={'You want change Email?'}
          handleSave={handleConfirmChangeEmail}
          isShow={showModelConfirm}
          setIsShow={setShowModelConfirm}
          textBtn={'Change'}
        />
      )}
    </div>
  );
};

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');

  const dispatch = useAppDispatch();

  const handleChangePassword = async () => {
    const condition =
      currentPassword !== '' &&
      newPassword !== '' &&
      rePassword !== '' &&
      newPassword === rePassword &&
      currentPassword !== newPassword;

    if (condition) {
      // Call api
      const data: IDataChangePassword = {
        olderPassword: currentPassword,
        newPassword,
        rePassword,
      };
      const res = await authService.changePassword(data);
      if (res.status === 200) {
        setIsValid(true);
      } else {
        setInvalidMessage('Have some error, please try again!');
        dispatch(setIsError());
      }
    } else {
      setIsValid(false);
      setInvalidMessage('Re-password not match');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (invalidMessage !== '') {
      timer = setTimeout(() => {
        setInvalidMessage('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [invalidMessage]);

  return isValid ? (
    <div className='p-2 text-gray-500 text-sm'>
      <h1>Change password successfully!</h1>
    </div>
  ) : (
    <div className='flex flex-col gap-3 w-full mt-2'>
      <InputDefault
        value={currentPassword}
        changeValue={setCurrentPassword}
        placeHolder='Enter current password...'
      />
      <InputDefault
        value={newPassword}
        changeValue={setNewPassword}
        placeHolder='Enter new password...'
        className={`${invalidMessage !== '' && 'border-red-500'}`}
      />
      <div>
        <InputDefault
          value={rePassword}
          changeValue={setRePassword}
          placeHolder='Enter new password again...'
          className={`${invalidMessage !== '' && 'border-red-500'}`}
        />
        {invalidMessage !== '' && (
          <p className='text-sm text-red-500 px-2 mt-1'>{invalidMessage}</p>
        )}
      </div>
      <div className='flex justify-end'>
        <Button
          text='Change'
          border={'border-none'}
          hover={'hover:bg-blue-500 hover:text-white duration-300'}
          background={'bg-blue-500'}
          color={'text-white'}
          onClick={handleChangePassword}
        />
      </div>
    </div>
  );
};

export const LockAccount = () => {
  const [confirmLockAccount, setConfirmLockAccount] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [invalidMessage, setInvalidMessasge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLockedAccount = async () => {
    if (passwordValue !== '') {
      setIsLoading(true);
      const userLocal = getUserLocalStorageItem();

      const data: ILoginData = {
        email: userLocal.email,
        password: passwordValue,
      };
      const res = await authService.lockedAccount(data);
      if (res.status === 200 || res.status === 201) {
        setIsValid(true);
        setInvalidMessasge('');
        // Logout
        await authService.logout(updateAuthUser);
        setIsLoading(false);
        navigate('/login');
      } else {
        setIsValid(false);
        setInvalidMessasge('Wrong password!');
        dispatch(setIsError());
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (invalidMessage !== '') {
      timer = setTimeout(() => {
        setInvalidMessasge('');
      }, 3000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [invalidMessage]);

  return (
    <div className='mt-6'>
      {confirmLockAccount ? (
        <div className='flex flex-col items-center justify-center border py-6 rounded-lg'>
          <div className='w-4/5'>
            <InputDefault
              value={passwordValue}
              changeValue={setPasswordValue}
              placeHolder='Enter current password...'
              className={`${isValid && 'hidden'} ${
                invalidMessage !== '' && 'border-red-500'
              }`}
            />
            {invalidMessage !== '' && (
              <p className='px-2 mt-1 text-red-500 text-xs'>{invalidMessage}</p>
            )}
          </div>
          <div className='flex justify-end w-4/5 text-gray-500 text-xs mt-2'>
            Enter current password to Lock Account
          </div>
          <div className='flex gap-2 w-4/5 justify-end mt-4'>
            <Button
              text={'Locked Account'}
              border={'border-none'}
              background={'bg-blue-500'}
              color={'text-white'}
              hover={'hover:bg-blue-600 duration-300'}
              onClick={handleLockedAccount}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className='px-4 text-gray-500 text-sm'>
            Your account will be locked until you login again. No one can find
            your profile, please think for sure before locking your account
          </p>
          <div className='flex justify-end mt-4'>
            <Button
              text={'Lock Account'}
              border={'border-none'}
              background={'bg-red-500'}
              color={'text-white'}
              hover={'hover:bg-red-700 duration-300'}
              onClick={() => setConfirmLockAccount(true)}
            />
          </div>
        </div>
      )}
      {isLoading && <LoadingScreen />}
    </div>
  );
};
