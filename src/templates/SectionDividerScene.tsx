import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme } from '../theme';

interface SectionDividerSceneProps {
  title: string;
  eyebrow?: string;
  tagline?: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const SectionDividerScene: React.FC<SectionDividerSceneProps> = ({
  title,
  eyebrow,
  tagline,
  accentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccentColor = accentColor ?? theme.colors.accent;

  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: theme.animation.springSlow,
  });

  const opacity = interpolate(textSpring, [0, 1], [0, 1]);
  const scale = interpolate(textSpring, [0, 1], [0.95, 1]);

  // Exit animation
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      align="center"
      transparent={transparent}
      theme={theme}
      style={{ opacity: exitOpacity }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Eyebrow label */}
        {eyebrow && (
          <div style={{
            color: effectiveAccentColor,
            fontFamily: theme.typography.label,
            fontSize: Math.round(26 * wScale),
            fontWeight: theme.typography.weights.bold,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: theme.layout.gap.xl,
          }}>
            {eyebrow}
          </div>
        )}

        {/* Top line — dài hơn, dày hơn */}
        <div style={{
          width: Math.round(200 * wScale),
          height: Math.round(3 * wScale),
          backgroundColor: effectiveAccentColor,
          marginBottom: theme.layout.gap.xl,
        }} />

        {/* Main title */}
        <AnimatedText
          delay={15}
          type="zoom"
          style={{
            fontFamily: theme.typography.headline,
            color: theme.colors.text,
            fontSize: theme.typography.sizes.hero,
            fontWeight: theme.typography.weights.black,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {renderHighlightedText(title, effectiveAccentColor)}
        </AnimatedText>

        {/* Bottom line */}
        <div style={{
          width: Math.round(200 * wScale),
          height: Math.round(3 * wScale),
          backgroundColor: effectiveAccentColor,
          marginTop: theme.layout.gap.xl,
          marginBottom: tagline ? theme.layout.gap.lg : 0,
        }} />

        {/* Tagline */}
        {tagline && (
          <div style={{
            color: theme.colors.muted,
            fontFamily: theme.typography.body,
            fontSize: Math.round(34 * wScale),
            fontWeight: theme.typography.weights.normal,
            letterSpacing: '0.05em',
            lineHeight: 1.5,
            maxWidth: Math.round(700 * wScale),
            opacity: 0.9,
          }}>
            {tagline}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
