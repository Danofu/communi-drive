import { FIREBASE_WEB_API_KEY } from '@env';
import { LatLng } from 'react-native-maps';
import * as zod from 'zod';

type ReverseGeocodeData = { results: Array<{ formatted_address: string }> };
type ReverseGeocodeAddress = string;

const reverseGeocodeDataSchema: zod.ZodType<ReverseGeocodeData> = zod.object({
  results: zod.array(zod.object({ formatted_address: zod.string() })),
});

type ReverseGeocodeByCoords = (coords: LatLng) => Promise<ReverseGeocodeAddress | undefined>;

export const reverseGeocodeByCoords: ReverseGeocodeByCoords = async ({ latitude, longitude }) => {
  const params: URLSearchParams = new URLSearchParams();
  params.append('key', FIREBASE_WEB_API_KEY);
  params.append('latlng', `${latitude},${longitude}`);
  params.append('result_type', 'street_address');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  const response: Response = await fetch(url);
  const data: unknown = await response.json();
  const { results }: ReverseGeocodeData = reverseGeocodeDataSchema.parse(data);

  return results.at(0)?.formatted_address;
};

type ReverseGeocodeByPlaceId = (placeId: string) => Promise<ReverseGeocodeAddress | undefined>;

export const reverseGeocodeByPlaceId: ReverseGeocodeByPlaceId = async (placeId) => {
  const params: URLSearchParams = new URLSearchParams();
  params.append('key', FIREBASE_WEB_API_KEY);
  params.append('place_id', placeId);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  const response: Response = await fetch(url);
  const data: unknown = await response.json();
  const { results }: ReverseGeocodeData = reverseGeocodeDataSchema.parse(data);

  return results.at(0)?.formatted_address;
};

type GeocodeData = {
  results: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }>;
};
type GeocodeResult = { address: string; coords: LatLng };

const geocodeDataSchema: zod.ZodType<GeocodeData> = zod.object({
  results: zod.array(
    zod.object({
      formatted_address: zod.string(),
      geometry: zod.object({ location: zod.object({ lat: zod.number(), lng: zod.number() }) }),
    })
  ),
});

type Geocode = (place: string) => Promise<GeocodeResult | undefined>;

export const geocode: Geocode = async (address) => {
  const params: URLSearchParams = new URLSearchParams();
  params.append('key', FIREBASE_WEB_API_KEY);
  params.append('address', address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  const response: Response = await fetch(url);
  const data: unknown = await response.json();
  const { results }: GeocodeData = geocodeDataSchema.parse(data);

  const dataEntry = results.at(0);
  if (!dataEntry) {
    return;
  }

  const { formatted_address, geometry } = dataEntry;
  return { address: formatted_address, coords: { latitude: geometry.location.lat, longitude: geometry.location.lng } };
};
