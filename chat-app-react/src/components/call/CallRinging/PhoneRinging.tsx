import { BsFillTelephoneFill, BsTelephoneXFill } from 'react-icons/bs';
import './PhoneRinging.scss';

const PhoneRinging = () => {
  return (
    <div className='wrapper'>
      <div className=''>
        <div className='coccoc-alo-phone coccoc-alo-green coccoc-alo-show'>
          <div className='coccoc-alo-ph-circle border-[#00aff2]'></div>
          <div className='coccoc-alo-ph-circle-fill'></div>
          <div className='coccoc-alo-ph-img-circle bg-blue-500 flex items-center justify-center'>
            <span className='text-3xl text-white'>
              <BsFillTelephoneFill />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PhoneRingingCancel = () => {
  return (
    <div className='wrapper'>
      <div className=''>
        <div className='coccoc-alo-phone coccoc-alo-red coccoc-alo-show'>
          <div className='coccoc-alo-ph-circle border-red-500'></div>
          <div className='coccoc-alo-ph-circle-fill-cancel'></div>
          <div className='coccoc-alo-ph-img-circle bg-red-500 flex items-center justify-center'>
            <span className='text-3xl text-white'>
              <BsTelephoneXFill />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneRinging;
