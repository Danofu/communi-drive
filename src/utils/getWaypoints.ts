import { LatLng } from 'react-native-maps';

import { type Places } from '@Components/Places/PlacesList';
import { type Location } from '@Screens/DriverMap';

export default (origin: Location, destination: Location, places: Places): Array<LatLng> =>
  Object.values(places)
    .filter((place) => place.id !== origin.place.id && place.id !== destination.place.id)
    .map((place) => ({ latitude: place.lat, longitude: place.lng }));
