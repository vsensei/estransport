import { colorMap, realtimeColorMap } from '../const';

import type { CSSProperties } from 'react';
import type { TransitType, TransportType } from '../types';
import type { Location, Station, Stop } from '../types/data';

export const getDepartureTime = (
  departureDateUnix: number,
  departureSecondsSinceMidnight: number,
): number => {
  const departureMoment = new Date(
    (departureDateUnix + departureSecondsSinceMidnight) * 1000,
  );
  const intervalMs = departureMoment.getTime() - new Date().getTime();
  return Math.floor(intervalMs / 60000);
};

export const getDepartureTimeByDateTime = (departureDateTime: Date): number => {
  const intervalMs = departureDateTime.getTime() - new Date().getTime();
  return Math.floor(intervalMs / 60000);
};

export const formatDepartureTime = (departureInterval: number): string => {
  const result = 'In ';

  if (departureInterval <= 60) {
    return result + `${departureInterval} minutes`;
  }

  const hours = Math.trunc(departureInterval / 60);
  const hoursText = `${hours} ${hours % 10 === 1 ? 'hour' : 'hours'}`;
  const minutes = departureInterval % 60;

  return `${hoursText} ${minutes} minutes`;
};

export const isStopType = (location: Location): location is Stop =>
  location.properties.layer === 'stop';

export const isStationType = (location: Location): location is Station =>
  location.properties.layer === 'station';

const transitTypeIsValid = (transitType: string): transitType is TransitType =>
  transitType in colorMap;

export const getColorByTransitType = (
  transitType: string | null,
): CSSProperties['color'] =>
  transitType && transitTypeIsValid(transitType)
    ? colorMap[transitType]
    : '#000000';

// TODO: Remove after popup data unification
export const getColor = (location: Location): CSSProperties['color'] => {
  return getColorByTransitType(
    (isStopType(location) && location.properties.addendum.GTFS.modes[0]) ||
      null,
  );
};

export const getRealtimeMarkerColor = (type: TransportType) =>
  realtimeColorMap[type];
