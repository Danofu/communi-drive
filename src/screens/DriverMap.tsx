import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PermissionStatus, getCurrentPositionAsync, getHeadingAsync, useForegroundPermissions } from 'expo-location';
import moment from 'moment';
import { useLayoutEffect, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { ToggleButtonProps } from 'react-native-paper';

import DriverMapActions from '@Components/DriverMapActions';
import DriverMapBottomSheet from '@Components/DriverMapBottomSheet';
import average from '@Utils/average';
import deltas from '@Utils/deltas';
import interpolate from '@Utils/interpolate';
import reflect from '@Utils/reflect';
import { StackParamList } from 'App';

import type { Props as DriverMapActionsProps } from '@Components/DriverMapActions';

let map: MapView | null | undefined;

const MAX_ZOOM = 17;
const MIN_ZOOM = 14;

const MAX_PITCH = 55;
const MIN_PITCH = 45;

// NOTE: The maximum speed in Europe is 130 km/h.
const MAX_SPEED = 130;
const MIN_SPEED = 0;

type Props = NativeStackScreenProps<StackParamList, 'DriverMap'>;

export default function DriverMap({ navigation }: Props) {
  const [date, setDate] = useState(moment());
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUserLocated, setIsUserLocated] = useState(false);
  const [permissionInfo, requestPermission] = useForegroundPermissions();

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

  const datePickedHandler: DriverMapActionsProps['onDatePicked'] = setDate;

  useLayoutEffect(() => {
    navigation.setOptions({ title: date.format('dddd, DD MMM YYYY') });
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <MapView
        mapPadding={{ bottom: 0, left: 0, right: 0, top: 54 }}
        onMapReady={mapReadyHandler}
        onUserLocationChange={userLocationChangeHandler}
        provider={PROVIDER_GOOGLE}
        ref={(ref) => (map = ref)}
        showsMyLocationButton
        showsUserLocation
        style={styles.map}
        toolbarEnabled={false}
      />
      <DriverMapActions
        date={date}
        isFollowing={isFollowing}
        onDatePicked={datePickedHandler}
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
