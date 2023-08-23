import { Link, useLocation } from 'react-router-dom';

const RegisterSuccess = () => {
  const location = useLocation();
  console.log(location.state);
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <div className='w-3/5'>
        <h1 className='text-3xl font-medium text-center'>
          We sent you an email, please follow the email to activate your
          account, thank you very much when you use our app
        </h1>
        <div className='flex justify-center items-center mt-10 gap-2'>
          <p>Your account were actived? </p>
          <Link
            to='/login'
            className=' px-4 py-2 bg-blue-500 rounded-md text-white'
          >
            Login now
          </Link>
        </div>
        <div className='flex items-center justify-center mt-4'>
          <span className='font-bold pr-2'>Link active</span>
          <a
            href={location.state.link ?? '#'}
            target='_blank'
            className='text-blue-500'
          >
            Click here to active your account
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
