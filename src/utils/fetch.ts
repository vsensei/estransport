import { serverBaseUrl } from '../const/envVariables';

import type { LatLngTuple } from 'leaflet';
import type {
  ItineraryResponseData,
  Location,
  StopInfoResponse,
  StopStationData,
} from '../types/data';

const fetchDataUnsafe = async (query: string) => {
  const response = await fetch(`${serverBaseUrl}/${query}`);
  const parsedResponse = await response.json();

  return parsedResponse;
};

const fetchDataWithBodyUnsafe = async (query: string, body: string) => {
  const response = await fetch(`${serverBaseUrl}/${query}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });
  const parsedResponse = await response.json();

  return parsedResponse;
};

export const fetchLocationsByQueryName = (
  locationQuery: string
): Promise<Location[]> => {
  return fetchDataUnsafe(`digitransit/autocomplete/${locationQuery}`);
};

export const fetchStopDepartures = async (stopId: string) => {
  const itineraryData: { data: { stop: StopInfoResponse } } =
    await fetchDataUnsafe(`digitransit/stopInfo/${stopId}`);
  return itineraryData.data.stop.stoptimesWithoutPatterns;
};

export const fetchPartialStops = ({
  minLat,
  minLon,
  maxLat,
  maxLon,
}: {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}): Promise<StopStationData[]> => {
  return fetchDataUnsafe(
    `digitransit/stops/${minLat}/${minLon}/${maxLat}/${maxLon}`
  );
};

export const fetchItineraries = async (itineraryCoordinates: {
  from: LatLngTuple;
  to: LatLngTuple;
}): Promise<ItineraryResponseData> => {
  return fetchDataWithBodyUnsafe(
    'digitransit/itinerary',
    JSON.stringify(itineraryCoordinates)
  );
};
