import { useEffect, useState } from 'react';
import { parseStringPromise } from 'xml2js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type PointData = {
  time: string;
  elevation: number;
  heartRate: number;
  temperature: number;
  cadence: number;
  power: number;
  lat: number;
  lon: number;
  speed: number;
};

const metrics = {
  heartRate: { label: 'HR (bpm)', color: '#ff0000', axis: 'left' },
  power: { label: 'Power (w)', color: '#0000ff', axis: 'left' },
  elevation: { label: 'Elevation (m)', color: '#00cc00', axis: 'right' },
  speed: { label: 'Speed (kph)', color: '#ffa500', axis: 'right' },
};

interface ActivityProps {
  gpxFileUrl: string;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const ActivityGraph = ({ gpxFileUrl, setCurrentIndex }: ActivityProps ) => {
  const [data, setData] = useState<PointData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'heartRate',
    'power',
    'elevation',
    'speed',
  ]);

  useEffect(() => {
    const fetchGPX = async () => {
      const res = await fetch(gpxFileUrl);
      const text = await res.text();
      const result = await parseStringPromise(text);

      const trkpts = result.gpx.trk[0].trkseg[0].trkpt.map((pt: any) => {
        const lat = parseFloat(pt.$.lat);
        const lon = parseFloat(pt.$.lon);
        const time = pt.time[0];
        const ele = parseFloat(pt.ele[0]);

        const extensions = pt.extensions?.[0];
        const power = parseFloat(extensions?.power?.[0] || '0');
        const trackPointExt = extensions?.['gpxtpx:TrackPointExtension']?.[0];
        const hr = parseFloat(trackPointExt?.['gpxtpx:hr']?.[0] || '0');
        const atemp = parseFloat(trackPointExt?.['gpxtpx:atemp']?.[0] || '0');
        const cad = parseFloat(trackPointExt?.['gpxtpx:cad']?.[0] || '0');

        return { lat, lon, time, elevation: ele, heartRate: hr, temperature: atemp, cadence: cad, power };
      });

      const enriched = trkpts.map((pt: PointData, i: number) => {
        if (i === 0) return { ...pt, speed: 0 };
        const prev = trkpts[i - 1];
        const dist = haversine(prev.lat, prev.lon, pt.lat, pt.lon);
        const dt = (new Date(pt.time).getTime() - new Date(prev.time).getTime()) / 1000;
        const speed = dt > 0 ? (dist / dt) * 3.6 : 0;
        return { ...pt, speed };
      });

      setData(enriched);
    };

    fetchGPX();
  }, [gpxFileUrl]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-8">
      <h3 className="text-2xl font-semibold">Activity Metrics</h3>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(metrics).map(([key, { label }]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedMetrics.includes(key)}
              onChange={() => toggleMetric(key)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Graph */}
      {selectedMetrics.map((key) => (
      <div className="overflow-x-auto bg-white shadow rounded-lg pt-3">
        {/* <LineChart
          width={800}
          height={350}
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex != null) {
              setCurrentIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setCurrentIndex(-1)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={false} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          {selectedMetrics.map((key) => (
            <Line
              key={key}
              yAxisId={metrics[key as keyof typeof metrics].axis}
              type="monotone"
              dataKey={key}
              stroke={metrics[key as keyof typeof metrics].color}
              name={metrics[key as keyof typeof metrics].label}
              dot={false}
            />
          ))}
        </LineChart> */}
        <LineChart
          width={800}
          height={150}
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex != null) {
              setCurrentIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setCurrentIndex(-1)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={false} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          
            <Line
              key={key}
              yAxisId={metrics[key as keyof typeof metrics].axis}
              type="monotone"
              dataKey={key}
              stroke={metrics[key as keyof typeof metrics].color}
              name={metrics[key as keyof typeof metrics].label}
              dot={false}
            />
          
        </LineChart>
      </div>
      ))}
    </div>
  );
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
