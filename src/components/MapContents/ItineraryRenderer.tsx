import { decode } from '@googlemaps/polyline-codec';
import { useEffect } from 'react';
import { Polyline } from 'react-leaflet';
import { MapDataActionTypes } from '../../actions';
import { walkDashArrayDefault } from '../../const';
import { useMapDataContext } from '../../context/MapDataContext';
import { getColorByTransitType } from '../../utils';
import { fetchItineraries } from '../../utils/fetch';

import type { LatLngTuple } from 'leaflet';
import type { ItineraryResponseData } from '../../types/data';

export default function ItineraryRenderer() {
  const {
    state: { itineraryCoordinates, itineraries, selectedItinerary },
    dispatch,
  } = useMapDataContext();

  useEffect(() => {
    const getItineraries = async () => {
      const itineraryData: ItineraryResponseData = await fetchItineraries(
        //TODO: add typeguards
        itineraryCoordinates as {
          from: LatLngTuple;
          to: LatLngTuple;
        },
      );
      console.log(itineraryData);
      dispatch({
        type: MapDataActionTypes.SET_ITINERARIES,
        payload: itineraryData?.data.planConnection.edges,
      });
    };

    if (itineraryCoordinates.from && itineraryCoordinates.to) {
      getItineraries();
    }
  }, [itineraryCoordinates, dispatch]);

  return (
    <>
      {selectedItinerary
        ? selectedItinerary.node.legs.map((leg) => (
            <Polyline
              key={`${selectedItinerary.node.start}${leg.legGeometry.points}`}
              color={getColorByTransitType(leg.mode)}
              dashArray={leg.mode === 'WALK' ? walkDashArrayDefault : undefined}
              weight={5}
              positions={decode(leg.legGeometry.points)}
            />
          ))
        : itineraries.map((itinerary) =>
            itinerary?.node.legs.map((leg) => (
              <Polyline
                key={`${itinerary.node.start}${leg.legGeometry.points}`}
                color={getColorByTransitType(leg.mode)}
                dashArray={
                  leg.mode === 'WALK' ? walkDashArrayDefault : undefined
                }
                weight={5}
                positions={decode(leg.legGeometry.points)}
              />
            )),
          )}
    </>
  );
}
