import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps, useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import HeaderSignOutButton from '@Components/SignOut/HeaderSignOutButton';
import AuthProvider, { AuthContext } from '@Providers/AuthProvider';
import Authorization from '@Screens/Authorization';
import ManageRoutes from '@Screens/ManageRoutes';
import Map from '@Screens/Map';

SplashScreen.preventAutoHideAsync();

export type StackParamList = { Authorization: undefined; ManageRoutes: undefined; Map: undefined };

const Stack = createNativeStackNavigator<StackParamList>();

let initialRouteName: keyof StackParamList = 'Authorization';

const navigationReadyHandler = () => SplashScreen.hideAsync();

const Navigation = () => {
  const { checkLocalUser, localUserChecked, user } = useContext(AuthContext);

  if (!localUserChecked) {
    checkLocalUser();
    return null;
  }

  if (user) {
    initialRouteName = user.role === 'dispatcher' ? 'ManageRoutes' : 'Map';
  }

  const homeScreenOptions: ComponentProps<typeof Stack.Group>['screenOptions'] = ({ navigation }) => ({
    headerRight: ({ tintColor }) => <HeaderSignOutButton iconColor={tintColor} navigation={navigation} />,
  });

  return (
    <NavigationContainer onReady={navigationReadyHandler}>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen component={Authorization} name="Authorization" options={{ headerShown: false }} />
        <Stack.Group screenOptions={homeScreenOptions}>
          <Stack.Screen component={Map} name="Map" />
          <Stack.Screen component={ManageRoutes} name="ManageRoutes" options={{ headerTitle: 'Routes Management' }} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <AuthProvider>
        <PaperProvider>
          <Navigation />
        </PaperProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}
