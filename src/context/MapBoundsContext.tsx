import { createContext, useContext } from 'react';
import { MarkerShowState } from '../const/enum';

import type { LatLngBounds, LatLngExpression } from 'leaflet';

export type MapBoundsContextType = {
  mapBounds: LatLngBounds;
  mapZoom: number;
  setMapView: (latLngExpression: LatLngExpression, zoom?: number) => void;
  markerShowState: MarkerShowState;
};

export const MapBoundsContext = createContext<MapBoundsContextType | null>(
  null,
);

export const useMapBoundsContext = () => {
  return useContext(MapBoundsContext) as MapBoundsContextType;
};
