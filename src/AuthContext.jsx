import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState({
    user_id: null,
    status_id: null,
    currentWorkerId: null,
    project_id: null
  });


  // setUser(key, value)
  const setUser = (key, value) => {
    setUserState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const logout = () => {
    setUserState({
      user_id: null,
      status_id: null,
      currentWorkerId: null,
      project_id: null
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);