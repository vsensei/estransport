import MapBoundsProvider from 'context/MapBoundsProvider';
import { useCustomMapEvents } from 'hooks/useCustomMapEvents';
import ItineraryRenderer from './MapContentsRenderer/ItineraryRenderer';
import LiveTransportRenderer from './MapContentsRenderer/LiveTransportRenderer';
import LocationsRenderer from './MapContentsRenderer/LocationsRenderer';
import StopsRenderer from './MapContentsRenderer/StopsRenderer';

export default function MapContentsRenderer() {
  useCustomMapEvents();

  return (
    <MapBoundsProvider>
      <LocationsRenderer />
      <StopsRenderer />
      <ItineraryRenderer />
      <LiveTransportRenderer />
    </MapBoundsProvider>
  );
}
