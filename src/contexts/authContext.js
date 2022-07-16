import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authObject, setAuthObject] = useState({
    token: null,
    id: null,
    orgID: null,
  });

  const context = { authObject, setAuthObject };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
