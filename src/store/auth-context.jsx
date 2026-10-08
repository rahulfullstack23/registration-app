
import { useState } from 'react';
import { AuthContext } from './auth-context.js';

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = (token) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    setToken('');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
