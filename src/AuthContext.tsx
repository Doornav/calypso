import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of your context
interface AuthContextType {
  userInfo: any;
  authToken: string | null;
  accessToken: string | null;
  setUserInfo: (user: any) => void;
  setAuthToken: (token: string) => void;
  setAccessToken: (token: string) => void;
  logoutUser: () => void;
}

// Create the context with default value as null and cast it to AuthContextType or null
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  // Log userInfo and authToken when they change
  useEffect(() => {
    if (userInfo) {
      console.log("User info updated:", JSON.stringify(userInfo, null, 2));
    }
    if (authToken) {
      console.log("Auth token updated:", authToken);
    }
    if (accessToken) {
      console.log("Access token updated:", accessToken);
    }
    if (name) {
      console.log("Name updated:", name);
    }
  }, [userInfo, authToken, accessToken, name]);

  // Function to update userInfo without overwriting the whole object
  const updateUserInfo = (newInfo: Partial<any>) => {
    setUserInfoState((prevUserInfo: any) => ({
      ...prevUserInfo,
      ...newInfo, // Merge new info into the existing userInfo
    }));
  };

  // Function to update name
  const updateName = (newName: string) => {
    setName(newName);
  };

  // Function to update access_token
  const updateAccessToken = (newToken: string) => {
    setAccessToken(newToken);
  };

  const logoutUser = () => {
    // Reset userInfo, name, accessToken, and authToken
    setUserInfoState(null);
    setAuthToken(null);
    setAccessToken(null);
    setName(null);
    
    // Perform any additional session cleanup
    console.log('User logged out, session cleared.');
  };

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo: updateUserInfo, authToken, setAuthToken, accessToken, setAccessToken: updateAccessToken, name, setName: updateName, logoutUser }}>
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
