import { useEffect, useState } from 'react';
import InputDefault from '../input/InputDefault';
import { ButtonLogin } from '../../pages/authPage/Login';
import { authService } from '../../features/auth/authService';
import { IDataGetPassword } from '../../ultils/interface';
import LoadingScreen from '../button/LoadingScreen';

const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (): Promise<void> => {
    if (isValid) {
      setIsLoading(true);
      const data: IDataGetPassword = {
        newPassword,
        rePassword,
      };
      const res = await authService.getPassword(data);
      if (res.status === 200 || res.status === 201) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const conditon =
      newPassword === '' || rePassword === '' || newPassword !== rePassword;
    if (!conditon) {
      setIsValid(true);
    }
  }, [newPassword, rePassword]);

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
            <h1 className='text-center text-xl text-[#b9d7d3] font-medium mb-4'>
              Change password successfully
            </h1>
            <ButtonLogin
              onClick={isValid ? handleChangePassword : undefined}
              text={'Back to Login'}
            />
          </>
        ) : (
          <div className='flex flex-col gap-4 mt-8'>
            <h1 className='text-center text-xl text-[#b9d7d3] font-medium mb-4'>
              Enter new password
            </h1>
            <InputDefault
              value={newPassword}
              changeValue={setNewPassword}
              placeHolder='Enter new password...'
              className='px-4 py-3'
            />
            <InputDefault
              value={rePassword}
              changeValue={setRePassword}
              placeHolder='Enter new password again...'
              className='px-4 py-3'
            />
            <ButtonLogin
              onClick={isValid ? handleChangePassword : undefined}
              text={'Change'}
              className={`${!isValid && 'opacity-70 cursor-not-allowed'} mt-3`}
            />
          </div>
        )}
      </div>
      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default ChangePasswordForm;
