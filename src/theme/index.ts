export type { Theme, ThemeColors, ThemeTypography, ThemeAnimation, ThemeLayout } from './types';
export { darkTech } from './dark-tech';
export { brightEducation } from './bright-education';
export { minimalCorporate } from './minimal-corporate';

import { spring, useVideoConfig, useCurrentFrame } from 'remotion';
import { darkTech } from './dark-tech';
import { brightEducation } from './bright-education';
import { minimalCorporate } from './minimal-corporate';

export const themes = {
  'dark-tech': darkTech,
  'bright-education': brightEducation,
  'minimal-corporate': minimalCorporate,
} as const;

export type ThemeName = keyof typeof themes;

// Default theme
export { darkTech as defaultTheme };

// Helper hook for spring animation
export const useSpring = (frameOffset: number = 0, config = darkTech.animation.spring) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return spring({
    frame: frame - frameOffset,
    fps,
    config,
  });
};
