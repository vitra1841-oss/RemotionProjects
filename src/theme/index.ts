export type { Theme, ThemeColors, ThemeTypography, ThemeAnimation, ThemeLayout } from './types';
export { darkTech } from './dark-tech';
export { brightEducation } from './bright-education';
export { minimalCorporate } from './minimal-corporate';
export { hackerGreen } from './hacker-green';

import { spring, useVideoConfig, useCurrentFrame } from 'remotion';
import { darkTech } from './dark-tech';
import { brightEducation } from './bright-education';
import { minimalCorporate } from './minimal-corporate';
import { hackerGreen } from './hacker-green';

export const themes = {
  'dark-tech': darkTech,
  'bright-education': brightEducation,
  'minimal-corporate': minimalCorporate,
  'hacker-green': hackerGreen,
} as const;

export type ThemeName = keyof typeof themes;

export { darkTech as defaultTheme };

export const useSpring = (frameOffset: number = 0, config = darkTech.animation.spring) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return spring({
    frame: frame - frameOffset,
    fps,
    config,
  });
};