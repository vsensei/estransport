import { useState } from 'react';
import { Popup } from 'react-leaflet';
import { getColorByTransitType, getDepartureTime } from '../../utils';
import { fetchStopDepartures } from '../../utils/fetch';

import type { StopStationData, StopTime } from '../../types/data';

export default function StopPopup({
  stop,
  handleSetFromClick,
  handleSetToClick,
}: {
  stop: StopStationData;
  handleSetFromClick: (stop: StopStationData) => void;
  handleSetToClick: (stop: StopStationData) => void;
}) {
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);

  const handleShowDepartures = async (stopId: string) => {
    const fetchedStopTimes = await fetchStopDepartures(stopId);
    setStopTimes(fetchedStopTimes);
  };

  const { name, gtfsId, vehicleMode, locationType, code, lat, lon } = stop;

  return (
    <Popup>
      <strong>
        <p
          style={{ color: getColorByTransitType(stop.vehicleMode) }}
        >{`${name} [${locationType}] (${vehicleMode})`}</p>
      </strong>
      <ul>
        <li>{gtfsId}</li>
        <li>{code}</li>
        <li>
          {lat},{lon}
        </li>
      </ul>
      <div>
        <button onClick={() => handleSetFromClick(stop)}>Set From</button>
        <button onClick={() => handleSetToClick(stop)}>Set To</button>
      </div>
      <button onClick={() => handleShowDepartures(gtfsId)}>
        Show Departures
      </button>
      <ul>
        {[...stopTimes]
          .sort((a, b) => b.departureDelay - a.departureDelay)
          .map((time) => (
            <li
              key={`${time.trip.routeShortName}${time.trip.route.id}${time.scheduledArrival}`}
              style={{ color: getColorByTransitType(time.trip.route.mode) }}
            >
              {time.trip.routeShortName} {time.trip.tripShortName} - in{' '}
              {getDepartureTime(time.serviceDay, time.scheduledDeparture)}{' '}
              minutes
            </li>
          ))}
      </ul>
    </Popup>
  );
}
