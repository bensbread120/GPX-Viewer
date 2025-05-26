// components/Map.tsx
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { parseStringPromise } from 'xml2js';
import { Feature, LineString } from 'geojson';


mapboxgl.accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN!;

interface MapProps {
  gpxFileUrl: string;
  currentIndex: number;
}

export default function Map({ gpxFileUrl, currentIndex }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [144.9631, -37.8136], // Melbourne default
      zoom: 10,
    });

    const loadGPX = async () => {
      try {
        const res = await fetch(gpxFileUrl);
        const text = await res.text();
        const result = await parseStringPromise(text);

        const trkpts = result.gpx.trk[0].trkseg[0].trkpt;
        const coordinates = trkpts.map((pt: any) => [
          parseFloat(pt.$.lon),
          parseFloat(pt.$.lat),
        ]);
        setCoordinates(coordinates);

        const geojson: Feature<LineString> = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
          properties: {},
        };

        map.on('load', () => {
          map.addSource('route', {
            type: 'geojson',
            data: geojson,
          });

          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#ff0000',
              'line-width': 4,
            },
          });

          // Add Start Marker
          new mapboxgl.Marker({ color: 'green' }) // or use a custom element
            .setLngLat(coordinates[0])
            .addTo(map);

          // Add End Marker
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat(coordinates[coordinates.length - 1])
            .addTo(map);
          
          // Add Reference marker
          const initialPosition = coordinates[0];
          const follerMarker = document.createElement('div');
          follerMarker.className = 'follow-marker';
          const marker = new mapboxgl.Marker(follerMarker)
            .setLngLat(initialPosition)
            .addTo(map);
          markerRef.current = marker;

          // Fit bounds
          const bounds = coordinates.reduce(
            (b: any, coord: any) => b.extend(coord),
            new mapboxgl.LngLatBounds(initialPosition, initialPosition)
          );
          map.fitBounds(bounds, { padding: 20 });
        });
      } catch (err) {
        console.error('Failed to load GPX', err);
      }
    };

    loadGPX();

    return () => map.remove();
  }, [gpxFileUrl]);

  useEffect(() => {
    if (
      markerRef.current &&
      coordinates.length > currentIndex &&
      currentIndex >= 0
    ) {
      markerRef.current.setLngLat(coordinates[currentIndex] as [number, number]);
    }
  }, [currentIndex, coordinates]);

  return <div className='border rounded-3xl' ref={mapContainer} style={{ height: '500px', width: '100%' }} />;
}
