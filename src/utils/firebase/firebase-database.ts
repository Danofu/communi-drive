import { DataSnapshot, getDatabase, onValue, ref } from 'firebase/database';

import { UserRole } from '@Providers/AuthProvider';
import firebaseApp from '@Utils/firebase/firebase-app';

export const database = getDatabase(firebaseApp);

export type Listener = Parameters<typeof onValue>[1];

export const getUserRole = (uid: string) =>
  new Promise<DataSnapshot>((resolve, reject) =>
    onValue(ref(database, `/roles/${uid}`), resolve, reject, { onlyOnce: true })
  );

export const getUserData = (uid: string, role: UserRole) =>
  new Promise<DataSnapshot>((resolve, reject) =>
    onValue(ref(database, `/users/${role}/${uid}`), resolve, reject, { onlyOnce: true })
  );

export const onDrivers = (listener: Listener) => onValue(ref(database, '/users/driver'), listener);
