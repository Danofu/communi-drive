import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Moment } from 'moment';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { Place } from '@Components/Places/PlacesList';
import elevation from '@Utils/elevation';
import { StackParamList } from 'App';

type Props = { date: Moment; driverUid: string; place: Place };

export default function PlacesItem({ date, driverUid, place }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const editPlaceHandler = () =>
    navigation.navigate('SelectPlace', {
      date: date.toISOString(),
      driverUid,
      place: {
        address: place.address,
        coords: { latitude: place.lat, longitude: place.lng },
        description: `${place.lat.toFixed(7)}, ${place.lng.toFixed(7)}`,
        id: place.id,
      },
      type: 'Edit',
    });

  return (
    <View style={styles.root}>
      <View style={styles.infoContainer}>
        <Text variant="bodyLarge">{place.address}</Text>
        <Text style={{ color: colors.primary }} variant="labelSmall">
          {place.lat.toFixed(7)}, {place.lng.toFixed(7)}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <Button textColor={colors.error}>Delete</Button>
        <Button onPress={editPlaceHandler} textColor={colors.primary}>
          Edit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  coordsContainer: {
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
  },
  root: {
    ...elevation(3),
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
  },
});
