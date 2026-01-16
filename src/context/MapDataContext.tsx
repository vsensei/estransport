import { createContext, useContext } from 'react';
import { MapDataActionTypes } from '../actions';

import type { LatLngTuple } from 'leaflet';
import type { Dispatch } from 'react';
import type { NewMapDataActions } from '../actions';
import type { Itinerary, Location } from '../types/data';

type State = {
  locations: Location[];
  itineraries: Itinerary[];
  itineraryCoordinates: {
    from: LatLngTuple | null;
    to: LatLngTuple | null;
  };
  selectedItinerary: Itinerary | null;
  selectedLocation: Location | null;
};

type MapDataContextType = {
  state: State;
  dispatch: Dispatch<NewMapDataActions>;
};

export const MapDataContext = createContext<MapDataContextType | null>(null);

export const reducer = (state: State, action: NewMapDataActions) => {
  switch (action.type) {
    case MapDataActionTypes.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
      };
    case MapDataActionTypes.SET_ITINERARIES:
      return {
        ...state,
        itineraries: action.payload,
      };
    case MapDataActionTypes.SET_ITINERARY_FROM:
      return {
        ...state,
        itineraryCoordinates: {
          ...state.itineraryCoordinates,
          from: action.payload,
        },
      };
    case MapDataActionTypes.SET_ITINERARY_TO:
      return {
        ...state,
        itineraryCoordinates: {
          ...state.itineraryCoordinates,
          to: action.payload,
        },
      };
    case MapDataActionTypes.SET_SELECTED_ITINERARY:
      return {
        ...state,
        selectedItinerary: action.payload,
      };
    case MapDataActionTypes.SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload,
      };
    default:
      return state;
  }
};

export const useMapDataContext = () => {
  return useContext(MapDataContext) as MapDataContextType;
};
