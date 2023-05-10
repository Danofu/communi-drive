import { getDatabase, onValue, ref } from 'firebase/database';

import firebaseApp from '@Utils/firebase/firebase-app';

export const database = getDatabase(firebaseApp);

export type UserDataListener = Parameters<typeof onValue>[1];

export const onUserData = (uid: string, listener: UserDataListener) => {
  onValue(ref(database, `/users/${uid}`), listener, { onlyOnce: true });
};
