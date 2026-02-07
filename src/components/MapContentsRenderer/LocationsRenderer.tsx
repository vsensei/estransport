import { MapDataActionTypes } from 'actions';
import { useMapBoundsContext } from 'context/MapBoundsContext';
import { useMapDataContext } from 'context/MapDataContext';
import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import {
  getColor,
  getColorByTransitType,
  getDepartureTime,
  isStationType,
  isStopType,
} from 'utils';
import { fetchStopDepartures } from 'utils/fetch';

import type { LatLngTuple } from 'leaflet';
import type { Location, StopTime } from 'types/data';

export default function LocationsRenderer() {
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);
  const {
    state: { locations, selectedLocation },
    dispatch,
  } = useMapDataContext();
  const { setMapView } = useMapBoundsContext();

  useEffect(() => {
    if (selectedLocation) {
      const [lon, lat] = selectedLocation.geometry.coordinates;
      setMapView([lat, lon]);
    }
  }, [selectedLocation, setMapView]);

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
                  <button onClick={() => void handleShowDepartures(stopId)}>
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
                            time.scheduledDeparture,
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
    </>
  );
}
