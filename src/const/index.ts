import type { CSSProperties } from 'react';
import type { TransitType } from '../types';

export const colorMap = {
  WALK: '#6e6e6e',
  TRAM: '#ff601e',
  BUS: '#00e1b4',
  RAIL: '#7d00f1',
} as Record<TransitType, CSSProperties['color']>;

/* Use for realtime transport data
export const colorMap = {
  '1': {
    primaryColor: 'blue',
    secondaryColor: 'lightblue',
  },
  '2': {
    primaryColor: 'blue',
    secondaryColor: '#00e1b4',
  },
  '3': { primaryColor: 'red', secondaryColor: '#ff601e' },
  '7': {
    primaryColor: '#00e1b4',
    secondaryColor: 'blue',
  },
};*/
