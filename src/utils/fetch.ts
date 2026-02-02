import { serverBaseUrl } from '../const/envVariables';

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
  return response.json();
};

export const fetchLocationsByQueryName = (
  locationQuery: string,
): Promise<Location[]> => {
  return fetchDataUnsafe(`autocomplete/${locationQuery}`);
};

export const fetchStopDepartures = async (stopId: string) => {
  const itineraryData: { data: { stop: StopInfoResponse } } =
    await fetchDataUnsafe(`stopInfo/${stopId}`);
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
    'stops',
    new URLSearchParams({
      minLat: minLat.toString(),
      minLon: minLon.toString(),
      maxLat: maxLat.toString(),
      maxLon: maxLon.toString(),
    }),
  );
};

export const fetchItineraries = async ({
  from,
  to,
}: {
  from: LatLngTuple;
  to: LatLngTuple;
}): Promise<ItineraryResponseData> => {
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
  );
};

export const processTransportLocationsTest = (
  transportLocationsDataJSON: string,
) => {
  const data = JSON.parse(transportLocationsDataJSON) as LiveVehicleInfo[];

  console.log('DATA', data);

  return data;
};
