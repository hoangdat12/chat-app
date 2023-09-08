import { Route, Routes } from 'react-router-dom';
import HelpForm from '../../components/help/HelpForm';
import CreateHelpSuccess from '../../components/help/CreateHelpSuccess';
import Layout from '../../components/layout/Layout';

const Help = () => {
  return (
    <Layout>
      <div className='flex items-center justify-center h-screen overflow-scroll md:overflow-auto'>
        <div className='grid grid-cols-2 px-6 sm:px-8 md:px-10 h-full mt-6 md:mt-0 md:h-auto lg:w-4/5 2xl:w-[60%]'>
          <div className='md:col-span-1 col-span-2'>
            <div>
              <h1 className='font-bold text-[50px]'>Let's get you</h1>
              <h1 className='font-bold text-[50px]'>some help!</h1>
            </div>
            <h6 className='text-[#716f6f]'>
              Have any issue? Send us an{' '}
              <span className='underline'>email.</span>
            </h6>
            <div className='w-full sm:w-[500px]'>
              <img
                src='https://i.ibb.co/bWfN3Qy/undraw-onboarding-o8mv-1.png'
                alt='undraw-onboarding-o8mv-1'
                className='w-full h-full'
              />
            </div>
          </div>

          <div className='md:col-span-1 col-span-2'>
            <Routes>
              <Route path='/' element={<HelpForm />} />
              <Route path='/success' element={<CreateHelpSuccess />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
