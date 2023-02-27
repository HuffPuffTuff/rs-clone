import { createContext, Dispatch, SetStateAction } from 'react';
import { User } from 'firebase/auth';

export interface IUserContext {
  user: User | null;
  setUser: Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

export default UserContext;
