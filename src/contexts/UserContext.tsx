import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import {User} from '../models/UserResponse';

interface UserData {
  user?: User;
  loadUser: (user: User) => void;
  deleteUser: () => void;
}

export const UserContext = createContext<UserData>({} as UserData);

export const UserContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const loadUser = (user?: User) => setUser(user ?? undefined);
  const deleteUser = () => setUser(undefined);

  return (
    <UserContext.Provider value={{user, loadUser, deleteUser}}>
      {children}
    </UserContext.Provider>
  );
};
