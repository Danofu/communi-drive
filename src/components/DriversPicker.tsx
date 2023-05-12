import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Unsubscribe } from 'firebase/database';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { z as zod } from 'zod';

import HeaderSignOutButton from '@Components/SignOut/HeaderSignOutButton';
import { UserData, userDataSchema } from '@Providers/AuthProvider';
import { Listener, getUserData, onDriverIds } from '@Utils/firebase/firebase-database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from 'App';

const driverIdsSchema = zod.array(zod.string());

export type DriverData = UserData & { uid: string };

export default function DriversPicker() {
  const [, setUnsubscribe] = useState<Unsubscribe | null>(null);
  const [fetchedDrivers, setFetchedDrivers] = useState<DriverData[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'ManageRoutes'>>();

  const driversListener = useCallback<Listener>(async (idsSnapshot) => {
    if (!idsSnapshot.exists()) {
      return;
    }

    try {
      const driverIds = driverIdsSchema.parse(idsSnapshot.val());
      const drivers: DriverData[] = [];

      for await (const id of driverIds) {
        const driverSnapshot = await getUserData(id);

        if (!driverSnapshot.exists()) {
          return;
        }

        const driver = userDataSchema.parse(driverSnapshot.val());
        drivers.push({ uid: id, ...driver });
      }

      setFetchedDrivers(drivers);
    } catch (err) {
      console.error('[ DriversPicker(driversListener) ]', err);
    }
  }, []);

  const pickerVisibleHandler = () => {
    const unsubscribe = onDriverIds(driversListener);

    const signOutHandler = () => unsubscribe();

    setUnsubscribe((unsubscribePrev) => {
      if (unsubscribePrev) {
        unsubscribePrev();
      }
      return unsubscribe;
    });

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <HeaderSignOutButton iconColor={tintColor} navigation={navigation} onSignOut={signOutHandler} />
      ),
    });
  };

  return (
    <View onLayout={pickerVisibleHandler}>
      <Picker mode="dropdown" onValueChange={setSelectedDriverId} selectedValue={selectedDriverId}>
        <Picker.Item label="No driver selected" value="" />
        {fetchedDrivers.map((driver) => (
          <Picker.Item key={driver.uid} label={driver.fullName} value={driver.uid} />
        ))}
      </Picker>
    </View>
  );
}
