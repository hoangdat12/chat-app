import { FC, memo, useEffect, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import Avatar from '../avatars/Avatar';
import Button from '../button/Button';
import { getUserLocalStorageItem, getUsername } from '../../ultils';
import {
  IDataChangeUserAddress,
  IDataChangeUserInformation,
} from '../../ultils/interface';
import { profileService } from '../../features/profile/profileService';
import { IProfile } from '../../ultils/interface/profile.interface';
import Loading from '../button/Loading';
import { setIsError } from '../../features/showError';
import { useAppDispatch } from '../../app/hook';

export interface IPropInformationUser {
  label: string;
  data?: string;
  isEdit: boolean;
  value?: string;
  onChange?: any;
  className?: string;
}

export interface IPropEditButton {
  handleClick: any;
}

let userLocal = getUserLocalStorageItem();

const ChangeInformation = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [informationUser, setInformationUser] = useState({
    firstNameValue: '',
    lastNameValue: '',
    jobValue: '',
  });
  const [addressValue, setAddressValue] = useState({
    countryValue: '',
    stateValue: '',
    streetValue: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChangeUserInformation, setLoadingChangeUserInformation] =
    useState(false);
  const [loadingChangeUserAddress, setLoadingChangeUserAddress] =
    useState(false);

  const dispatch = useAppDispatch();

  const handleChangeUserInformation = async () => {
    const condition1 =
      profile?.profile_user.firstName ===
        informationUser.firstNameValue.trim() &&
      profile?.profile_user.lastName === informationUser.lastNameValue.trim() &&
      profile?.profile_job === informationUser.jobValue.trim();
    // true
    const condition2 =
      informationUser.firstNameValue.trim() === '' ||
      informationUser.lastNameValue.trim() === '' ||
      informationUser.jobValue.trim() === '';
    if (!condition1 && !condition2) {
      setLoadingChangeUserInformation(true);
      const data: IDataChangeUserInformation = {
        firstName: informationUser.firstNameValue,
        lastName: informationUser.lastNameValue,
        job: informationUser.jobValue,
      };
      const res = await profileService.changeUserInformation(data);
      if (res.status === 200 || res.status === 201) {
        setIsEdit(false);
      } else {
        dispatch(setIsError());
      }
      setLoadingChangeUserInformation(false);
      // Call api;
    } else {
      // Handle Error
    }
    setIsEdit(false);
  };

  const handleChangeAddress = async () => {
    const condition1 =
      profile?.profile_address.address_country ===
        addressValue.countryValue.trim() &&
      profile?.profile_address.address_state ===
        addressValue.stateValue.trim() &&
      profile?.profile_address.address_street ===
        addressValue.streetValue.trim();
    // true
    const condition2 =
      addressValue.countryValue.trim() === '' ||
      addressValue.stateValue.trim() === '' ||
      addressValue.streetValue.trim() === '';

    if (!condition1 && !condition2) {
      setLoadingChangeUserAddress(true);
      const data: IDataChangeUserAddress = {
        address_country: addressValue.countryValue,
        address_state: addressValue.stateValue,
        address_street: addressValue.streetValue,
      };
      const res = await profileService.changeUserAddress(data);
      if (res.status === 200 || res.status === 201) {
        setIsEditAddress(false);
      } else {
        dispatch(setIsError());
      }
      setLoadingChangeUserAddress(false);
    }
  };

  const handleCloseForm = (form: string) => {
    if (profile) {
      if (form === 'information') {
        setIsEdit(false);
        setInformationUser({
          firstNameValue: profile?.profile_user.firstName,
          lastNameValue: profile?.profile_user.lastName,
          jobValue: profile?.profile_job,
        });
      } else if (form === 'address') {
        setIsEditAddress(false);
        setAddressValue({
          countryValue: profile.profile_address.address_country,
          stateValue:
            profile.profile_address.address_state ||
            profile.profile_address.address_city,
          streetValue: profile.profile_address.address_street,
        });
      }
    }
  };

  useEffect(() => {
    const handleGetProfile = async () => {
      setIsLoading(true);
      const res = await profileService.viewProfile(userLocal._id);
      if (res.status === 200) {
        const profileDetial = res.data.metaData;
        setProfile(profileDetial);
        setInformationUser({
          firstNameValue: profileDetial.profile_user.firstName,
          lastNameValue: profileDetial?.profile_user.lastName,
          jobValue: profileDetial.profile_job,
        });
        setAddressValue({
          countryValue: profileDetial.profile_address.address_country,
          stateValue: profileDetial.profile_address.address_state,
          streetValue: profileDetial.profile_address.address_street,
        });
      } else {
        dispatch(setIsError());
      }
      setIsLoading(false);
    };

    handleGetProfile();
  }, []);

  return (
    <div
      className={`flex flex-col gap-5 w-full h-full ${
        (isEditAddress || isEdit) && 'pb-20 md:pb-0 mb-0 md:mb-0'
      }`}
    >
      <h1 className='text-lg'>My Profile</h1>

      <div className='flex gap-4 p-4 border rounded-xl'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full p-6'>
            <Loading />
          </div>
        ) : (
          <>
            <Avatar
              avatarUrl={userLocal.avatarUrl}
              className='w-16 h-16 min-h-[4rem] min-w-[4rem]'
            />
            <div>
              <h2 className='text-lg'>{getUsername(userLocal)}</h2>
              <p className='text-sm text-[#8995a7]'>
                {informationUser.jobValue}
              </p>
              <p className='text-sm text-[#8995a7]'>
                {addressValue.countryValue}
              </p>
            </div>
          </>
        )}
      </div>

      <div className='p-4 border rounded-xl'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full p-6'>
            <Loading />
          </div>
        ) : (
          <>
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
                  value={informationUser.firstNameValue}
                  onChange={(value: string) =>
                    setInformationUser({
                      ...informationUser,
                      firstNameValue: value,
                    })
                  }
                />
                <InformationUserV2
                  label={'Last Name'}
                  isEdit={isEdit}
                  value={informationUser.lastNameValue}
                  onChange={(value: string) =>
                    setInformationUser({
                      ...informationUser,
                      lastNameValue: value,
                    })
                  }
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
                  value={informationUser.jobValue}
                  onChange={(value: string) =>
                    setInformationUser({
                      ...informationUser,
                      jobValue: value,
                    })
                  }
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
                  onClick={() => handleCloseForm('information')}
                />
                {loadingChangeUserInformation ? (
                  <Loading />
                ) : (
                  <Button
                    text='Change'
                    border={'border-none'}
                    background={'bg-blue-500'}
                    color={'text-white'}
                    hover={'hover:bg-blue-700 duration-300'}
                    onClick={handleChangeUserInformation}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className='p-4 border rounded-xl'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full p-6'>
            <Loading />
          </div>
        ) : (
          <>
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
                  isEdit={isEditAddress}
                  value={addressValue.countryValue}
                  onChange={(value: string) =>
                    setAddressValue({
                      ...addressValue,
                      countryValue: value,
                    })
                  }
                />
                <InformationUserV2
                  label={'City/State'}
                  isEdit={isEditAddress}
                  value={addressValue.stateValue}
                  onChange={(value: string) =>
                    setAddressValue({
                      ...addressValue,
                      stateValue: value,
                    })
                  }
                />
                <InformationUserV2
                  label={'Street Address'}
                  isEdit={isEditAddress}
                  value={addressValue.streetValue}
                  onChange={(value: string) =>
                    setAddressValue({
                      ...addressValue,
                      streetValue: value,
                    })
                  }
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
                  onClick={() => handleCloseForm('address')}
                />
                {loadingChangeUserAddress ? (
                  <Loading />
                ) : (
                  <Button
                    text='Change'
                    border={'border-none'}
                    background={'bg-blue-500'}
                    color={'text-white'}
                    hover={'hover:bg-blue-700 duration-300'}
                    onClick={handleChangeAddress}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const InformationUserV2: FC<IPropInformationUser> = memo(
  ({ label, data, isEdit, value, onChange, className }) => {
    return (
      <div className={`${className} flex flex-col col-span-2 md:col-span-1`}>
        <label className='text-gray-500 text-sm' htmlFor=''>
          {label}
        </label>
        {isEdit && label !== 'Email' && label !== 'Phone' ? (
          <input
            type='text'
            value={value}
            onChange={
              onChange ? (e: any) => onChange(e.target.value) : undefined
            }
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
            {value ?? data}
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
