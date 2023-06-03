import React from 'react';
import { Marker } from 'react-native-maps';

import { type Places } from '@Components/Places/PlacesList';

type Props = {
  places?: Places | null;
};

export default function DriverMapMarkers({ places = {} }: Props) {
  if (!places) {
    return null;
  }

  const placesArray: Array<Places[string]> = Object.values(places);

  return (
    <React.Fragment>
      {placesArray.map((place) => (
        <Marker
          coordinate={{ latitude: place.lat, longitude: place.lng }}
          description={`${place.lat.toFixed(7)}, ${place.lng.toFixed(7)}`}
          key={place.id}
          title={place.address}
        />
      ))}
    </React.Fragment>
  );
}
