import { Theme } from './types';
import { fontFamilies } from '../fonts';

export const minimalCorporate: Theme = {
  name: 'minimal-corporate',
  colors: {
    bg: '#111318',
    text: '#E8EAED',
    muted: '#8A9099',
    primary: '#4FC3F7',
    accent: '#B0BEC5',
    success: '#4DB6AC',
    divider: '#2A2D35',
    subAccent1: '#81D4FA',
    subAccent2: '#90CAF9',
    subAccent3: '#4DB6AC',
    subAccent4: '#FFB74D',
  },
  typography: {
    headline: fontFamilies.bricolage,
    body: fontFamilies.spaceGrotesk,
    label: fontFamilies.bigShoulders,
    mono: fontFamilies.spaceMono,
    sizes: {
      hero: 200,
      headline: 110,
      subheadline: 60,
      body: 30,
      label: 26,
      caption: 22,
    },
    weights: {
      black: 900,
      bold: 600,
      normal: 400,
    },
  },
  animation: {
    spring: { damping: 18, mass: 0.8, stiffness: 90, overshootClamping: true },
    springSlow: { damping: 26, mass: 1.2, stiffness: 40, overshootClamping: true },
    springFast: { damping: 14, mass: 0.4, stiffness: 160, overshootClamping: true },
  },
  layout: {
    framePadding: 96,
    verticalAnchorLeft: 0.38,
    lineHeight: {
      tight: 0.95,
      normal: 1.4,
      loose: 1.6,
    },
    gap: {
      xs: 6,
      sm: 14,
      md: 22,
      lg: 36,
      xl: 56,
    },
  },
};