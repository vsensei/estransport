import type { TransitType, TransportType } from '../types';

export const colorMap = {
  WALK: '#6e6e6e',
  TRAM: '#ff601e',
  BUS: '#00e1b4',
  RAIL: '#7d00f1',
} as Record<TransitType, string>;

export const realtimeColorMap: Record<
  TransportType,
  { primaryColor: string; secondaryColor: string }
> = {
  BUS: {
    primaryColor: '#0000ff',
    secondaryColor: colorMap.BUS,
  },
  TRAM: { primaryColor: '#ff0000', secondaryColor: colorMap.TRAM },
};

export const walkDashArrayDefault = '10 15';
