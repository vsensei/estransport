import { useState } from 'react';
import { MapDataActionTypes } from '../../actions';
import { useMapDataContext } from '../../context/MapDataContext';
import { formatDepartureTime, getDepartureTimeByDateTime } from '../../utils';
import { fetchLocationsByQueryName } from '../../utils/fetch';

import styles from './Header.module.css';

import type { ChangeEvent } from 'react';
import type { Itinerary, Location } from '../../types/data';

const sortLocations = (unsortedLocations: Location[]) => {
  return [...unsortedLocations].sort(
    (a, b) => b.properties.confidence - a.properties.confidence,
  );
};

const calculateItineraryDistance = (itinerary: Itinerary) => {
  const distanceSum = itinerary.node.legs.reduce(
    (acc, leg) => (acc = acc + leg.distance),
    0,
  );

  if (distanceSum < 1000) {
    return `${distanceSum}m`;
  }

  const kmFromDistance = (distanceSum / 1000).toFixed(3);
  return `${kmFromDistance}km`;
};

export default function Header() {
  const [locationSearchQuery, setLocationSearchQuery] =
    useState<string>('Viru');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { state, dispatch } = useMapDataContext();

  const handleLocationSearchQueryChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setLocationSearchQuery(e.target.value);
  };

  const getLocationsByQuery = async () => {
    const locations = await fetchLocationsByQueryName(locationSearchQuery);
    console.log('LOC', locations);
    dispatch({ type: MapDataActionTypes.SET_LOCATIONS, payload: locations });
  };

  const handleClick = () => {
    setIsCollapsed((prevIsCollapsed) => !prevIsCollapsed);
  };

  const handleSelectItineraryClick = (itinerary: Itinerary) => {
    dispatch({
      type: MapDataActionTypes.SET_SELECTED_ITINERARY,
      payload: itinerary,
    });
  };

  return (
    <div className={styles.container} aria-collapsed={isCollapsed}>
      <button className={styles.showDisplayToggleButton} onClick={handleClick}>
        Show/Hide
      </button>
      <div>
        <input
          name='newRouteName'
          value={locationSearchQuery}
          onChange={handleLocationSearchQueryChange}
        />
        <button onClick={getLocationsByQuery}>Load</button>
      </div>
      <div className={styles.listsContainer}>
        <ul className={styles.choosableList}>
          {sortLocations(state.locations).map((location) => {
            const { geometry, properties } = location;

            return (
              <li
                key={properties.id}
                aria-selected={false}
                onClick={() => {
                  dispatch({
                    type: MapDataActionTypes.SET_SELECTED_LOCATION,
                    payload: location,
                  });
                }}
                style={{ backgroundColor: '' }}
              >
                {properties.id}
                <br />
                {properties.layer}
                <br />
                {properties.name}
                <br />
                {properties.label}
                <br />
                {properties.confidence}
                <br />
                {properties.accuracy}
                <br />
                {properties.localadmin}
                <br />({geometry.coordinates[1]},{geometry.coordinates[0]})
              </li>
            );
          })}
        </ul>
        <ul className={styles.choosableList}>
          {state.itineraries.map((itinerary) => (
            <li
              key={`${itinerary.node.start}${itinerary.node.legs.toString()}`}
              aria-selected={false}
              onClick={() => handleSelectItineraryClick(itinerary)}
              style={{ backgroundColor: '' }}
            >
              {itinerary.node.legs.map((leg) => leg.mode).join('-')}
              <br />
              {formatDepartureTime(
                getDepartureTimeByDateTime(new Date(itinerary.node.start)),
              )}
              <br />
              {itinerary.node.legs.reduce(
                (acc, leg) => (acc = acc + leg.duration),
                0,
              )}
              <br />
              {calculateItineraryDistance(itinerary)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
