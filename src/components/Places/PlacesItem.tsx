import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { Place } from '@Components/Places/PlacesList';
import elevation from '@Utils/elevation';

type Props = Place & { id: string };

export default function PlacesItem({ id, lat, lng, name }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.infoContainer}>
        <Text variant="bodyLarge">{name}</Text>
        <Text style={{ color: colors.primary }} variant="labelSmall">
          {lat}, {lng}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <Button textColor={colors.error}>Delete</Button>
        <Button textColor={colors.primary}>Edit</Button>
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
    ...elevation(2),
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
  },
});
