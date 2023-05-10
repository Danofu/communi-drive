import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import AuthProvider, { AuthContext } from '@Providers/AuthProvider';
import Authorization from '@Screens/Authorization';
import ManageRoutes from '@Screens/ManageRoutes';
import Map from '@Screens/Map';

export type StackParamList = { Authorization: undefined; ManageRoutes: undefined; Map: undefined };

const Stack = createNativeStackNavigator<StackParamList>();

let initialRouteName: keyof StackParamList = 'Authorization';

SplashScreen.preventAutoHideAsync();

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  if (authCtx.isFetchingLocalUser) {
    return null;
  }

  const appReadyHandler = async () => SplashScreen.hideAsync();

  if (authCtx.user) {
    initialRouteName = authCtx.user.role === 'dispatcher' ? 'ManageRoutes' : 'Map';
  }

  return (
    <NavigationContainer onReady={appReadyHandler}>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen component={Authorization} name="Authorization" options={{ headerShown: false }} />
        <Stack.Screen component={Map} name="Map" />
        <Stack.Screen component={ManageRoutes} name="ManageRoutes" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </AuthProvider>
  );
}
