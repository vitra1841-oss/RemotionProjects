import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme, defaultTheme } from '../theme';
import { CountUp, Card } from '../components';

interface StatisticSceneProps {
  value: number;
  suffix?: string;
  eyebrow?: string;
  label: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const StatisticScene: React.FC<StatisticSceneProps> = ({
  value,
  suffix = '',
  eyebrow,
  label,
  accentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccentColor = accentColor ?? theme.colors.success;

  const labelSpring = spring({
    frame: frame - 30,
    fps,
    config: theme.animation.springSlow,
  });

  // Exit animation
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
        opacity: exitOpacity,
      }}>

        {/* Eyebrow above the number */}
        {eyebrow && (
          <div style={{
            opacity: interpolate(spring({ frame: frame - 5, fps, config: theme.animation.spring }), [0, 1], [0, 1]),
            transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: theme.animation.spring }), [0, 1], [15, 0])}px)`,
            fontFamily: theme.typography.body,
            color: theme.colors.text,
            fontSize: Math.round((theme.typography.sizes.body + 6) * wScale),
            fontWeight: theme.typography.weights.bold,
            marginBottom: theme.layout.gap.lg,
          }}>
            {eyebrow}
          </div>
        )}

        {/* Hero Number with CountUp component */}
        <Card 
          accentColor={effectiveAccentColor} 
          glow={true}
          padding={Math.round(48 * wScale)}
          delay={5}
          theme={theme}
        >
          <CountUp
            value={value}
            suffix={suffix}
            accentColor={effectiveAccentColor}
            delay={10}
            theme={theme}
          />
        </Card>

        {/* Subtitle below the number */}
        <div style={{
          opacity: labelSpring,
          transform: `translateY(${interpolate(labelSpring, [0, 1], [20, 0])}px)`,
          fontFamily: theme.typography.body,
          color: theme.colors.muted,
          fontSize: Math.round(30 * wScale),
          fontWeight: theme.typography.weights.normal,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: theme.layout.gap.xl,
        }}>
          {label}
        </div>

      </div>
    </AbsoluteFill>
  );
};
