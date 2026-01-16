import { colorMap } from '../const';

import type { CSSProperties } from 'react';
import type { TransitType } from '../types';
import type { Location, Station, Stop } from '../types/data';

export const getDepartureTime = (
  departureDateUnix: number,
  departureSecondsSinceMidnight: number
): number => {
  const departureMoment = new Date(
    (departureDateUnix + departureSecondsSinceMidnight) * 1000
  );
  const intervalMs = departureMoment.getTime() - new Date().getTime();
  return Math.floor(intervalMs / 60000);
};

export const isStopType = (location: Location): location is Stop =>
  location.properties.layer === 'stop';

export const isStationType = (location: Location): location is Station =>
  location.properties.layer === 'station';

const transitTypeIsValid = (transitType: string): transitType is TransitType =>
  transitType in colorMap;

export const getColorByTransitType = (
  transitType: string | null
): CSSProperties['color'] =>
  transitType && transitTypeIsValid(transitType)
    ? colorMap[transitType]
    : '#000000';

// TODO: Remove after popup data unification
export const getColor = (location: Location): CSSProperties['color'] => {
  return getColorByTransitType(
    (isStopType(location) && location.properties.addendum.GTFS.modes[0]) || null
  );
};
