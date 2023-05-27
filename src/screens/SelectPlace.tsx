import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import MapView, { EdgePadding, LatLng, MapViewProps, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import PlaceSearchBar, { Props as PlaceSearchBarProps } from '@Components/PlaceSearchBar';
import ErrorSnackbar, { Props as ErrorSnackbarProps } from '@Components/UI/ErrorSnackbar';
import { geocode, reverseGeocodeByCoords, reverseGeocodeByPlaceId } from '@Utils/http/maps';
import { StackParamList } from 'App';

const { height, width } = Dimensions.get('window');

const ASPECT_RATION = width / height;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATION;

const deltas = { latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };

let map: MapView | null | undefined;
const mapPadding: EdgePadding = { bottom: 0, left: 0, right: 0, top: 70 };

type Props = NativeStackScreenProps<StackParamList, 'SelectPlace'>;

export default function SelectPlace({ navigation, route }: Props) {
  const [searchError, setSearchError] = useState('');

  let initialRegion: Region | undefined;
  const { params } = route;
  const [markerCoords, setMarkerCoords] = useState<LatLng | null | undefined>(params?.marker?.coords);
  const [markerTitle, setMarkerTitle] = useState<string | undefined>(params?.marker?.title);

  const screenVisibleHandler = () => navigation.setOptions({ title: markerTitle ? markerTitle : 'Select Place' });

  const searchErrorDismissHandler: ErrorSnackbarProps['onDismiss'] = () => setSearchError('');

  const changeMarkerCoordsHandler: MapViewProps['onPress'] = async (event) => {
    const { coordinate } = event.nativeEvent;
    const address = await reverseGeocodeByCoords({ ...coordinate });

    setMarkerCoords(coordinate);
    setMarkerTitle(address);

    navigation.setOptions({ title: address });
  };

  const changeMarkerToPoiCoordsHandler: MapViewProps['onPoiClick'] = async (event) => {
    const { coordinate, placeId } = event.nativeEvent;
    const address = await reverseGeocodeByPlaceId(placeId);

    setMarkerCoords(coordinate);
    setMarkerTitle(address);

    navigation.setOptions({ headerTitle: address });
  };

  const placeHandler: PlaceSearchBarProps['onPlaceSearch'] = async (place) => {
    const result = await geocode(place);
    if (!result) {
      setSearchError(
        "Sorry, we couldn't find any matching addresses. Please provide more specific details to refine your search and locate the desired address."
      );
      return;
    }

    Keyboard.dismiss();

    const { address, coords } = result;

    setMarkerCoords(coords);
    setMarkerTitle(address);

    navigation.setOptions({ headerTitle: address });
    map && map.animateToRegion({ ...coords, ...deltas }, 1 * 1000);
  };

  if (params.type === 'Edit') {
    initialRegion = { ...params.marker.coords, ...deltas };
  }

  return (
    <View onLayout={screenVisibleHandler} style={styles.root}>
      <MapView
        initialRegion={initialRegion}
        mapPadding={mapPadding}
        onPoiClick={changeMarkerToPoiCoordsHandler}
        onPress={changeMarkerCoordsHandler}
        provider={PROVIDER_GOOGLE}
        ref={(ref) => (map = ref)}
        style={styles.map}
        toolbarEnabled={false}
      >
        {markerCoords && <Marker coordinate={markerCoords} title={markerTitle} />}
      </MapView>
      <PlaceSearchBar onPlaceSearch={placeHandler} />
      <ErrorSnackbar onDismiss={searchErrorDismissHandler} visible={!!searchError}>
        {searchError}
      </ErrorSnackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
