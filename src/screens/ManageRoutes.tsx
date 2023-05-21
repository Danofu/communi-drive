import moment, { Moment } from 'moment';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import DatePicker from '@Components/DatePicker';
import DriverPicker from '@Components/DriverPicker';
import PlacesList from '@Components/Places/PlacesList';
import SectionCard from '@Components/UI/SectionCard';

export default function ManageRoutes() {
  const [pickedDate, setPickedDate] = useState(moment());
  const [selectedDriver, setSelectedDriver] = useState('');

  const datePickHandler = async (date: Moment) => {
    setPickedDate(date);
  };

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
            <DatePicker onChange={datePickHandler} style={styles.datePicker} value={pickedDate} />
          </View>
          <PlacesList date={pickedDate} driverUid={selectedDriver} />
          <Button mode="contained">ADD PLACE</Button>
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
