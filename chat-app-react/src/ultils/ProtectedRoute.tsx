import { Navigate, useLocation } from 'react-router-dom';
import { getUserLocalStorageItem } from '.';
import { FC } from 'react';

const ProtectedRoutes: FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation(); // Use the useLocation hook to get the current location
  const user = getUserLocalStorageItem();

  if (user !== null) {
    return <>{children}</>;
  } else {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
};

export default ProtectedRoutes;
