import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import DatePicker from '@Components/DatePicker';
import DriverPicker from '@Components/DriverPicker';
import PlacesList from '@Components/Places/PlacesList';
import SectionCard from '@Components/UI/SectionCard';
import { StackParamList } from 'App';

type Props = NativeStackScreenProps<StackParamList, 'ManageRoutes'>;

export default function ManageRoutes({ navigation }: Props) {
  const [pickedDate, setPickedDate] = useState(moment());
  const [selectedDriver, setSelectedDriver] = useState('');

  const datePickHandler = async (date: Moment) => {
    setPickedDate(date);
  };

  const openMapHandler = () =>
    navigation.navigate('SelectPlace', { date: pickedDate.toISOString(), driverUid: selectedDriver, type: 'Add' });

  return (
    <View style={styles.root}>
      <SectionCard>
        <Text style={styles.driverPickerLabel} variant="titleMedium">
          Please select a driver to whom to assign the route
        </Text>
        <DriverPicker onValueChange={setSelectedDriver} value={selectedDriver} />
      </SectionCard>
      {selectedDriver && (
        <SectionCard style={styles.placesContainer}>
          <View style={styles.datePickerContainer}>
            <Text variant="titleMedium">Choose a date:</Text>
            <DatePicker onChange={datePickHandler} style={styles.datePicker} value={pickedDate} />
          </View>
          <PlacesList date={pickedDate} driverUid={selectedDriver} />
          <Button mode="contained" onPress={openMapHandler}>
            ADD PLACE
          </Button>
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
    justifyContent: 'space-between',
    width: '100%',
  },
  driverPickerLabel: {
    textAlign: 'left',
  },
  placesContainer: {
    flex: 1,
    gap: 10,
  },
  root: {
    flex: 1,
    gap: 10,
    paddingVertical: 20,
  },
});
