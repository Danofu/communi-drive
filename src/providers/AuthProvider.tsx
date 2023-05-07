import { FirebaseError } from 'firebase/app';
import { createContext, PropsWithChildren, useMemo } from 'react';

import { signInLocal } from '@Utils/firebase/firebase-auth';

type AuthContextType = { signInUser: (email: string, password: string) => Promise<FirebaseError | undefined> };

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: PropsWithChildren) {
  const signInUser = async (email: string, password: string) => {
    const [user, error] = await signInLocal(email, password);
    if (error) {
      return error;
    }

    console.log('[ AuthProvider(signInUser) ]:', user);
  };

  const value = useMemo(() => ({ signInUser }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
