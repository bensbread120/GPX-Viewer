// components/GPXViewer.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { Map as LeafletMap } from 'leaflet';
import 'leaflet-gpx';

interface GPXViewerProps {
  gpxFileUrl: string;
}

const GPXViewer: React.FC<GPXViewerProps> = ({ gpxFileUrl }) => {
  const map = useMap();

  useEffect(() => {
    const gpx = new (L as any).GPX(gpxFileUrl, {
      async: true,
      marker_options: {
        startIconUrl: 'images/pin-icon-start.png',
        endIconUrl: 'images/pin-icon-end.png',
        shadowUrl: 'images/pin-shadow.png',
      },
    });

    gpx.on('loaded', (e: any) => {
      (map as LeafletMap).fitBounds(e.target.getBounds());
    });

    gpx.addTo(map);
  }, [gpxFileUrl, map]);

  return null;
};

export default GPXViewer;
