import React, { useState } from 'react';
import {
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme, useSpring } from '../theme';

interface TitleMediaSceneProps {
  title: string;
  category?: string;
  subtitle?: string;
  mediaSrc: string;
  mediaType?: 'image' | 'video';
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
  videoStartFrom?: number;
  videoMuted?: boolean;
}

export const TitleMediaScene: React.FC<TitleMediaSceneProps> = ({
  title,
  category,
  subtitle,
  mediaSrc,
  mediaType = 'image',
  accentColor,
  transparent = false,
  theme = defaultTheme,
  videoStartFrom,
  videoMuted = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const effectiveAccentColor = accentColor ?? theme.colors.primary;
  const [mediaError, setMediaError] = useState(false);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const maxMediaWidth = 1000;
  const mediaMinHeight = Math.round(maxMediaWidth / 2);
  const mediaMaxHeight = Math.round(maxMediaWidth * 0.8);

  const titleSpring = useSpring(8, theme.animation.spring);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);

  const mediaSpring = useSpring(18, theme.animation.springSlow);
  const mediaOpacity = interpolate(mediaSpring, [0, 1], [0, 1]);
  const mediaScale = interpolate(mediaSpring, [0, 1], [0.95, 1]);

  const cornerBracket = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 32,
      height: 32,
      borderColor: effectiveAccentColor,
      borderStyle: 'solid',
      borderWidth: 0,
    };
    switch (pos) {
      case 'tl':
        return { ...base, top: -3, left: -3, borderTopWidth: 5, borderLeftWidth: 5, borderRadius: '14px 0 0 0' };
      case 'tr':
        return { ...base, top: -3, right: -3, borderTopWidth: 5, borderRightWidth: 5, borderRadius: '0 14px 0 0' };
      case 'bl':
        return { ...base, bottom: -3, left: -3, borderBottomWidth: 5, borderLeftWidth: 5, borderRadius: '0 0 0 14px' };
      case 'br':
        return { ...base, bottom: -3, right: -3, borderBottomWidth: 5, borderRightWidth: 5, borderRadius: '0 0 14px 0' };
    }
  };

  return (
    <SceneContainer
      align="left"
      noPadding
      transparent={transparent}
      theme={theme}
      style={{ opacity: exitOpacity, padding: '96px 0 0 0' }}
    >
      {/* Title section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          paddingTop: 180,
          paddingLeft: theme.layout.framePadding,
          paddingRight: theme.layout.framePadding,
        }}
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
            marginBottom: subtitle ? theme.layout.gap.lg : 0,
          }}
        >
          {renderHighlightedText(title, effectiveAccentColor)}
        </div>

        {subtitle && (
          <AnimatedText
            delay={20}
            type="slide"
            style={{
              color: theme.colors.muted,
              fontFamily: theme.typography.body,
              fontSize: 38,
              fontWeight: theme.typography.weights.normal,
              lineHeight: theme.layout.lineHeight.normal,
            }}
          >
            {subtitle}
          </AnimatedText>
        )}
      </div>

      {/* Media section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: 90,
        }}
      >
        <div
          style={{
            opacity: mediaOpacity,
            transform: `scale(${mediaScale})`,
            position: 'relative',
            width: maxMediaWidth,
            minHeight: mediaMinHeight,
            maxHeight: mediaMaxHeight,
            overflow: 'hidden',
            borderRadius: 12,
          }}
        >
          {mediaError ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: theme.colors.divider,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  color: theme.colors.muted,
                  fontFamily: theme.typography.body,
                  fontSize: 24,
                }}
              >
                Media not found
              </span>
            </div>
          ) : mediaType === 'video' ? (
            <OffthreadVideo
              src={staticFile(mediaSrc)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 12,
              }}
              startFrom={videoStartFrom ?? 0}
              muted={videoMuted}
            />
          ) : (
            <Img
              src={staticFile(mediaSrc)}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 12,
                objectFit: 'contain',
              }}
              onError={() => setMediaError(true)}
            />
          )}

          <div style={cornerBracket('tl')} />
          <div style={cornerBracket('tr')} />
          <div style={cornerBracket('bl')} />
          <div style={cornerBracket('br')} />

          {mediaType === 'video' && !mediaError && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: effectiveAccentColor,
                opacity: 0.4,
              }}
            />
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
