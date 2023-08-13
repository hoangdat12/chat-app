import { Navigate } from 'react-router-dom';
import { getUserLocalStorageItem } from '.';
import { FC } from 'react';
// import { useAppSelector } from "../app/hook";

const ProtectedRoutes: FC<React.PropsWithChildren> = ({ children }) => {
  const user = getUserLocalStorageItem();
  if (user) return <>{children}</>;
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default ProtectedRoutes;
