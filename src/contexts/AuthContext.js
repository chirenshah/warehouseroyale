import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('warehouse_user')
      ? JSON.parse(localStorage.getItem('warehouse_user'))
      : null
  );

  const updateUser = (updatedUser) => {
    localStorage.setItem('warehouse_user', JSON.stringify(updatedUser));
    setUser((prev) => updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
