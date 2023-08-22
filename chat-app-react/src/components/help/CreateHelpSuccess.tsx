import { useNavigate } from 'react-router-dom';
import Button from '../button/Button';

const CreateHelpSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-medium'>
        Your problem has been recognized, we will reply as soon as it is
        resolved
      </h1>
      <Button
        text='Back to home'
        className='bg-blue-500 text-white border-none w-full mt-6'
        textSize='text-lg'
        onClick={() => navigate('/')}
      />
    </div>
  );
};

export default CreateHelpSuccess;
