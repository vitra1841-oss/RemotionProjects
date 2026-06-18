import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme } from '../theme';
import { useSpring } from '../theme';

interface TitleSceneProps {
  title: string;
  category?: string;
  subtitle?: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;

  // Animation timing
  start?: number; // Time in seconds from start of video
  sequenceFrom?: number; // Frame where this sequence starts in the video
}

export const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  category,
  subtitle,
  accentColor,
  transparent = false,
  theme = defaultTheme,
  start,
  sequenceFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const effectiveAccentColor = accentColor ?? theme.colors.primary;

  // Exit animation
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Title entrance animation
  const titleSpring = useSpring(10, theme.animation.spring);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);

  // Highlight animation logic for scale up/scale down
  // Calculate time from start of video (absolute time)
  const effectiveStartTime = start ?? 0;
  const effectiveEndTime = effectiveStartTime + 0.5;
  const currentTime = (sequenceFrom + frame) / fps;

  const isActive = currentTime >= effectiveStartTime && currentTime < effectiveEndTime;
  const isPast = currentTime >= effectiveEndTime;

  let springValue;
  if (isActive) {
    springValue = spring({
      frame: (currentTime - effectiveStartTime) * fps,
      fps,
      config: defaultTheme.animation.springFast,
    });
  } else if (isPast) {
    springValue = spring({
      frame: (currentTime - effectiveEndTime) * fps,
      fps,
      config: defaultTheme.animation.springFast,
    });
  } else {
    springValue = 0;
  }

  const highlightScale = interpolate(springValue, [0, 1], isPast ? [1.05, 1] : [1, 1.05]);

  return (
    <SceneContainer
      align="left"
      transparent={transparent}
      verticalAnchor={theme.layout.verticalAnchorLeft}
      theme={theme}
      style={{ opacity: exitOpacity }}
    >
      {category && (
        <AnimatedText
          delay={5}
          type="slide"
          style={{
            color: theme.colors.muted,
            fontFamily: theme.typography.label,
            fontSize: theme.typography.sizes.label,
            fontWeight: theme.typography.weights.bold,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: theme.layout.gap.md,
          }}
        >
          — {category}
        </AnimatedText>
      )}

      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          fontFamily: theme.typography.headline,
          color: theme.colors.text,
          fontSize: theme.typography.sizes.headline,
          fontWeight: theme.typography.weights.black,
          lineHeight: theme.layout.lineHeight.tight,
          marginBottom: theme.layout.gap.xl,
        }}
      >
        {renderHighlightedText(
          title,
          effectiveAccentColor,
          '#F8FAFC',
          highlightScale
        )}
      </div>

      {subtitle && (
        <AnimatedText
          delay={30}
          type="slide"
          style={{
            color: theme.colors.muted,
            fontFamily: theme.typography.body,
            fontSize: 42,
            fontWeight: theme.typography.weights.normal,
            lineHeight: theme.layout.lineHeight.normal,
          }}
        >
          {subtitle}
        </AnimatedText>
      )}
    </SceneContainer>
  );
};