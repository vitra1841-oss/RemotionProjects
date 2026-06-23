import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme } from '../theme';

interface OutroSceneProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const OutroScene: React.FC<OutroSceneProps> = ({ 
  title, 
  subtitle,
  accentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccentColor = accentColor ?? theme.colors.primary;
  
  // Fade to black at the end
  const exitFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer 
      align="center"
      transparent={transparent}
      theme={theme}
    >

      {/* Main title */}
      <AnimatedText
        delay={10}
        type="zoom"
        style={{
          fontFamily: theme.typography.headline,
          color: theme.colors.text,
          fontSize: theme.typography.sizes.headline,
          fontWeight: theme.typography.weights.black,
          lineHeight: 0.95,
          textAlign: 'center',
          marginBottom: theme.layout.gap.xl,
        }}
      >
        {renderHighlightedText(title, effectiveAccentColor)}
      </AnimatedText>

      {/* Subtitle */}
      {subtitle && (
        <AnimatedText
          delay={30}
          type="slide"
          style={{
            color: theme.colors.muted,
            fontFamily: theme.typography.body,
            fontSize: Math.round(36 * wScale),
            fontWeight: theme.typography.weights.normal,
            textAlign: 'center',
            marginTop: Math.round(15 * wScale),
            letterSpacing: '0.05em',
          }}
        >
          {subtitle}
        </AnimatedText>
      )}

      {/* Thin line dưới title */}
      <AnimatedText delay={20} type="fade" style={{}}>
        <div style={{
          width: Math.round(90 * wScale),
          height: Math.round(3 * wScale),
          backgroundColor: effectiveAccentColor,
          marginTop: theme.layout.gap.lg,
          opacity: 0.6,
        }} />
      </AnimatedText>

      {/* CTA nhỏ phía dưới */}
      <AnimatedText
        delay={45}
        type="slide"
        style={{
          color: effectiveAccentColor,
          fontFamily: theme.typography.body,
          fontSize: theme.typography.sizes.caption,
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: theme.layout.gap.xl,
        }}
      >
        Like · Follow · Share
      </AnimatedText>

      {/* Exit Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: theme.colors.bg,
          opacity: exitFade,
        }}
      />
    </SceneContainer>
  );
};
