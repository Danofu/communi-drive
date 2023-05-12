import { UnavailabilityError } from 'expo-modules-core/src/errors/UnavailabilityError';
import * as SecureStore from 'expo-secure-store';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { z as zod, ZodError } from 'zod';

import { auth } from '@Utils/firebase/firebase-auth';
import { getUserData } from '@Utils/firebase/firebase-database';

export const userDataSchema = zod.object({ fullName: zod.string(), role: zod.enum(['dispatcher', 'driver']) });
export type UserData = zod.infer<typeof userDataSchema>;

const credentialSchema = zod.object({ email: zod.string(), password: zod.string() });
type Credential = zod.infer<typeof credentialSchema>;

type GetUserError = Error | ZodError<UserData>;
type GetUserResult = [UserData | null, undefined] | [undefined, GetUserError];
type GetUser = (credential: UserCredential) => Promise<GetUserResult>;

type SignInError = Error | FirebaseError | GetUserError | UnavailabilityError;
type SignInResult = [{ credential: UserCredential; user: UserData | null }, undefined] | [undefined, SignInError];
type SignIn = (email: string, password: string, saveLocally?: boolean) => Promise<SignInResult>;

type AuthContextType = {
  checkLocalUser: () => Promise<void>;
  isAuthorized: boolean;
  localUserChecked: boolean;
  signIn: SignIn;
  signOut: () => Promise<void>;
  user: UserData | null;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [localUserChecked, setLocalUserChecked] = useState(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const isAuthorized = !!userCredential;

  const getUser = useCallback<GetUser>(async (credential) => {
    try {
      const snapshot = await getUserData(credential.user.uid);
      if (!snapshot.exists()) {
        return [null, undefined];
      }

      const data = userDataSchema.parse(snapshot.val());
      return [data, undefined];
    } catch (err) {
      return [undefined, err as GetUserError];
    }
  }, []);

  const signIn = useCallback<SignIn>(async (email, password, saveLocally = false) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUserCredential(credential);

      if (saveLocally) {
        await SecureStore.setItemAsync('user.credential', JSON.stringify({ email, password }));
      }

      const [data, error] = await getUser(credential);
      if (error) {
        return [undefined, error];
      }

      setUserData(data);
      return [{ credential, user: data }, undefined];
    } catch (err) {
      return [undefined, err as SignInError];
    }
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    await SecureStore.deleteItemAsync('user.credential');
    setUserData(null);
    setUserCredential(null);
  }, []);

  const checkLocalUser = useCallback(async () => {
    if (localUserChecked) {
      return;
    }

    try {
      const storedCredential = await SecureStore.getItemAsync('user.credential');
      if (!storedCredential) {
        return;
      }

      const { email, password }: Credential = credentialSchema.parse(JSON.parse(storedCredential));
      await signIn(email, password);
    } catch (err) {
      console.error('[ AuthProvider(checkLocalUser) ]', err);
    } finally {
      setLocalUserChecked(true);
    }
  }, [localUserChecked]);

  const value = useMemo<AuthContextType>(
    () => ({ checkLocalUser, isAuthorized, localUserChecked, signIn, signOut, user: userData }),
    [checkLocalUser, isAuthorized, localUserChecked, userData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
