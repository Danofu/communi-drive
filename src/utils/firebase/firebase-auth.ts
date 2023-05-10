import { getAuth } from 'firebase/auth';

import firebaseApp from '@Utils/firebase/firebase-app';

export const auth = getAuth(firebaseApp);
