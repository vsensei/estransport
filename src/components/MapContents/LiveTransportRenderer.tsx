import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { CircleMarker, Marker, Popup, Tooltip } from 'react-leaflet';
import { serverBaseUrl } from '../../const/env';
import { useMapBoundsContext } from '../../context/MapBoundsContext';
import { liveTransportQueryMock } from '../../mocks/liveTransportQueryMock';
import { getRealtimeMarkerColor } from '../../utils';
import { getTransportIcon } from '../../utils/dynamicSvg';
import { processTransportLocationsTest } from '../../utils/fetch';

import type { LiveVehicleInfo } from '../../types/data';

import styles from './LiveTransportRenderer.module.css';

export default function LiveTransportRenderer() {
  const [transportMarkers, setTransportMarkers] = useState<LiveVehicleInfo[]>(
    [],
  );
  const { filterMarkers } = useMapBoundsContext();
  const liveTransportLineMock = `${liveTransportQueryMock.type}-${liveTransportQueryMock.lineNumber}`;

  useEffect(() => {
    const eventSource = new EventSource(
      `${serverBaseUrl}/liveData/route/${liveTransportLineMock}`,
    );

    eventSource.onmessage = (event: MessageEvent<string>) => {
      setTransportMarkers(processTransportLocationsTest(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [liveTransportLineMock]);

  const filteredMarkers = filterMarkers(transportMarkers);

  return (
    <>
      {filteredMarkers.map(({ lat, lon, headingDegrees, endStopName }) => {
        const { primaryColor, secondaryColor } = getRealtimeMarkerColor(
          liveTransportQueryMock.type,
        );
        const icon = getTransportIcon(primaryColor, headingDegrees);

        return (
          <CircleMarker
            center={[lat, lon]}
            radius={15}
            opacity={0.7}
            color={primaryColor}
            fillColor={secondaryColor}
            fillOpacity={1}
            key={`${liveTransportLineMock}-${lat}-${lon}`}
          >
            <Marker position={[lat, lon]} icon={icon}></Marker>
            <Tooltip
              direction='top'
              opacity={1}
              className={styles.tooltip}
              permanent
            >
              {liveTransportQueryMock.lineNumber}
            </Tooltip>
            <Popup>
              <strong>
                {liveTransportLineMock} - {endStopName}
              </strong>
              <ul>{liveTransportQueryMock.type}</ul>
              <ul>{lat}</ul>
              <ul>{lon}</ul>
              <ul>{headingDegrees}</ul>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
