import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { Theme, defaultTheme } from '../theme';

const formatNumber = (n: number): string => {
  return Math.round(n).toLocaleString('en-US');
};

interface CountUpProps {
  value: number;
  suffix?: string;
  fontSize?: number;
  accentColor?: string;
  delay?: number;
  theme?: Theme;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  suffix = '',
  fontSize,
  accentColor,
  delay = 10,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccent = accentColor ?? theme.colors.primary;
  const effectiveFontSize = fontSize ?? theme.typography.sizes.hero;
  const scaledFontSize = Math.round(effectiveFontSize * wScale);

  const springValue = spring({
    frame: frame - delay,
    fps,
    config: theme.animation.springSlow,
  });

  const currentValue = interpolate(springValue, [0, 1], [0, value], {
    easing: Easing.out(Easing.quad),
  });

  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const scale = interpolate(springValue, [0, 1], [0.5, 1]);

  return (
    <span
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontFamily: theme.typography.headline,
        color: effectiveAccent,
        fontSize: scaledFontSize,
        fontWeight: theme.typography.weights.black,
        lineHeight: Math.round(1 * wScale),
        letterSpacing: '-0.02em',
      }}
    >
      {formatNumber(currentValue)}
      {suffix}
    </span>
  );
};
