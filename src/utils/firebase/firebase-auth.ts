import { FirebaseError } from 'firebase/app';
import { UserCredential, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import firebaseApp from '@Utils/firebase/firebase-app';

const auth = getAuth(firebaseApp);

type SignInLocalResponse = [UserCredential | undefined, FirebaseError | undefined];
export const signInLocal = async (email: string, password: string): Promise<SignInLocalResponse> => {
  let error: FirebaseError | undefined;
  let response: UserCredential | undefined;

  try {
    response = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    error = err as FirebaseError;
  }

  return [response, error];
};
