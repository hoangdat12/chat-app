import './App.css';
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

function App() {
  const innerWitdh = useInnerWidth();
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/register/success' element={<RegisterSuccess />} />
          <Route path='/login/success' element={<LoginSuccess />} />
          <Route element={<ProtectedRoutes />}>
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
          </Route>
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
