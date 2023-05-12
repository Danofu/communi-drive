import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import DriverPicker from '@Components/DriverPicker';
import SectionCard from '@Components/UI/SectionCard';

export default function ManageRoutes() {
  const [selectedDriver, setSelectedDriver] = useState<ItemValue>('');

  return (
    <View style={styles.root}>
      <SectionCard>
        <Text style={styles.driverPickerLabel} variant="titleMedium">
          Please select a driver to whom to assign the route
        </Text>
        <DriverPicker onValueChange={setSelectedDriver} value={selectedDriver} />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  driverPickerLabel: {
    textAlign: 'left',
  },
  root: {
    flex: 1,
    paddingVertical: 20,
  },
});
