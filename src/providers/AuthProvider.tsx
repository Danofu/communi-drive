import { UnavailabilityError } from 'expo-modules-core/src/errors/UnavailabilityError';
import * as SecureStore from 'expo-secure-store';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { signInLocal } from '@Utils/firebase/firebase-auth';
import { onUserData, UserDataListener } from '@Utils/firebase/firebase-database';

const userCredentialSchema = z.object({ email: z.string(), password: z.string() });
const userDataSchema = z.object({ role: z.string() });
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthContextType = {
  credential?: UserCredential;
  isAuthorized: boolean;
  signInUser: (email: string, password: string) => Promise<Error | FirebaseError | UnavailabilityError | undefined>;
  user?: UserData;
};
type UserData = z.infer<typeof userDataSchema>;

export default function AuthProvider({ children }: PropsWithChildren) {
  const [userCredential, setUserCredential] = useState<UserCredential>();
  const [userData, setUserData] = useState<UserData>();

  const isAuthorized = !!userCredential;
  console.log('[ AuthProvider ]', userData);

  const userDataListener: UserDataListener = (snapshot) => {
    try {
      const data = userDataSchema.parse(snapshot.val());
      setUserData(data);
    } catch (err) {
      console.error('[ AuthProvider(userDataListener) ]', err);
    }
  };

  const signInUser = useCallback(async (email: string, password: string) => {
    try {
      const credential = await signInLocal(email, password);
      await SecureStore.setItemAsync('user.credential', JSON.stringify({ email, password }));
      setUserCredential(credential);
    } catch (err) {
      console.error('[ AuthProvider(signInUser) ]', err);
      return err as Error | FirebaseError | UnavailabilityError;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const serializedCredential = await SecureStore.getItemAsync('user.credential');
        if (serializedCredential) {
          const { email, password } = userCredentialSchema.parse(JSON.parse(serializedCredential));
          const credential = await signInLocal(email, password);
          setUserCredential(credential);
        }
      } catch (err) {
        console.error('[ AuthProvider|useEffect| ]:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (userCredential) {
      const unsubscribe = onUserData(userCredential.user.uid, userDataListener);
      return () => unsubscribe();
    }
  }, [userCredential]);

  const value = useMemo<AuthContextType>(
    () => ({ credential: userCredential, isAuthorized, signInUser, user: userData }),
    [userCredential, isAuthorized, userData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
