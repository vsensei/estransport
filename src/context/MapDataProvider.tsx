import { useReducer } from 'react';
import { MapDataContext, reducer } from './MapDataContext';

import type { FC, ReactNode } from 'react';

type MapDataProviderProps = {
  children: ReactNode;
};

const initialState = {
  locations: [],
  itineraries: [],
  itineraryCoordinates: {
    from: null,
    to: null,
  },
  selectedItinerary: null,
  selectedLocation: null,
};

const MapDataProvider: FC<MapDataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapDataContext.Provider value={{ state, dispatch }}>
      {children}
    </MapDataContext.Provider>
  );
};

export default MapDataProvider;
