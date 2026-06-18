import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface StatisticSceneProps {
  value: number;
  suffix?: string;
  label: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const StatisticScene: React.FC<StatisticSceneProps> = ({
  value,
  suffix = '',
  label,
  accentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const effectiveAccentColor = accentColor ?? theme.colors.success;

  const springValue = spring({
    frame: frame - 10,
    fps,
    config: theme.animation.springSlow,
  });

  const labelSpring = spring({
    frame: frame - 30,
    fps,
    config: theme.animation.springSlow,
  });

  // Animate number from 0 to value
  const currentValue = interpolate(springValue, [0, 1], [0, value], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparent ? 'transparent' : theme.colors.bg,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 0,
      }}>

        {/* Hero Number */}
        <div style={{
          opacity: springValue,
          transform: `scale(${interpolate(springValue, [0, 1], [0.5, 1])})`,
          fontFamily: theme.typography.headline,
          color: effectiveAccentColor,
          fontSize: theme.typography.sizes.hero,
          fontWeight: theme.typography.weights.black,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {Number.isInteger(value) ? Math.round(currentValue) : currentValue.toFixed(1)}
          {suffix}
        </div>

        {/* Thin line dưới */}
        <div style={{
          width: interpolate(springValue, [0, 1], [0, 120]),
          height: 3,
          backgroundColor: effectiveAccentColor,
          marginTop: theme.layout.gap.md,
          marginBottom: theme.layout.gap.md,
          opacity: 0.5,
        }} />

        {/* Main label */}
        <div style={{
          opacity: labelSpring,
          transform: `translateY(${interpolate(labelSpring, [0, 1], [20, 0])}px)`,
          fontFamily: theme.typography.body,
          color: theme.colors.muted,
          fontSize: 30,
          fontWeight: theme.typography.weights.normal,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </div>

      </div>
    </AbsoluteFill>
  );
};
