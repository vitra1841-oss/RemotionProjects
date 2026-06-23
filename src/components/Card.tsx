import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  accentColor?: string;
  glow?: boolean;
  padding?: number;
  borderRadius?: number;
  delay?: number;
  theme?: Theme;
}

export const Card: React.FC<CardProps> = ({
  children,
  accentColor,
  glow = false,
  padding,
  borderRadius,
  delay = 0,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccent = accentColor ?? theme.colors.primary;
  const effectivePadding = padding ?? Math.round(24 * wScale);
  const effectiveBorderRadius = borderRadius ?? Math.round(16 * wScale);

  const springValue = spring({
    frame: frame - delay,
    fps,
    config: theme.animation.springSlow,
  });

  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const scale = interpolate(springValue, [0, 1], [0.95, 1]);
  const glowOpacity = interpolate(springValue, [0, 1], [0, 0.15]);

  return (
    <div
      style={{
        opacity,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: effectiveBorderRadius,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          backgroundColor: `${theme.colors.divider}22`,
          border: `1px solid ${effectiveAccent}33`,
          borderRadius: effectiveBorderRadius,
          padding: effectivePadding,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {glow && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at center, ${effectiveAccent}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
