import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import firebaseApp from '@Utils/firebase/firebase-app';

const auth = getAuth(firebaseApp);

export const signInLocal = (email: string, password: string) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error('[ signInLocal ]:', err);
  }
};
