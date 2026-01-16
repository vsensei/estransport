import { decode } from '@googlemaps/polyline-codec';
import { useEffect, useState } from 'react';
import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { MapDataActionTypes } from '../../actions';
import { useMapDataContext } from '../../context/MapDataContext';
import {
  getColor,
  getColorByTransitType,
  getDepartureTime,
  isStationType,
  isStopType,
} from '../../utils';
import { fetchItineraries, fetchStopDepartures } from '../../utils/fetch';

import type { LatLngTuple } from 'leaflet';
import type {
  ItineraryResponseData,
  Location,
  StopTime,
} from '../../types/data';

export default function TestPoints() {
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);
  const {
    state: {
      locations,
      itineraryCoordinates,
      itineraries,
      selectedItinerary,
      selectedLocation,
    },
    dispatch,
  } = useMapDataContext();
  const map = useMap();

  map.on('dragend', function () {
    const bounds = map.getBounds();
    console.log(bounds);
  });

  useEffect(() => {
    const getItineraries = async () => {
      const itineraryData: ItineraryResponseData = await fetchItineraries(
        //TODO: add typeguards
        itineraryCoordinates as {
          from: LatLngTuple;
          to: LatLngTuple;
        }
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

  useEffect(() => {
    if (selectedLocation) {
      const [lon, lat] = selectedLocation.geometry.coordinates;
      map.setView([lat, lon], 18);
    }
  }, [selectedLocation, map]);

  if (!locations) {
    return null;
  }

  const handleSetFromClick = (location: Location) => {
    dispatch({
      type: MapDataActionTypes.SET_ITINERARY_FROM,
      payload: [...location.geometry.coordinates].reverse() as LatLngTuple,
    });
  };

  const handleSetToClick = (location: Location) => {
    dispatch({
      type: MapDataActionTypes.SET_ITINERARY_TO,
      payload: [...location.geometry.coordinates].reverse() as LatLngTuple,
    });
  };

  const handleShowDepartures = async (stopId: string) => {
    const fetchedStopTimes = await fetchStopDepartures(stopId);
    console.log(fetchedStopTimes);
    setStopTimes(fetchedStopTimes);
  };

  return (
    <>
      {locations.map((location) => {
        const {
          geometry: { coordinates },
          properties,
        } = location;

        const isStop = isStopType(location);
        const isStation = isStationType(location);
        const rawStopId = properties.id.split(/[:#]/);
        const stopId =
          isStop || isStation ? `${rawStopId[1]}:${rawStopId[2]}` : '';

        return (
          <Marker
            position={[coordinates[1], coordinates[0]]}
            key={properties.id}
            opacity={1}
          >
            <Popup>
              <strong>
                <p style={{ color: getColor(location) }}>
                  {properties.name} [{properties.layer}]
                  {isStop &&
                    ` (${location.properties.addendum.GTFS.modes.toString()})`}
                </p>
              </strong>
              <ul>
                {isStation && <li>{stopId}</li>}
                {isStop && (
                  <>
                    <li>{stopId}</li>
                    <li>{location.properties.addendum.GTFS.code}</li>
                  </>
                )}
                <li>
                  {coordinates[1]},{coordinates[0]}
                </li>
              </ul>
              <div>
                <button onClick={() => handleSetFromClick(location)}>
                  Set From
                </button>
                <button onClick={() => handleSetToClick(location)}>
                  Set To
                </button>
              </div>
              {isStop && (
                <>
                  <button onClick={() => handleShowDepartures(stopId)}>
                    Show Departures
                  </button>
                  <ul>
                    {[...stopTimes]
                      .sort((a, b) => b.departureDelay - a.departureDelay)
                      .map((time) => (
                        <li
                          key={`${time.trip.routeShortName}${time.trip.route.id}${time.scheduledArrival}`}
                          style={{
                            color: getColorByTransitType(time.trip.route.mode),
                          }}
                        >
                          {time.trip.routeShortName} {time.trip.tripShortName} -
                          in{' '}
                          {getDepartureTime(
                            time.serviceDay,
                            time.scheduledDeparture
                          )}{' '}
                          minutes
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </Popup>
          </Marker>
        );
      })}
      {!selectedItinerary &&
        itineraries.map((itinerary) => {
          console.log('ITINERARY', itinerary);

          return itinerary?.node.legs.map((leg) => (
            <Polyline
              key={leg.legGeometry.points}
              color={getColorByTransitType(leg.mode)}
              dashArray={leg.mode === 'WALK' ? '10 15' : undefined}
              weight={5}
              positions={decode(leg.legGeometry.points)}
            />
          ));
        })}
      {selectedItinerary &&
        selectedItinerary.node.legs.map((leg) => (
          <Polyline
            key={leg.legGeometry.points}
            color={getColorByTransitType(leg.mode)}
            dashArray={leg.mode === 'WALK' ? '10 15' : undefined}
            weight={5}
            positions={decode(leg.legGeometry.points)}
          />
        ))}
    </>
  );
}
