import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import { Button, Dialog, Text, useTheme, type ButtonProps, type DialogProps } from 'react-native-paper';

import { type Place, type Places } from '@Components/Places/PlacesList';
import DialogBase from '@Components/UI/DialogBase';

export type Props = {
  onDestinationSelect?: (place: Place) => void;
  onOriginSelect?: (place: Place) => void;
  places?: Places | null;
};

export default function DriverMapMarkers({ onOriginSelect, onDestinationSelect, places = {} }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const theme = useTheme();

  const dismissHandler: DialogProps['onDismiss'] = () => setSelectedPlace(undefined);

  const originPressHandler: ButtonProps['onPress'] = () => {
    selectedPlace && onOriginSelect && onOriginSelect(selectedPlace);
    dismissHandler();
  };

  const destinationPressHandler: ButtonProps['onPress'] = () => {
    selectedPlace && onDestinationSelect && onDestinationSelect(selectedPlace);
    dismissHandler();
  };

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
          onPress={() => setSelectedPlace(place)}
          title={place.address}
        />
      ))}
      <DialogBase onDismiss={dismissHandler} visible={!!selectedPlace}>
        <Dialog.Title>{selectedPlace?.address}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">Set selected marker as ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={dismissHandler} textColor={theme.colors.secondary}>
            Cancel
          </Button>
          <Button onPress={originPressHandler}>As Origin</Button>
          <Button onPress={destinationPressHandler}>As Destination</Button>
        </Dialog.Actions>
      </DialogBase>
    </React.Fragment>
  );
}
