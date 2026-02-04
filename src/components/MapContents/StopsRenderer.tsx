import { LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';
import { CircleMarker, Marker } from 'react-leaflet';
import { MapDataActionTypes } from '../../actions';
import { MarkerShowState } from '../../const/enum';
import { useMapBoundsContext } from '../../context/MapBoundsContext';
import { useMapDataContext } from '../../context/MapDataContext';
import { getColorByTransitType } from '../../utils';
import { getStopIcon } from '../../utils/dynamicSvg';
import { fetchPartialStops } from '../../utils/fetch';
import StopPopup from '../common/StopPopup';

import type { StopStationData } from '../../types/data';

type StopsMap = Record<StopStationData['gtfsId'], StopStationData>;

const isInLatLngBoundsArray = (
  newBounds: LatLngBounds,
  latLngBounds: LatLngBounds[],
) => latLngBounds.some((latLngItem) => latLngItem.contains(newBounds));

export default function StopsRenderer() {
  const [stopsMap, setStopsMap] = useState<StopsMap>({});
  const [latLngBounds, setLatLngBounds] = useState<LatLngBounds[]>([]);
  const { mapBounds, mapZoom, markerShowState, filterMarkers } =
    useMapBoundsContext();
  const { dispatch } = useMapDataContext();

  const isHidden = markerShowState === MarkerShowState.HIDDEN;
  const isFull = markerShowState === MarkerShowState.FULL;

  useEffect(() => {
    const updateStops = async () => {
      if (
        mapZoom < 13 ||
        (latLngBounds.length && isInLatLngBoundsArray(mapBounds, latLngBounds))
      ) {
        return;
      }

      const { lat: minLat, lng: minLon } = mapBounds.getSouthWest();
      const { lat: maxLat, lng: maxLon } = mapBounds.getNorthEast();
      const newStops = await fetchPartialStops({
        minLat,
        minLon,
        maxLat,
        maxLon,
      });

      setStopsMap((prevStopsMap) =>
        newStops.reduce(
          (acc, stopStation) =>
            stopStation.vehicleMode && !prevStopsMap[stopStation.gtfsId]
              ? { ...acc, [stopStation.gtfsId]: stopStation }
              : { ...acc },
          prevStopsMap,
        ),
      );

      setLatLngBounds((prevLatLngBounds) => [...prevLatLngBounds, mapBounds]);
    };

    if (!isHidden) {
      updateStops();
    }
  }, [mapBounds, mapZoom, latLngBounds, isHidden]);

  if (isHidden) {
    return null;
  }

  const filteredStops = filterMarkers(Object.values(stopsMap));

  const handleSetFromClick = (stop: StopStationData) => {
    dispatch({
      type: MapDataActionTypes.SET_ITINERARY_FROM,
      payload: [stop.lat, stop.lon],
    });
  };

  const handleSetToClick = (stop: StopStationData) => {
    dispatch({
      type: MapDataActionTypes.SET_ITINERARY_TO,
      payload: [stop.lat, stop.lon],
    });
  };

  return (
    <>
      {filteredStops.map((stop) => {
        const markerColor = getColorByTransitType(stop.vehicleMode);
        const isStation = stop.locationType === 'STATION';
        const icon = getStopIcon(markerColor, isStation);

        if (isFull) {
          return (
            <Marker
              position={[stop.lat, stop.lon]}
              icon={icon}
              key={`${stop.gtfsId}-f`}
            >
              <StopPopup
                stop={stop}
                handleSetFromClick={handleSetFromClick}
                handleSetToClick={handleSetToClick}
              />
            </Marker>
          );
        }

        return (
          <CircleMarker
            center={[stop.lat, stop.lon]}
            radius={1}
            color={getColorByTransitType(stop.vehicleMode)}
            opacity={1}
            key={`${stop.gtfsId}`}
          />
        );
      })}
    </>
  );
}
