import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { MarkerShowState } from '../const/enum';
import { MapBoundsContext } from './MapBoundsContext';

import type { LatLngBounds, LatLngExpression } from 'leaflet';
import type { FC, ReactNode } from 'react';

type MapBoundsProviderProps = {
  children: ReactNode;
};

const getMarkerShowState = (mapZoom: number) => {
  if (mapZoom > 16) {
    return MarkerShowState.FULL;
  }

  return mapZoom > 12 // TODO: make 14 in non-local env
    ? MarkerShowState.DOT
    : MarkerShowState.HIDDEN;
};

const MapBoundsProvider: FC<MapBoundsProviderProps> = ({ children }) => {
  const map = useMap();

  if (!map) {
    throw new Error(
      'MapBoundsProvider must be placed inside the Map component.',
    );
  }

  const [mapBounds, setMapBounds] = useState<LatLngBounds>(map.getBounds());
  const [mapZoom, setMapZoom] = useState<number>(map.getZoom());
  const markerShowState = getMarkerShowState(mapZoom);

  const setMapView = useCallback(
    (latLngExpression: LatLngExpression, zoom: number = 18) => {
      map.setView(latLngExpression, zoom);
    },
    [map],
  );

  useEffect(() => {
    async function updateBounds() {
      setMapBounds(map.getBounds());
      setMapZoom(map.getZoom());
    }

    updateBounds();

    map.on('dragend', function () {
      updateBounds();
    });

    map.on('zoomend', function () {
      updateBounds();
    });

    return () => {
      map.off('dragend');
      map.off('zoomend');
    };
  }, [map]);

  return (
    <MapBoundsContext.Provider
      value={{
        mapBounds,
        mapZoom,
        setMapView,
        markerShowState,
      }}
    >
      {children}
    </MapBoundsContext.Provider>
  );
};

export default MapBoundsProvider;
