import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps, useContext } from 'react';
import { LatLng } from 'react-native-maps';
import { Provider as PaperProvider } from 'react-native-paper';

import HeaderSignOutButton from '@Components/SignOut/HeaderSignOutButton';
import AuthProvider, { AuthContext } from '@Providers/AuthProvider';
import Authorization from '@Screens/Authorization';
import DriverMap from '@Screens/DriverMap';
import ManageRoutes from '@Screens/ManageRoutes';
import SelectPlace from '@Screens/SelectPlace';

SplashScreen.preventAutoHideAsync();

type PlaceInfo = {
  address: string;
  coords: LatLng;
  description: string;
  id?: string;
};

export type StackParamList = {
  Authorization: undefined;
  ManageRoutes: undefined;
  DriverMap: undefined;
  SelectPlace:
    | { date: string; driverUid: string; place?: undefined; type: 'Add' }
    | { date: string; driverUid: string; place: PlaceInfo; type: 'Edit' };
};

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
    initialRouteName = user.role === 'dispatcher' ? 'ManageRoutes' : 'DriverMap';
  }

  const homeScreenOptions: ComponentProps<typeof Stack.Group>['screenOptions'] = ({ navigation }) => ({
    headerRight: ({ tintColor }) => <HeaderSignOutButton iconColor={tintColor} navigation={navigation} />,
  });

  return (
    <NavigationContainer onReady={navigationReadyHandler}>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen component={Authorization} name="Authorization" options={{ headerShown: false }} />
        <Stack.Group screenOptions={homeScreenOptions}>
          <Stack.Screen component={ManageRoutes} name="ManageRoutes" options={{ title: 'Routes Management' }} />
          <Stack.Screen component={DriverMap} name="DriverMap" />
        </Stack.Group>
        <Stack.Screen component={SelectPlace} name="SelectPlace" />
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
