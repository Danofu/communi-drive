import { FIREBASE_WEB_API_KEY } from '@env';
import { FirebaseOptions, initializeApp } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_WEB_API_KEY,
  appId: '1:944098832234:web:054e52c543733d5fa6bf13',
  authDomain: 'communidrive.firebaseapp.com',
  databaseURL: 'https://communidrive-default-rtdb.europe-west1.firebasedatabase.app',
  messagingSenderId: '944098832234',
  projectId: 'communidrive',
  storageBucket: 'communidrive.appspot.com',
};

export default initializeApp(firebaseConfig);
