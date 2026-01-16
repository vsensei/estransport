import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { MapBoundsContext } from './MapBoundsContext';

import type { LatLngBounds } from 'leaflet';
import type { FC, ReactNode } from 'react';

type MapBoundsProviderProps = {
  children: ReactNode;
};

const MapBoundsProvider: FC<MapBoundsProviderProps> = ({ children }) => {
  const map = useMap();

  if (!map) {
    throw new Error(
      'MapBoundsProvider must be placed inside the Map component.'
    );
  }

  const [mapBounds, setMapBounds] = useState<LatLngBounds>(map.getBounds());

  useEffect(() => {
    async function updateBounds() {
      setMapBounds(map.getBounds());
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
      }}
    >
      {children}
    </MapBoundsContext.Provider>
  );
};

export default MapBoundsProvider;
