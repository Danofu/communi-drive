import { Moment } from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { z as zod } from 'zod';

import PlacesItem from '@Components/Places/PlacesItem';
import { Listener, onPlaces } from '@Utils/firebase/firebase-database';
import parseSnapshot from '@Utils/parseSnapshot';

const placesSchema = zod.record(zod.string(), zod.object({ lat: zod.number(), lng: zod.number(), name: zod.string() }));
type Places = zod.infer<typeof placesSchema>;
export type Place = Places[string];

type Props = { driverUid: string; date: Moment };

export default function PlacesList({ driverUid, date }: Props) {
  const [fetchedPlaces, setFetchedPlaces] = useState<Places | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const placesList = Object.entries(fetchedPlaces || {}).map(([id, place]) => ({ id, ...place }));

  const placesListener = useCallback<Listener>(async (snapshot) => {
    const places = parseSnapshot(snapshot, placesSchema);
    setFetchedPlaces(places);
    setIsFetching(false);
  }, []);

  useEffect(() => {
    setIsFetching(true);
    return onPlaces(driverUid, date, placesListener);
  }, [driverUid, date]);

  let content = (
    <FlatList
      contentContainerStyle={styles.placesItemsContainer}
      data={placesList}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => <PlacesItem {...item} />}
      style={styles.placesList}
    />
  );

  if (!placesList.length) {
    content = <Text variant="titleLarge">No places found. Try adding one.</Text>;
  }

  if (isFetching) {
    content = <ActivityIndicator animating size="large" style={styles.loading} />;
  }

  return <View style={styles.root}>{content}</View>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
  placesItemsContainer: {
    gap: 8,
    padding: 5,
  },
  placesList: {
    width: '100%',
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
