import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === '1');
  }, []);
  const unlockAdmin = (secret: string) => {
    const savedSecret = localStorage.getItem('adminSecret') || "xinhadmin";
    if (secret === savedSecret) {
      localStorage.setItem('isAdmin', '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };
  return <AuthContext.Provider value={{ isAdmin, unlockAdmin, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);