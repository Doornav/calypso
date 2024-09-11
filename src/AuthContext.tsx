import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of your context
interface AuthContextType {
  userInfo: any;
  authToken: string | null;
  setUserInfo: (user: any) => void;
  setAuthToken: (token: string) => void;
}

// Create the context with default value as null and cast it to AuthContextType or null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Log userInfo and authToken when they change
  useEffect(() => {
    if (userInfo) {
      console.log("User info updated:", JSON.stringify(userInfo, null, 2));
    }
    if (authToken) {
      console.log("Auth token updated:", authToken);
    }
  }, [userInfo, authToken]);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
