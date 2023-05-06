import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoutes from "./ultils/ProtectedRoute";
import Login from "./pages/authPage/Login";
import LoginSuccess from "./pages/authPage/LoginSuccess";
import Register from "./pages/authPage/Register";
import RegisterSuccess from "./pages/authPage/RegisterSuccess";
import Conversation from "./pages/Conversation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/success' element={<RegisterSuccess />} />
        <Route path='/login/success' element={<LoginSuccess />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/conversation' element={<Conversation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
