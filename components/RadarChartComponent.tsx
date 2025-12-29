
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { ChartDataPoint } from '../types';

interface RadarChartComponentProps {
  data: ChartDataPoint[];
}

const auraDescriptions: { [key: string]: string } = {
  Lumina: "Emotional radiance",
  Bond: "Connections with others",
  Pulse: "Activity Level",
  Serenity: "Inner peace",
  Vitality: "Physical wellness",
  Depth: "Depth of Reflection",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const subject = data.payload.subject;
    const value = data.value;
    const description = auraDescriptions[subject as keyof typeof auraDescriptions];

    return (
      <div className="p-3 bg-white/95 border border-[#7B61FF]/50 rounded-lg shadow-lg text-sm" style={{ fontFamily: 'Quicksand' }}>
        <p className="font-bold text-[#3d405b]" style={{fontFamily: 'Raleway'}}>
          {subject}: {value}
        </p>
        <p className="text-slate-600">{description}</p>
      </div>
    );
  }
  return null;
};


export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <defs>
            <radialGradient id="colorValue" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.8}/>
                <stop offset="75%" stopColor="#FFB7B2" stopOpacity={0.6}/>
            </radialGradient>
        </defs>
        <PolarGrid stroke="#7B61FF" strokeOpacity={0.3} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#7B61FF', fontSize: 14, fontFamily: 'Raleway' }} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'transparent' }} />
        <Radar
          name="Your Aura"
          dataKey="value"
          stroke="#7B61FF"
          fill="url(#colorValue)"
          fillOpacity={0.7}
        />
        <Tooltip
            cursor={{ stroke: '#FFB7B2', strokeWidth: 1, strokeDasharray: '3 3' }}
            content={<CustomTooltip />}
        />
        <Legend
            wrapperStyle={{
                color: '#7B61FF',
                bottom: -10,
                fontFamily: 'Quicksand'
            }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};