import { Dispatch, FC, SetStateAction, memo, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { getUserLocalStorageItem, getUsername } from '../../ultils';
import { userService } from '../../features/user/userService';
import { IDataChangeUserInformation } from '../../ultils/interface';

export interface IPropInformationUser {
  label: string;
  data?: string;
  isEdit: boolean;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  className?: string;
}

export interface IPropEditButton {
  handleClick: any;
}

let userLocal = getUserLocalStorageItem();

const ChangeInformation = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [firstNameValue, setFirstNameValue] = useState(userLocal.firstName);
  const [lastNameValue, setLastNameValue] = useState(userLocal.lastName);
  const [jobValue, setJobValue] = useState(userLocal.job ?? 'Student');
  const [countryValue, setCountryValue] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [streetValue, setStreetValue] = useState('');

  const handleChangeUserInformation = async () => {
    const condition1 =
      userLocal.firstName === firstNameValue.trim() &&
      userLocal.lastName === lastNameValue.trim() &&
      userLocal.job === jobValue.trim();
    // true
    const condition2 =
      firstNameValue.trim() === '' ||
      lastNameValue.trim() === '' ||
      jobValue.trim() === '';
    if (!condition1 && !condition2) {
      const data: IDataChangeUserInformation = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        job: jobValue,
      };
      const res = await userService.changeUserInformation(data);
      userLocal = res.data.metaData;
      // Call api;
    } else {
      // Handle Error
    }
    setIsEdit(false);
  };

  return (
    <div
      className={`flex flex-col gap-5 w-full h-full ${
        (isEditAddress || isEdit) && 'pb-20 md:pb-0 mb-0 md:mb-0'
      }`}
    >
      <h1 className='text-lg'>My Profile</h1>

      <div className='flex gap-4 p-4 border rounded-xl'>
        <Avatar avatarUrl={userLocal.avatarUrl} className='w-16 h-16' />
        <div>
          <h2 className='text-lg'>{getUsername(userLocal)}</h2>
          <p className='text-sm text-[#8995a7]'>{userLocal.job}</p>
          <p className='text-sm text-[#8995a7]'>{userLocal.address}</p>
        </div>
      </div>

      <div className='p-4 border rounded-xl'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-lg'>Personal Information</span>
          <EditButton handleClick={() => setIsEdit(true)} />
        </div>

        <div className='flex flex-col gap-1 md:gap-3 mt-2'>
          <div
            className={`md:grid grid-cols-2 flex flex-col ${
              isEdit ? 'gap-4' : 'gap-1'
            }`}
          >
            <InformationUserV2
              label={'Frist Name'}
              isEdit={isEdit}
              value={firstNameValue}
              setValue={setFirstNameValue}
            />
            <InformationUserV2
              label={'Last Name'}
              isEdit={isEdit}
              value={lastNameValue}
              setValue={setLastNameValue}
            />
            <InformationUserV2
              label={'Email'}
              data={userLocal.email}
              isEdit={isEdit}
            />
            <InformationUserV2
              label={'Phone'}
              data={'0334866296'}
              isEdit={isEdit}
            />
            <InformationUserV2
              label={'Job'}
              isEdit={isEdit}
              value={jobValue}
              setValue={setJobValue}
            />
          </div>
        </div>

        {isEdit && (
          <div className='flex gap-4 items-center justify-end mt-4'>
            <Button
              text='Cancel'
              border={'border-none'}
              background={'bg-gray-400'}
              color={'text-white'}
              hover={'hover:bg-gray-500 duration-300'}
              onClick={() => setIsEdit(false)}
            />
            <Button
              text='Change'
              border={'border-none'}
              background={'bg-blue-500'}
              color={'text-white'}
              hover={'hover:bg-blue-700 duration-300'}
              onClick={handleChangeUserInformation}
            />
          </div>
        )}
      </div>

      <div className='p-4 border rounded-xl'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-lg'>Address</span>
          <EditButton handleClick={() => setIsEditAddress(true)} />
        </div>

        <div className='flex flex-col gap-1 md:gap-3 mt-2'>
          <div
            className={`md:grid grid-cols-2 flex flex-col ${
              isEditAddress ? 'gap-4' : 'gap-2'
            }`}
          >
            <InformationUserV2
              label={'Country'}
              data={'Viet Nam'}
              isEdit={isEditAddress}
              value={countryValue}
              setValue={setCountryValue}
            />
            <InformationUserV2
              label={'City/State'}
              data={'Hue'}
              isEdit={isEditAddress}
              value={stateValue}
              setValue={setStateValue}
            />
            <InformationUserV2
              label={'Street Address'}
              data={'Huong ho'}
              isEdit={isEditAddress}
              value={streetValue}
              setValue={setStreetValue}
              className='md:col-span-2'
            />
          </div>
        </div>

        {isEditAddress && (
          <div className='flex gap-4 items-center justify-end mt-4'>
            <Button
              text='Cancel'
              border={'border-none'}
              background={'bg-gray-400'}
              color={'text-white'}
              hover={'hover:bg-gray-500 duration-300'}
              onClick={() => setIsEditAddress(false)}
            />
            <Button
              text='Change'
              border={'border-none'}
              background={'bg-blue-500'}
              color={'text-white'}
              hover={'hover:bg-blue-700 duration-300'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const InformationUserV2: FC<IPropInformationUser> = memo(
  ({ label, data, isEdit, value, setValue, className }) => {
    return (
      <div className={`${className} flex flex-col col-span-2 md:col-span-1`}>
        <label className='text-gray-500 text-sm' htmlFor=''>
          {label}
        </label>
        {isEdit && label !== 'Email' && label !== 'Phone' ? (
          <input
            type='text'
            value={value}
            onChange={setValue ? (e) => setValue(e.target.value) : undefined}
            className={`text-sm border px-3 py-[6px] outline-none rounded-lg w-full`}
          />
        ) : (
          <p
            className={`${
              (label === 'Email' || label === 'Phone') &&
              isEdit &&
              'px-2 py-[6px] border rounded-lg cursor-not-allowed opacity-50'
            }`}
          >
            {data ?? value}
          </p>
        )}
      </div>
    );
  }
);

export const EditButton: FC<IPropEditButton> = ({ handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className='flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-gray-100 duration-300'
    >
      <span className='cursor-pointer'>Edit</span>
      <span>
        <BsPencil />
      </span>
    </div>
  );
};

export default ChangeInformation;
