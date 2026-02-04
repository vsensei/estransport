import { useMapEvents } from 'react-leaflet';

export const useCustomMapEvents = () => {
  const map = useMapEvents({
    click(e) {
      //map.locate();
      map.flyTo(e.latlng, map.getZoom());
    },
  });
};
