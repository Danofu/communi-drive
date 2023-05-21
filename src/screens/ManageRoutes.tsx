import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import moment from 'moment';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import DatePicker from '@Components/DatePicker';
import DriverPicker from '@Components/DriverPicker';
import RoutesList from '@Components/RoutesList';
import SectionCard from '@Components/UI/SectionCard';

export default function ManageRoutes() {
  const [selectedDriver, setSelectedDriver] = useState<ItemValue>('');
  const [selectedDate, setSelectedDate] = useState(moment());

  return (
    <View style={styles.root}>
      <SectionCard>
        <Text style={styles.driverPickerLabel} variant="titleMedium">
          Please select a driver to whom to assign the route
        </Text>
        <DriverPicker onValueChange={setSelectedDriver} value={selectedDriver} />
      </SectionCard>
      {selectedDriver && (
        <SectionCard style={styles.routesContainer}>
          <View style={styles.datePickerContainer}>
            <Text variant="titleMedium">Choose a date:</Text>
            <DatePicker onChange={setSelectedDate} style={styles.datePicker} value={selectedDate} />
          </View>
          <RoutesList data={[]} />
          <Button mode="contained">ADD ROUTE</Button>
        </SectionCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  driverPickerLabel: {
    textAlign: 'left',
  },
  root: {
    flex: 1,
    gap: 10,
    paddingVertical: 20,
  },
  routesContainer: {
    flex: 1,
    gap: 10,
  },
});
