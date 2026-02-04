export type TransportType = 'TRAM' | 'BUS';
export type TransitType = 'WALK' | 'RAIL' | TransportType;
export type MarkerWithCoordinates = {
  lat: number;
  lon: number;
};
