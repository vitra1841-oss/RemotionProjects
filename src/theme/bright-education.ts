import { Theme } from './types';
import { fontFamilies } from '../fonts';

export const brightEducation: Theme = {
  name: 'bright-education',
  colors: {
    bg: '#FAFAF8',
    text: '#1A1A2E',
    muted: '#6B7280',
    primary: '#6366F1',
    accent: '#F59E0B',
    success: '#10B981',
    divider: '#E5E7EB',
    subAccent1: '#8B5CF6',
    subAccent2: '#EC4899',
    subAccent3: '#14B8A6',
    subAccent4: '#F97316',
  },
  typography: {
    headline: fontFamilies.fraunces,
    body: fontFamilies.lexend,
    label: fontFamilies.bigShoulders,
    mono: fontFamilies.spaceMono,
    sizes: {
      hero: 160,
      headline: 120,
      subheadline: 64,
      body: 34,
      label: 28,
      caption: 22,
    },
    weights: {
      black: 900,
      bold: 700,
      normal: 400,
    },
  },
  animation: {
    spring: { damping: 14, mass: 0.6, stiffness: 120, overshootClamping: false },
    springSlow: { damping: 22, mass: 1, stiffness: 60, overshootClamping: false },
    springFast: { damping: 12, mass: 0.3, stiffness: 180, overshootClamping: false },
  },
  layout: {
    framePadding: 80,
    verticalAnchorLeft: 0.32,
    lineHeight: {
      tight: 1.05,
      normal: 1.5,
      loose: 1.7,
    },
    gap: {
      xs: 8,
      sm: 16,
      md: 28,
      lg: 48,
      xl: 72,
    },
  },
};