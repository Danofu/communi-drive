import { FIREBASE_WEB_API_KEY } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PermissionStatus, getCurrentPositionAsync, getHeadingAsync, useForegroundPermissions } from 'expo-location';
import moment from 'moment';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { LatLng, MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections, { type MapViewDirectionsProps } from 'react-native-maps-directions';
import { ToggleButtonProps, useTheme } from 'react-native-paper';

import DriverMapActions, { type Props as DriverMapActionsProps } from '@Components/DriverMapActions';
import DriverMapBottomSheet from '@Components/DriverMapBottomSheet';
import DriverMapLoadingIndicator from '@Components/DriverMapLoadingIndicator';
import DriverMapMarkers from '@Components/DriverMapMarkers';
import { placesSchema, type Places } from '@Components/Places/PlacesList';
import average from '@Utils/average';
import deltas from '@Utils/deltas';
import { auth } from '@Utils/firebase/firebase-auth';
import { onPlaces, type Listener } from '@Utils/firebase/firebase-database';
import interpolate from '@Utils/interpolate';
import parseSnapshot from '@Utils/parseSnapshot';
import reflect from '@Utils/reflect';
import { StackParamList } from 'App';

let map: MapView | null | undefined;

const MAX_ZOOM = 17;
const MIN_ZOOM = 14;

const MAX_PITCH = 55;
const MIN_PITCH = 45;

// NOTE: The maximum speed in Europe is 130 km/h.
const MAX_SPEED = 130;
const MIN_SPEED = 0;

type Props = NativeStackScreenProps<StackParamList, 'DriverMap'>;

type Location = { coords: LatLng; type: 'auto' | 'manual' };

export default function DriverMap({ navigation }: Props) {
  const [date, setDate] = useState(moment());
  const [fetchedPlaces, setFetchedPlaces] = useState<Places | null>(null);
  const [isDirecting, setIsDirecting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlacesFetching, setIsPlacesFetching] = useState(true);
  const [isUserLocated, setIsUserLocated] = useState(false);
  const [permissionInfo, requestPermission] = useForegroundPermissions();
  const theme = useTheme();

  const [destination, setDestination] = useState<Location>();
  const [isPlacesDirectionLoading, setIsPlacesDirectionLoading] = useState(false);
  const [isUserDirectionLoading, setIsUserDirectionLoading] = useState(false);
  const [origin, setOrigin] = useState<Location>();
  const [userLocation, setUserLocation] = useState<LatLng>();
  const [waypoints, setWaypoints] = useState<Array<LatLng>>([]);

  const placesListener = useCallback<Listener>((snapshot) => {
    const places = parseSnapshot(snapshot, placesSchema);
    setFetchedPlaces(places);
    setIsPlacesFetching(false);

    if (places) {
      const placesArray = Object.values(places);
      const firstPlace = placesArray.shift();
      const lastPlace = placesArray.pop();

      firstPlace &&
        setOrigin((prevOrigin) =>
          !prevOrigin || prevOrigin.type === 'auto'
            ? { coords: { latitude: firstPlace.lat, longitude: firstPlace.lng }, type: 'auto' }
            : prevOrigin
        );

      lastPlace &&
        setDestination((prevDestination) =>
          !prevDestination || prevDestination.type === 'auto'
            ? { coords: { latitude: lastPlace.lat, longitude: lastPlace.lng }, type: 'auto' }
            : prevDestination
        );

      setWaypoints(placesArray.map((place) => ({ latitude: place.lat, longitude: place.lng })));
    }
  }, []);

  const userLocationChangeHandler: MapViewProps['onUserLocationChange'] = ({ nativeEvent }) => {
    if (!map || !nativeEvent.coordinate) {
      return;
    }

    const { coordinate } = nativeEvent;
    const speed = Math.min(coordinate.speed, MAX_SPEED);

    if (!isUserLocated) {
      map.animateToRegion({ latitude: coordinate.latitude, longitude: coordinate.longitude, ...deltas(16) }, 0);
      setIsUserLocated(true);
      return;
    }

    if (isFollowing) {
      const pitch = interpolate(speed, MIN_SPEED, MAX_SPEED, MIN_PITCH, MAX_PITCH);
      const zoom = reflect(interpolate(speed, MIN_SPEED, MAX_SPEED, MIN_ZOOM, MAX_ZOOM), MIN_ZOOM, MAX_ZOOM);
      navigation.setOptions({ title: `Current speed: ${coordinate.speed.toFixed()} km/h` });

      map.animateCamera({
        center: { latitude: coordinate.latitude, longitude: coordinate.longitude },
        heading: coordinate.heading,
        pitch,
        zoom,
      });
      return;
    }
  };

  const mapReadyHandler: MapViewProps['onMapReady'] = async () => {
    if (!permissionInfo || permissionInfo.granted) {
      return;
    }

    if (permissionInfo.canAskAgain && Platform.OS !== 'ios') {
      Alert.alert(
        'Grand Location Permissions',
        'To enable location services and view your current location on the map, please grant permission.',
        [{ onPress: requestPermission }]
      );
      return;
    }

    if (permissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions',
        'To utilize location services and view your current location on the map, please navigate to your device settings and enable location permissions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { isPreferred: true, onPress: Linking.openSettings, style: 'default', text: 'Settings' },
        ]
      );
    }
  };

  const followPressHandler: ToggleButtonProps['onPress'] = async () => {
    setIsFollowing((prevIsFollowing) => !prevIsFollowing);
    if (!map) {
      return;
    }

    if (isFollowing) {
      map.setCamera({ heading: 0, pitch: 0, zoom: average(MIN_ZOOM, MAX_ZOOM) });
      navigation.setOptions({ title: date.format('dddd, DD MMM YYYY') });
    } else {
      const { coords } = await getCurrentPositionAsync();
      const { magHeading } = await getHeadingAsync();
      map.setCamera({
        center: coords,
        heading: magHeading,
        pitch: average(MIN_PITCH, MAX_PITCH),
        zoom: average(MIN_ZOOM, MAX_ZOOM),
      });
    }
  };

  const directPressHandler: ToggleButtonProps['onPress'] = async () => {
    setIsDirecting((prevIsDirecting) => !prevIsDirecting);

    if (isDirecting) {
      setUserLocation(undefined);
    } else {
      const { coords } = await getCurrentPositionAsync();
      setUserLocation(coords);
    }
  };

  const datePickedHandler: DriverMapActionsProps['onDatePicked'] = setDate;

  const userDirectionStartHandler: MapViewDirectionsProps['onStart'] = () => setIsUserDirectionLoading(true);

  const userDirectionReadyHandler: MapViewDirectionsProps['onReady'] = () => setIsUserDirectionLoading(false);

  const userDirectionErrorHandler: MapViewDirectionsProps['onError'] = () => setIsUserDirectionLoading(false);

  const placesDirectionStartHandler: MapViewDirectionsProps['onStart'] = () => setIsPlacesDirectionLoading(true);

  const placesDirectionReadyHandler: MapViewDirectionsProps['onReady'] = () => setIsPlacesDirectionLoading(false);

  const placesDirectionErrorHandler: MapViewDirectionsProps['onError'] = () => setIsPlacesDirectionLoading(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: date.format('dddd, DD MMM YYYY') });
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    setIsPlacesFetching(true);
    return onPlaces(auth.currentUser.uid, date, placesListener);
  }, [date]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <DriverMapLoadingIndicator loading={isPlacesFetching || isPlacesDirectionLoading || isUserDirectionLoading} />
      <MapView
        mapPadding={{ bottom: 60, left: 0, right: 0, top: 54 }}
        onMapReady={mapReadyHandler}
        onUserLocationChange={userLocationChangeHandler}
        provider={PROVIDER_GOOGLE}
        ref={(ref) => (map = ref)}
        showsMyLocationButton
        showsUserLocation
        style={styles.map}
        toolbarEnabled={false}
      >
        <DriverMapMarkers places={fetchedPlaces} />
        {isDirecting && (
          <MapViewDirections
            apikey={FIREBASE_WEB_API_KEY}
            destination={origin?.coords}
            onError={userDirectionErrorHandler}
            onReady={userDirectionReadyHandler}
            onStart={userDirectionStartHandler}
            origin={userLocation}
            strokeColor={theme.colors.tertiary}
            strokeWidth={6}
          />
        )}
        {isDirecting && (
          <MapViewDirections
            apikey={FIREBASE_WEB_API_KEY}
            destination={destination?.coords}
            onError={placesDirectionErrorHandler}
            onReady={placesDirectionReadyHandler}
            onStart={placesDirectionStartHandler}
            optimizeWaypoints
            origin={origin?.coords}
            splitWaypoints
            strokeColor={theme.colors.primary}
            strokeWidth={6}
            waypoints={waypoints}
          />
        )}
      </MapView>
      <DriverMapActions
        date={date}
        isDirecting={isDirecting}
        isFollowing={isFollowing}
        onDatePicked={datePickedHandler}
        onDirectToggle={directPressHandler}
        onFollowToggle={followPressHandler}
      />
      <DriverMapBottomSheet />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
  root: {
    flex: 1,
  },
});
