import { createContext, useContext } from 'react';
import { MarkerShowState } from '../const/enum';

import type { LatLngBounds, LatLngExpression } from 'leaflet';
import { MarkerWithCoordinates } from '../types';

export type MapBoundsContextType = {
  mapBounds: LatLngBounds;
  mapZoom: number;
  markerShowState: MarkerShowState;
  setMapView: (latLngExpression: LatLngExpression, zoom?: number) => void;
  filterMarkers: <T extends MarkerWithCoordinates>(
    markersWithCoordinates: T[],
  ) => T[];
};

export const MapBoundsContext = createContext<MapBoundsContextType | null>(
  null,
);

export const useMapBoundsContext = () => {
  return useContext(MapBoundsContext) as MapBoundsContextType;
};
