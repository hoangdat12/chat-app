import { Route, Routes } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ChangeInformation from '../../components/setting/ChangeInformation';
import SettingNavbar from '../../components/setting/SettingNavbar';
import SettingSecurity from '../../components/setting/SettingSecurity';
import SettingSecurityChangeEmail from '../../components/setting/SettingSecurityChangeEmail';

const Setting = () => {
  return (
    <Layout>
      <div className='grid grid-cols-7 w-full'>
        <div className='col-span-7 py-2 bg-gray-100 md:col-span-2 md:h-[calc(100vh-76px)]'>
          <SettingNavbar />
        </div>
        <div className='col-span-7 md:col-span-5 px-6 md:px-8 py-6 md:h-[calc(100vh-76px)] overflow-y-scroll'>
          <Routes>
            <Route path='/' element={<ChangeInformation />} />
            <Route path='/security' element={<SettingSecurity />} />
            <Route
              path='/security/change-email'
              element={<SettingSecurityChangeEmail />}
            />
          </Routes>
        </div>
      </div>
    </Layout>
  );
};

export default Setting;
