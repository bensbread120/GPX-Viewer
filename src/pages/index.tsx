// pages/index.tsx (or wherever you're rendering the map)
import { ActivityGraph } from '@/components/ActivityGraph';
import dynamic from 'next/dynamic';
import React from 'react';

const DynamicGPXMap = dynamic(() => import('../components/GPXMap'), {
  ssr: false, // 🔥 disables server-side rendering
});

export default function Home() {
  return (
    <div>
      <div className="flex justify-center mt-6">
        <div className="w-[800px] h-[400px] rounded overflow-hidden shadow-lg">
          <h1>GPX Viewer</h1>
          <DynamicGPXMap gpxFileUrl="/gpx/Eastern_Gardens_B_grade.gpx" />
        </div>
      </div>  
      <div className="flex justify-center mt-6">
        <div className="w-[800px] h-[800px] rounded overflow-hidden shadow-lg">
          <h1>GPX Viewer</h1>
          <ActivityGraph gpxFileUrl="/gpx/Eastern_Gardens_B_grade.gpx" />
        </div>
      </div>
    </div>
    
  )
}
