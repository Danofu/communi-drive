import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Authorization from '@Screens/Authorization';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={Authorization} name="Authorization" options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
