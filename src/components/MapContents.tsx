import MapBoundsProvider from '../context/MapBoundsProvider';
import StopsRenderer from './MapContents/StopsRenderer';
import TestPoints from './MapContents/TestPoints';

export default function MapContents() {
  return (
    <MapBoundsProvider>
      <TestPoints />
      <StopsRenderer />
    </MapBoundsProvider>
  );
}
