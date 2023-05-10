import { DataSnapshot, getDatabase, onValue, ref } from 'firebase/database';

import firebaseApp from '@Utils/firebase/firebase-app';

export const database = getDatabase(firebaseApp);

export type UserDataObserver = Parameters<typeof onValue>[1];

export const getUserData = (uid: string) =>
  new Promise<DataSnapshot>((resolve, reject) =>
    onValue(
      ref(database, `/users/${uid}`),
      (snapshot) => resolve(snapshot),
      (error) => reject(error),
      { onlyOnce: true }
    )
  );
