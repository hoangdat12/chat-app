import { Navigate, Outlet } from 'react-router-dom';
import { getUserLocalStorageItem } from '.';
// import { useAppSelector } from "../app/hook";

const ProtectedRoutes = () => {
  const user = getUserLocalStorageItem();
  return user ? <Outlet /> : <Navigate to={'/login'} />;
};

export default ProtectedRoutes;
