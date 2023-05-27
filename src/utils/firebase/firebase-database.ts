import * as Crypto from 'expo-crypto';
import { DataSnapshot, getDatabase, onValue, ref, set } from 'firebase/database';
import { Moment } from 'moment';

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

export const onPlaces = (uid: string, date: Moment, listener: Listener) =>
  onValue(ref(database, `/routes/${uid}/${date.format('YYYY-MM-DD')}`), listener);

type Place = { address: string; id?: string; lat: number; lng: number };
type SetPlace = (uid: string, date: Moment, place: Place) => Promise<void>;

export const setPlace: SetPlace = async (uid, date, place) => {
  place.id = place.id || Crypto.randomUUID();
  set(ref(database, `routes/${uid}/${date.format('YYYY-MM-DD')}/${place.id}`), place);
};
