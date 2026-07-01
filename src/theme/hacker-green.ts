import { Theme } from './types';
import { fontFamilies } from '../fonts';

export const hackerGreen: Theme = {
  name: 'hacker-green',
  colors: {
    bg: '#0D1117',
    text: '#E6EDF3',
    muted: '#7D8590',

    primary: '#3FB950',
    accent: '#F78166',
    success: '#58A6FF',

    divider: '#21262D',

    subAccent1: '#79C0FF',
    subAccent2: '#D2A8FF',
    subAccent3: '#56D364',
    subAccent4: '#E3B341',
  },
  typography: {
    headline: fontFamilies.bricolage,
    body: fontFamilies.spaceGrotesk,
    label: fontFamilies.bigShoulders,
    mono: fontFamilies.spaceMono,
    sizes: {
      hero: 160,
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
    spring: { damping: 14, mass: 0.5, stiffness: 110, overshootClamping: true },
    springSlow: { damping: 22, mass: 1, stiffness: 55, overshootClamping: true },
    springFast: { damping: 16, mass: 0.3, stiffness: 160, overshootClamping: true },
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