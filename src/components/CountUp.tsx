import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { Theme, defaultTheme } from '../theme';

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
  const { fps } = useVideoConfig();
  const effectiveAccent = accentColor ?? theme.colors.primary;

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
        fontSize: fontSize || theme.typography.sizes.hero,
        fontWeight: theme.typography.weights.black,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}
    >
      {Number.isInteger(value) ? Math.round(currentValue) : currentValue.toFixed(1)}
      {suffix}
    </span>
  );
};
