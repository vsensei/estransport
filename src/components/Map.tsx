import { MapContainer, TileLayer } from 'react-leaflet';
import { digitransitAPIKey } from '../const/envVariables';
import MapContentsRenderer from './MapContentsRenderer';

import 'leaflet/dist/leaflet.css';

export default function Map() {
  return (
    <MapContainer
      center={[59.44, 24.72]}
      zoom={13}
      style={{ height: '100vh', width: '100vw' }}
      maxBoundsViscosity={0}
      maxBounds={[
        [59.724064, 21.717467],
        [57.481766, 28.259855],
      ]}
      maxZoom={18}
      minZoom={7.5}
      zoomDelta={0.5}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://cdn.digitransit.fi/map/v3/hsl-map-en/{z}/{x}/{y}.png?digitransit-subscription-key=${digitransitAPIKey}`}
      />
      <MapContentsRenderer />
    </MapContainer>
  );
}
