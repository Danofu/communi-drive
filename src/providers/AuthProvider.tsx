import { UnavailabilityError } from 'expo-modules-core/src/errors/UnavailabilityError';
import * as SecureStore from 'expo-secure-store';
import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

import { signInLocal } from '@Utils/firebase/firebase-auth';
import { onUserData, UserDataListener } from '@Utils/firebase/firebase-database';

const userCredentialSchema = z.object({ email: z.string(), password: z.string() });
export const userDataSchema = z.object({ fullName: z.string(), role: z.enum(['dispatcher', 'driver']) });
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type SignInUserResult = [UserCredential, undefined] | [undefined, Error | FirebaseError | UnavailabilityError];
type AuthContextType = {
  credential?: UserCredential;
  isAuthorized: boolean;
  isFetchingLocalUser: boolean;
  signInUser: (
    email: string,
    password: string,
    safeLocally?: boolean,
    userDataListener?: UserDataListener
  ) => Promise<SignInUserResult>;
  user?: UserData;
};
export type UserData = z.infer<typeof userDataSchema>;

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isFetchingLocalUser, setIsFetchingLocalUser] = useState(true);
  const [userCredential, setUserCredential] = useState<UserCredential>();
  const [userData, setUserData] = useState<UserData>();

  const isAuthorized = !!userCredential;

  const userDataListener: UserDataListener = (snapshot) => {
    try {
      const data = userDataSchema.parse(snapshot.val());
      setUserData(data);
    } catch (err) {
      console.error('[ AuthProvider(userDataListener) ]', err);
    } finally {
      setIsFetchingLocalUser(false);
    }
  };

  const signInUser = useCallback(
    async (
      email: string,
      password: string,
      saveLocally = false,
      listener?: UserDataListener
    ): Promise<SignInUserResult> => {
      try {
        const credential = await signInLocal(email, password);

        if (saveLocally) {
          await SecureStore.setItemAsync('user.credential', JSON.stringify({ email, password }));
        }

        listener && onUserData(credential.user.uid, listener);
        setUserCredential(credential);

        return [credential, undefined];
      } catch (err) {
        console.error('[ AuthProvider(signInUser) ]', err);
        return [undefined, err as Error | FirebaseError | UnavailabilityError];
      }
    },
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const serializedCredential = await SecureStore.getItemAsync('user.credential');
        if (!serializedCredential) {
          setIsFetchingLocalUser(false);
          return;
        }

        const { email, password } = userCredentialSchema.parse(JSON.parse(serializedCredential));
        const [, error] = await signInUser(email, password, false, userDataListener);
        error && setIsFetchingLocalUser(false);
      } catch (err) {
        console.error('[ AuthProvider|useEffect| ]', err);
        setIsFetchingLocalUser(false);
      }
    })();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ credential: userCredential, isAuthorized, isFetchingLocalUser, signInUser, user: userData }),
    [userCredential, isAuthorized, isFetchingLocalUser, userData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
