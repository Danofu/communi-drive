import { FIREBASE_WEB_API_KEY } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Provider as PaperProvider } from 'react-native-paper';

import Authorization from '@Screens/Authorization';

const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_WEB_API_KEY,
  appId: '1:944098832234:web:054e52c543733d5fa6bf13',
  authDomain: 'communidrive.firebaseapp.com',
  databaseURL: 'https://communidrive-default-rtdb.europe-west1.firebasedatabase.app',
  messagingSenderId: '944098832234',
  projectId: 'communidrive',
  storageBucket: 'communidrive.appspot.com',
};

export const firebaseApp = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={Authorization} name="Authorization" options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
