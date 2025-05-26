// pages/index.tsx (or wherever you're rendering the map)

import React, { useState } from 'react';

import dynamic from 'next/dynamic';
import { ActivityGraph } from '@/components/ActivityGraph';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function HomePage() {

  const [currentWaypoint, setCurrentWaypoint] = useState<number>(0);
  return (
    <main className="p-4 bg-gray-400">
      <h1 className="text-xl font-bold mb-4">Mapbox in Next.js</h1>
      <div className='max-w-7xl mx-auto px-4 py-20 p-6 border rounded-3xl bg-gray-500'>
        <h1 className="text-xl font-bold mb-4">Criterium Racing In Geelong</h1>
        <Map gpxFileUrl='gpx/Eastern_Gardens_B_grade.gpx' currentIndex={currentWaypoint}/>
        <ActivityGraph gpxFileUrl='gpx/Eastern_Gardens_B_grade.gpx' setCurrentIndex={setCurrentWaypoint}/>
      </div>
    </main>
  );
}