import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError } from 'firebase/app';
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { signInLocal } from '@Utils/firebase/firebase-auth';
import { UserCredential } from 'firebase/auth';

type AuthContextType = {
  isAuthorized: boolean;
  signInUser: (email: string, password: string) => Promise<FirebaseError | undefined>;
  user?: UserCredential;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();

  const isAuthorized = !!loggedInUser;

  const signInUser = async (email: string, password: string) => {
    const [user, error] = await signInLocal(email, password);
    if (error) {
      return error;
    }

    setLoggedInUser(user);
    try {
      await AsyncStorage.setItem('userCredentials', JSON.stringify(user));
    } catch (err) {
      console.error('[ AuthProvider(signInUser) ]:', err);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({ isAuthorized, signInUser, user: loggedInUser }),
    [isAuthorized, loggedInUser]
  );

  useEffect(() => {
    (async () => {
      const serializedUser = await AsyncStorage.getItem('userCredentials');
      if (serializedUser) {
        setLoggedInUser(JSON.parse(serializedUser));
      }
    })();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
