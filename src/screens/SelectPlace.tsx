import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import { useLayoutEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import MapView, { EdgePadding, LatLng, MapViewProps, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import HeaderSavePlaceButton from '@Components/HeaderSavePlaceButton';
import PlaceSearchBar, { Props as PlaceSearchBarProps } from '@Components/PlaceSearchBar';
import ErrorSnackbar, { Props as ErrorSnackbarProps } from '@Components/UI/ErrorSnackbar';
import { setPlace } from '@Utils/firebase/firebase-database';
import { geocode, reverseGeocodeByCoords, reverseGeocodeByPlaceId } from '@Utils/http/maps';
import { StackParamList } from 'App';
import { IconButtonProps } from 'react-native-paper';

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
  const [markerCoords, setMarkerCoords] = useState<LatLng | null | undefined>(params?.place?.coords);
  const [markerTitle, setMarkerTitle] = useState<string | undefined>(params?.place?.address);

  const markerDescription = markerCoords
    ? `${markerCoords.latitude.toFixed(7)}, ${markerCoords.longitude.toFixed(7)}`
    : params.place?.description;

  const savePlaceHandler: IconButtonProps['onPress'] = () => {
    if (!markerCoords || !markerTitle) {
      setSearchError('Please select a location on the map to save it first.');
      return;
    }

    setPlace(params.driverUid, moment(params.date), {
      address: markerTitle,
      id: params.place?.id,
      lat: markerCoords.latitude,
      lng: markerCoords.longitude,
    });
    navigation.goBack();
  };

  const searchErrorDismissHandler: ErrorSnackbarProps['onDismiss'] = () => setSearchError('');

  const changeMarkerCoordsHandler: MapViewProps['onPress'] = async (event) => {
    const { coordinate } = event.nativeEvent;
    const address = await reverseGeocodeByCoords({ ...coordinate });

    setMarkerCoords(coordinate);
    setMarkerTitle(address);
  };

  const changeMarkerToPoiCoordsHandler: MapViewProps['onPoiClick'] = async (event) => {
    const { coordinate, placeId } = event.nativeEvent;
    const address = await reverseGeocodeByPlaceId(placeId);

    setMarkerCoords(coordinate);
    setMarkerTitle(address);
  };

  const placeSearchHandler: PlaceSearchBarProps['onPlaceSearch'] = async (place) => {
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
    map && map.animateToRegion({ ...coords, ...deltas }, 1000);
  };

  if (params.type === 'Edit') {
    initialRegion = { ...params.place.coords, ...deltas };
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <HeaderSavePlaceButton
          disabled={!(markerCoords && markerTitle)}
          iconColor={tintColor}
          onPress={savePlaceHandler}
        />
      ),
      title: markerTitle ? markerTitle : 'Select Place',
    });
  }, [markerCoords, markerTitle]);

  return (
    <View style={styles.root}>
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
        {markerCoords && <Marker coordinate={markerCoords} description={markerDescription} title={markerTitle} />}
      </MapView>
      <PlaceSearchBar onPlaceSearch={placeSearchHandler} />
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
