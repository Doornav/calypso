import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AccessTokenType {
  token_id: number;
  item_id: string;
  institution_name: string;
  added_at: string;
}

interface AuthContextType {
  userInfo: any;
  authToken: string | null;
  accessTokens: AccessTokenType[];
  setUserInfo: (user: any) => void;
  setAuthToken: (token: string) => void;
  setAccessTokens: (tokens: AccessTokenType[]) => void;
  logoutUser: () => void;
  name: string | null;
  setName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfoState] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [accessTokens, setAccessTokensState] = useState<AccessTokenType[]>([]);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      console.log('User info updated:', JSON.stringify(userInfo, null, 2));
    }
    if (authToken) {
      console.log('Auth token updated:', authToken);
    }
    if (accessTokens.length > 0) {
      console.log('Access tokens updated:', accessTokens);
    }
    if (name) {
      console.log('Name updated:', name);
    }
  }, [userInfo, authToken, accessTokens, name]);

  const updateUserInfo = (newInfo: Partial<any>) => {
    setUserInfoState((prevUserInfo: any) => ({
      ...prevUserInfo,
      ...newInfo,
    }));
  };

  const updateName = (newName: string) => {
    setName(newName);
  };

  const updateAccessTokens = (newTokens: AccessTokenType[]) => {
    setAccessTokensState(newTokens);
  };

  const logoutUser = () => {
    setUserInfoState(null);
    setAuthToken(null);
    setAccessTokensState([]);
    setName(null);
    console.log('User logged out, session cleared.');
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo: updateUserInfo,
        authToken,
        setAuthToken,
        accessTokens,
        setAccessTokens: updateAccessTokens,
        name,
        setName: updateName,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
