import { Navigate, Outlet } from "react-router-dom";
import { IUser } from "../features/auth/authSlice";

const ProtectedRoutes = () => {
  const userJson = localStorage.getItem("user");
  const user = userJson ? (JSON.parse(userJson) as IUser) : null;
  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoutes;
