// components/GPXMap.tsx
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import GPXViewer from './GPXViewer';

interface GPXMapProps {
  gpxFileUrl: string;
}

const GPXMap: React.FC<GPXMapProps> = ({ gpxFileUrl }) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GPXViewer gpxFileUrl={gpxFileUrl} />
    </MapContainer>
  );
};

export default GPXMap;
