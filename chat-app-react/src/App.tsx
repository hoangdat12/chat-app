import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedRoutes from './ultils/ProtectedRoute';
import Login from './pages/authPage/Login';
import LoginSuccess from './pages/authPage/LoginSuccess';
import Register from './pages/authPage/Register';
import RegisterSuccess from './pages/authPage/RegisterSuccess';
import Conversation from './pages/conversation/Conversation';
import { SocketContext, socket } from './ultils/context/Socket';
import useInnerWidth from './hooks/useInnterWidth';
import Profile from './pages/profile/Profile';
import Setting from './pages/setting/Setting';
import Game from './pages/game/Game';
import ChangeAvatarGroup from './components/modal/ChangeAvatarGroup';
import CallerPage from './pages/callerPage/CallerPage';
import VideoCall from './pages/callerPage/VideoCall';
import AudioCall from './pages/callerPage/AudioCall';
import { AuthContext } from './ultils/context/Auth';
import { IUser } from './ultils/interface';
import { useState } from 'react';
import CallHidden from './components/call/VideoCallHidden';
import ManageNotification from './pages/ManageNotification';

function App() {
  const innerWitdh = useInnerWidth();
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, updateAuthUser: setUser }}>
      <SocketContext.Provider value={socket}>
        <Router>
          <Routes>
            <Route path='/login/success' element={<LoginSuccess />} />
            <Route path='/login/*' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/register/success' element={<RegisterSuccess />} />
            <Route element={<ProtectedRoutes children={<CallerPage />} />}>
              <Route path='/' element={<Home />} />
              {innerWitdh < 640 ? (
                <Route
                  path='/conversation/:conversationId/*'
                  element={<Conversation />}
                />
              ) : (
                <Route
                  path='/conversation/:conversationId'
                  element={<Conversation />}
                />
              )}
              <Route path='/profile/:userId/*' element={<Profile />} />
              <Route path='/setting/*' element={<Setting />} />
              <Route path='/game/*' element={<Game />} />
              <Route path='/crop/avatar' element={<ChangeAvatarGroup />} />
              <Route path='/call' element={<VideoCall />} />
              <Route path='/call/audio' element={<AudioCall />} />
              <Route path='/call/hidden' element={<CallHidden />} />
              <Route
                path='/notification/:userId'
                element={<ManageNotification />}
              />
            </Route>
          </Routes>
        </Router>
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
