import { createContext } from 'react';
import { IUser } from '../interface';

type AuthContextType = {
  user: IUser | null;
  updateAuthUser: (data: IUser | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  updateAuthUser: () => {},
  user: null,
});
