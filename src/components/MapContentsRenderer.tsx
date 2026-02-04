import MapBoundsProvider from '../context/MapBoundsProvider';
import { useCustomMapEvents } from '../hooks/useCustomMapEvents';
import ItineraryRenderer from './MapContents/ItineraryRenderer';
import LiveTransportRenderer from './MapContents/LiveTransportRenderer';
import LocationsRenderer from './MapContents/LocationsRenderer';
import StopsRenderer from './MapContents/StopsRenderer';

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
