import { FIREBASE_WEB_API_KEY } from '@env';
import { LatLng } from 'react-native-maps';
import * as zod from 'zod';

type ReverseGeocodingResponse = { results: Array<{ formatted_address: string }> };
const reverseGeocodingResponseSchema: zod.ZodType<ReverseGeocodingResponse> = zod.object({
  results: zod.array(zod.object({ formatted_address: zod.string() })),
});

type ReverseGeocodingByCoords = (coords: LatLng) => Promise<ReverseGeocodingResponse>;

export const reverseGeocodingByCoords: ReverseGeocodingByCoords = async ({ latitude, longitude }) => {
  const params: URLSearchParams = new URLSearchParams();
  params.append('key', FIREBASE_WEB_API_KEY);
  params.append('latlng', `${latitude},${longitude}`);
  params.append('result_type', 'street_address');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  const response: Response = await fetch(url);
  const data: unknown = await response.json();

  return reverseGeocodingResponseSchema.parse(data);
};

type ReverseGeocodingByPlaceId = (placeId: string) => Promise<ReverseGeocodingResponse>;

export const reverseGeocodingByPlaceId: ReverseGeocodingByPlaceId = async (placeId) => {
  const params: URLSearchParams = new URLSearchParams();
  params.append('key', FIREBASE_WEB_API_KEY);
  params.append('place_id', placeId);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  const response: Response = await fetch(url);
  const data: unknown = await response.json();

  return reverseGeocodingResponseSchema.parse(data);
};
