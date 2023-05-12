import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import DriversPicker from '@Components/DriversPicker';
import SectionCard from '@Components/UI/SectionCard';

export default function ManageRoutes() {
  return (
    <View style={styles.root}>
      <SectionCard>
        <Text style={styles.driverPickerLabel} variant="titleMedium">
          Please select a driver to whom to assign the route
        </Text>
        <DriversPicker />
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
