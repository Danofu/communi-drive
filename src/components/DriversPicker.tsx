import { Picker, PickerProps } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Unsubscribe } from 'firebase/database';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { z as zod } from 'zod';

import HeaderSignOutButton from '@Components/SignOut/HeaderSignOutButton';
import { UserData, userDataSchema } from '@Providers/AuthProvider';
import { Listener, onDrivers } from '@Utils/firebase/firebase-database';
import parseSnapshot from '@Utils/parseSnapshot';
import { StackParamList } from 'App';

const driversSchema = zod.record(zod.string(), userDataSchema);

type Props = { onValueChange?: PickerProps['onValueChange']; value?: PickerProps['selectedValue'] };

export default function DriversPicker({ onValueChange, value }: Props) {
  const [fetchedDrivers, setFetchedDrivers] = useState<UserData[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'ManageRoutes'>>();

  const [, setUnsubscribe] = useState<Unsubscribe | null>(null);

  const driversListener = useCallback<Listener>(async (snapshot) => {
    try {
      const drivers = parseSnapshot(snapshot, driversSchema) || {};
      setFetchedDrivers(Object.values(drivers));
    } catch (err) {
      console.error('[ DriversPicker(driversListener) ]', err);
    }
  }, []);

  const pickerVisibleHandler = () => {
    const unsubscribe = onDrivers(driversListener);

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
      <Picker mode="dropdown" onValueChange={onValueChange} selectedValue={value}>
        <Picker.Item label="No driver selected" value="" />
        {fetchedDrivers.map((driver) => (
          <Picker.Item key={driver.uid} label={driver.fullName} value={driver.uid} />
        ))}
      </Picker>
    </View>
  );
}
