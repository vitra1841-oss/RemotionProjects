import { Theme } from './types';
import { fontFamilies } from '../fonts';

export const darkTech: Theme = {
  name: 'dark-tech',
  colors: {
    bg: '#0A0F1C',
    text: '#F8FAFC',
    muted: '#94A3B8',

    primary: '#67E8F9',
    accent: '#F59E0B',
    success: '#34D399',

    divider: '#233046',

    subAccent1: '#60A5FA',
    subAccent2: '#F472B6',
    subAccent3: '#34D399',
    subAccent4: '#FBBF24',
  },
  typography: {
    headline: fontFamilies.bricolage,
    body: fontFamilies.spaceGrotesk,
    label: fontFamilies.bigShoulders,
    mono: fontFamilies.spaceMono,
    sizes: {
      hero: 180,
      headline: 130,
      subheadline: 68,
      body: 32,
      label: 28,
      caption: 24,
    },
    weights: {
      black: 900,
      bold: 700,
      normal: 400,
    },
  },
  animation: {
    spring: { damping: 12, mass: 0.5, stiffness: 100, overshootClamping: false },
    springSlow: { damping: 20, mass: 1, stiffness: 50, overshootClamping: false },
    springFast: { damping: 15, mass: 0.3, stiffness: 150, overshootClamping: false },
  },
  layout: {
    framePadding: 80,
    verticalAnchorLeft: 0.35,
    lineHeight: {
      tight: 1.0,
      normal: 1.4,
      loose: 1.6,
    },
    gap: {
      xs: 8,
      sm: 16,
      md: 24,
      lg: 40,
      xl: 64,
    },
  },
};
