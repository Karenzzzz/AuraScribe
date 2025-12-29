
export interface Metrics {
  lumina: number;
  bond: number;
  pulse: number;
  serenity: number;
  vitality: number;
  depth: number;
}

export interface Tarot {
  card: string;
  insight: string;
}

export interface AuraAnalysis {
  metrics: Metrics;
  tarot: Tarot;
}

export interface AggregatedAuraAnalysis {
  summary: string;
  tarot: Tarot;
}

export interface ChartDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface JournalEntry {
    id: string;
    date: string;
    text: string;
    imageUrl?: string;
    analysis: AuraAnalysis;
}

export interface User {
    name: string;
    profilePictureUrl: string;
}

export type Screen = 'scribe' | 'echoes' | 'universe';