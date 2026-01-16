import type { LatLngTuple } from 'leaflet';
import type { Itinerary, Location } from '../types/data';

export const enum MapDataActionTypes {
  SET_LOCATIONS = 'SET_LOCATIONS',
  SET_ITINERARIES = 'SET_ITINERARIES',
  SET_ITINERARY_FROM = 'SET_ITINERARY_FROM',
  SET_ITINERARY_TO = 'SET_ITINERARY_TO',
  SET_SELECTED_ITINERARY = 'SET_SELECTED_ITINERARY',
  SET_SELECTED_LOCATION = 'SET_SELECTED_LOCATION',
}

export type SetLocationsAction = {
  type: MapDataActionTypes.SET_LOCATIONS;
  payload: Location[];
};
export type SetItinerariesAction = {
  type: MapDataActionTypes.SET_ITINERARIES;
  payload: Itinerary[];
};
export type SetItineraryFromAction = {
  type: MapDataActionTypes.SET_ITINERARY_FROM;
  payload: LatLngTuple | null;
};
export type SetItineraryToAction = {
  type: MapDataActionTypes.SET_ITINERARY_TO;
  payload: LatLngTuple | null;
};
export type SetSelectedItineraryAction = {
  type: MapDataActionTypes.SET_SELECTED_ITINERARY;
  payload: Itinerary | null;
};
export type SetSelectedLocationAction = {
  type: MapDataActionTypes.SET_SELECTED_LOCATION;
  payload: Location | null;
};

export type NewMapDataActions =
  | SetLocationsAction
  | SetItinerariesAction
  | SetItineraryFromAction
  | SetItineraryToAction
  | SetSelectedItineraryAction
  | SetSelectedLocationAction;
