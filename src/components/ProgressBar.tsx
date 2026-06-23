import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface ProgressBarProps {
  startTime?: number; // seconds when progress starts
  endTime?: number; // seconds when progress ends
  value?: number; // 0-100 (fallback if timing not provided)
  accentColor?: string;
  height?: number;
  showPercentage?: boolean;
  theme?: Theme;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  startTime,
  endTime,
  value,
  accentColor,
  showPercentage = true,
  height,
  
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccent = accentColor ?? theme.colors.primary;
  const effectiveHeight = height ?? Math.round(8 * wScale);

  let progress: number;

  if (startTime !== undefined && endTime !== undefined) {
    // Use timing-based progress
    const currentTime = frame / fps;
    const totalDuration = endTime - startTime;
    const elapsed = Math.max(0, currentTime - startTime);
    progress = Math.min(100, (elapsed / totalDuration) * 100);
  } else {
    // Use frame-based progress (fallback)
    const springValue = spring({
      frame: frame - 5,
      fps,
      config: theme.animation.springSlow,
    });
    progress = interpolate(springValue, [0, 1], [0, value ?? 100], {
      extrapolateRight: 'clamp',
    });
  }

  return (
    <div
      style={{
        width: '100%',
        height: effectiveHeight,
        backgroundColor: theme.colors.divider,
        borderRadius: effectiveHeight / 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: effectiveAccent,
          borderRadius: effectiveHeight / 2,
          transition: 'width 0.1s linear',
        }}
      />
      {showPercentage && (
        <div
          style={{
            position: 'absolute',
            right: Math.round(10 * wScale),
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: theme.typography.mono,
            fontSize: effectiveHeight * 0.8,
            color: theme.colors.text,
            fontWeight: theme.typography.weights.bold,
            textShadow: `0 0 4px ${theme.colors.bg}`,
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};
