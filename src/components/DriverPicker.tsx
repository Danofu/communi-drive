import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Unsubscribe } from 'firebase/database';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { z as zod } from 'zod';

import HeaderSignOutButton from '@Components/SignOut/HeaderSignOutButton';
import { UserData, userDataSchema } from '@Providers/AuthProvider';
import { Listener, onDrivers } from '@Utils/firebase/firebase-database';
import parseSnapshot from '@Utils/parseSnapshot';
import { StackParamList } from 'App';

const driversSchema = zod.record(zod.string(), userDataSchema);

type Props = { onValueChange?: (uid: string) => void; value?: string };

export default function DriverPicker({ onValueChange, value }: Props) {
  const [fetchedDrivers, setFetchedDrivers] = useState<UserData[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList, 'ManageRoutes'>>();

  const [, setUnsubscribe] = useState<Unsubscribe | null>(null);

  const driversListener = useCallback<Listener>(async (snapshot) => {
    try {
      const drivers = parseSnapshot(snapshot, driversSchema) || {};
      setFetchedDrivers(Object.values(drivers));
    } catch (err) {
      console.error('[ DriversPicker(driversListener) ]', err);
    } finally {
      setIsFetching(false);
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

  let content = (
    <Picker mode="dropdown" onValueChange={onValueChange} selectedValue={value}>
      <Picker.Item label="No driver selected" value="" />
      {fetchedDrivers.map((driver) => (
        <Picker.Item key={driver.uid} label={driver.fullName} value={driver.uid} />
      ))}
    </Picker>
  );

  if (isFetching) {
    content = <ActivityIndicator animating style={styles.loading} />;
  }

  return (
    <View style={styles.root} onLayout={pickerVisibleHandler}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 10,
  },
  root: {
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
});
