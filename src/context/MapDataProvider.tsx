import { useReducer } from 'react';
import { MapDataContext, reducer } from './MapDataContext';

import type { PropsWithChildren } from 'react';

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

export default function MapDataProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapDataContext.Provider value={{ state, dispatch }}>
      {children}
    </MapDataContext.Provider>
  );
}
