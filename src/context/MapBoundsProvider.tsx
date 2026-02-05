import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { MarkerShowState } from '../const/enum';
import { MapBoundsContext } from './MapBoundsContext';

import type { LatLngBounds, LatLngExpression } from 'leaflet';
import type { PropsWithChildren } from 'react';
import type { MarkerWithCoordinates } from '../types';

const getMarkerShowState = (mapZoom: number) => {
  if (mapZoom > 16) {
    return MarkerShowState.FULL;
  }

  return mapZoom > 12 // TODO: make 14 in non-local env
    ? MarkerShowState.DOT
    : MarkerShowState.HIDDEN;
};

export default function MapBoundsProvider({ children }: PropsWithChildren) {
  const map = useMap();
  const [mapBounds, setMapBounds] = useState<LatLngBounds>(map.getBounds());
  const [mapZoom, setMapZoom] = useState<number>(map.getZoom());
  const markerShowState = getMarkerShowState(mapZoom);

  const setMapView = useCallback(
    (latLngExpression: LatLngExpression, zoom: number = 18) => {
      map.setView(latLngExpression, zoom);
    },
    [map],
  );

  const filterMarkers = useCallback(
    <T extends MarkerWithCoordinates>(markersWithCoordinates: T[]) =>
      markersWithCoordinates.filter(({ lat, lon }) =>
        mapBounds.contains([lat, lon]),
      ),
    [mapBounds],
  );

  useEffect(() => {
    function updateBounds() {
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
        markerShowState,
        setMapView,
        filterMarkers,
      }}
    >
      {children}
    </MapBoundsContext.Provider>
  );
}
