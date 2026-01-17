import MapBoundsProvider from '../context/MapBoundsProvider';
import ItineraryRenderer from './MapContents/ItineraryRenderer';
import LocationsRenderer from './MapContents/LocationsRenderer';
import StopsRenderer from './MapContents/StopsRenderer';

export default function MapContentsRenderer() {
  return (
    <MapBoundsProvider>
      <LocationsRenderer />
      <StopsRenderer />
      <ItineraryRenderer />
    </MapBoundsProvider>
  );
}
