import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { LatLng, MapViewProps, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { reverseGeocodingByCoords, reverseGeocodingByPlaceId } from '@Utils/http/maps';
import { StackParamList } from 'App';

const { height, width } = Dimensions.get('window');

const ASPECT_RATION = width / height;
const LATITUDE_DELTA = 0.0222;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATION;

const deltas = { latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };

type Props = NativeStackScreenProps<StackParamList, 'SelectPlace'>;

export default function SelectPlace({ navigation, route }: Props) {
  let initialRegion: Region | undefined;
  const { params } = route;
  const [markerCoords, setMarkerCoords] = useState<LatLng | null | undefined>(params?.marker?.coords);
  const [markerTitle, setMarkerTitle] = useState<string | undefined>(params?.marker?.title);

  const screenVisibleHandler = () => navigation.setOptions({ title: markerTitle ? markerTitle : 'Select Place' });

  const changeMarkerCoordsHandler: MapViewProps['onPress'] = async (event) => {
    const { coordinate } = event.nativeEvent;
    const { results } = await reverseGeocodingByCoords({ ...coordinate });

    setMarkerCoords(coordinate);

    const { formatted_address } = results.at(0) || {};
    setMarkerTitle(formatted_address);
    navigation.setOptions({ title: formatted_address });
  };

  const changeMarkerToPoiCoordsHandler: MapViewProps['onPoiClick'] = async (event) => {
    const { coordinate, placeId } = event.nativeEvent;
    const { results } = await reverseGeocodingByPlaceId(placeId);

    setMarkerCoords(coordinate);

    const { formatted_address } = results.at(0) || {};
    setMarkerTitle(formatted_address);
    navigation.setOptions({ title: formatted_address });
  }

  if (params.type === 'Edit') {
    initialRegion = { ...params.marker.coords, ...deltas };
  }

  return (
    <View onLayout={screenVisibleHandler} style={styles.root}>
      <MapView
        initialRegion={initialRegion}
        onPoiClick={changeMarkerToPoiCoordsHandler}
        onPress={changeMarkerCoordsHandler}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        toolbarEnabled={false}
      >
        {markerCoords && <Marker coordinate={markerCoords} title={markerTitle} />}
      </MapView>
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
