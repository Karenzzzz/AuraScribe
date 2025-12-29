
import React from 'react';
import type { AuraAnalysis, ChartDataPoint, Metrics } from '../types';
import { RadarChartComponent } from './RadarChartComponent';
import { TarotCard } from './TarotCard';

interface AnalysisResultProps {
  analysis: AuraAnalysis;
  onReset: () => void;
}

const mapMetricsToChartData = (metrics: Metrics): ChartDataPoint[] => {
    return [
        { subject: 'Lumina', value: metrics.lumina, fullMark: 10 },
        { subject: 'Bond', value: metrics.bond, fullMark: 10 },
        { subject: 'Pulse', value: metrics.pulse, fullMark: 10 },
        { subject: 'Serenity', value: metrics.serenity, fullMark: 10 },
        { subject: 'Vitality', value: metrics.vitality, fullMark: 10 },
        { subject: 'Depth', value: metrics.depth, fullMark: 10 },
    ];
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  const chartData = mapMetricsToChartData(analysis.metrics);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
        <h2 className="text-4xl text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#FFB7B2]">
            Your Daily Aura
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="w-full h-80 md:h-96">
               <RadarChartComponent data={chartData} />
            </div>
            <TarotCard card={analysis.tarot.card} insight={analysis.tarot.insight} />
        </div>
        <div className="flex justify-center mt-4">
             <button
              onClick={onReset}
              className="px-6 py-2 text-sm font-medium text-[#7B61FF] bg-[#7B61FF]/10 border border-[#7B61FF]/20 rounded-lg hover:bg-[#7B61FF]/20 transition-colors"
            >
              Start New Entry
            </button>
        </div>
    </div>
  );
};
