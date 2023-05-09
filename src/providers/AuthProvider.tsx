import { UnavailabilityError } from 'expo-modules-core/src/errors/UnavailabilityError';
import * as SecureStore from 'expo-secure-store';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { signInLocal } from '@Utils/firebase/firebase-auth';
import { onUserData, UserDataListener } from '@Utils/firebase/firebase-database';

const userCredentialSchema = z.object({ email: z.string(), password: z.string() });
const userDataSchema = z.object({ role: z.enum(['dispatcher', 'driver']) });
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type SignInUserResult = [UserCredential, undefined] | [undefined, Error | FirebaseError | UnavailabilityError];
type AuthContextType = {
  credential?: UserCredential;
  isAuthorized: boolean;
  isFetching: boolean;
  signInUser: (email: string, password: string) => Promise<SignInUserResult>;
  user?: UserData;
};
type UserData = z.infer<typeof userDataSchema>;

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isFetching, setIsFetching] = useState(true);
  const [userCredential, setUserCredential] = useState<UserCredential>();
  const [userData, setUserData] = useState<UserData>();

  const isAuthorized = !!userCredential;

  const userDataListener: UserDataListener = (snapshot) => {
    try {
      const data = userDataSchema.parse(snapshot.val());
      setUserData(data);
    } catch (err) {
      console.error('[ AuthProvider(userDataListener) ]', err);
    }

    setIsFetching(false);
  };

  const signInUser = useCallback(async (email: string, password: string): Promise<SignInUserResult> => {
    try {
      const credential = await signInLocal(email, password);
      await SecureStore.setItemAsync('user.credential', JSON.stringify({ email, password }));
      setUserCredential(credential);
      return [credential, undefined];
    } catch (err) {
      console.error('[ AuthProvider(signInUser) ]', err);
      const error = err as Error | FirebaseError | UnavailabilityError;
      return [undefined, error];
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
          return;
        }
      } catch (err) {
        console.error('[ AuthProvider|useEffect| ]:', err);
      }

      setIsFetching(false);
    })();
  }, []);

  useEffect(() => {
    if (userCredential) {
      const unsubscribe = onUserData(userCredential.user.uid, userDataListener);
      return () => unsubscribe();
    }
  }, [userCredential]);

  const value = useMemo<AuthContextType>(
    () => ({ credential: userCredential, isAuthorized, isFetching, signInUser, user: userData }),
    [userCredential, isAuthorized, isFetching, userData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
