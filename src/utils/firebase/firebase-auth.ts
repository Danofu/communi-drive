import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import firebaseApp from '@Utils/firebase/firebase-app';

export const auth = getAuth(firebaseApp);

export const signInLocal = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
