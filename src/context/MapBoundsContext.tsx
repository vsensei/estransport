import { createContext, useContext } from 'react';

import type { LatLngBounds } from 'leaflet';

export type MapBoundsContextType = {
  mapBounds: LatLngBounds;
};

export const MapBoundsContext = createContext<MapBoundsContextType | null>(
  null
);

export const useMapBoundsContext = () => {
  return useContext(MapBoundsContext) as MapBoundsContextType;
};
