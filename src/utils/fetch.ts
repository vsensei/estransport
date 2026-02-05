import { serverBaseUrl } from '../const/env';

import type { LatLngTuple } from 'leaflet';
import type {
  ItineraryResponseData,
  LiveVehicleInfo,
  Location,
  StopInfoResponse,
  StopStationData,
} from '../types/data';

const fetchDataUnsafe = async (
  endpoint: string,
  searchParams?: URLSearchParams,
) => {
  const url = new URL(`${serverBaseUrl}/staticData/${endpoint}`);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url);
  return response.json() as unknown;
};

export const fetchLocationsByQueryName = (locationQuery: string) => {
  return fetchDataUnsafe(`autocomplete/${locationQuery}`) as Promise<
    Location[]
  >;
};

export const fetchStopDepartures = async (stopId: string) => {
  const itineraryData = (await fetchDataUnsafe(`stopInfo/${stopId}`)) as {
    data: { stop: StopInfoResponse };
  };
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
}) => {
  return fetchDataUnsafe(
    'stops',
    new URLSearchParams({
      minLat: minLat.toString(),
      minLon: minLon.toString(),
      maxLat: maxLat.toString(),
      maxLon: maxLon.toString(),
    }),
  ) as Promise<StopStationData[]>;
};

export const fetchItineraries = async ({
  from,
  to,
}: {
  from: LatLngTuple;
  to: LatLngTuple;
}) => {
  const [startLat, startLon] = from;
  const [finishLat, finishLon] = to;

  return fetchDataUnsafe(
    'itinerary',
    new URLSearchParams({
      startLat: startLat.toString(),
      startLon: startLon.toString(),
      finishLat: finishLat.toString(),
      finishLon: finishLon.toString(),
    }),
  ) as Promise<ItineraryResponseData>;
};

export const processTransportLocationsTest = (
  transportLocationsDataJSON: string,
) => JSON.parse(transportLocationsDataJSON) as LiveVehicleInfo[];
