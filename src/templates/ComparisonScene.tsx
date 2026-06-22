import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneContainer, AnimatedText, Card } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme } from '../theme';

interface ComparisonSceneProps {
  centerTitle?: string;
  topTitle: string;
  topItems: string[];
  topConclusion?: string;
  bottomTitle: string;
  bottomItems: string[];
  bottomConclusion?: string;
  topAccentColor?: string;
  bottomAccentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
  centerTitle,
  topTitle,
  topItems,
  topConclusion,
  bottomTitle,
  bottomItems,
  bottomConclusion,
  topAccentColor,
  bottomAccentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const effectiveTopAccentColor = topAccentColor ?? theme.colors.primary;
  const effectiveBottomAccentColor = bottomAccentColor ?? theme.colors.success;

  // Animation for line under centerTitle
  const lineSpring = spring({
    frame: frame - 15,
    fps,
    config: theme.animation.springFast,
  });
  const lineWidth = interpolate(lineSpring, [0, 1], [0, 80]);

  // Animation for vertical divider
  const dividerSpring = spring({
    frame: frame - 20,
    fps,
    config: theme.animation.springFast,
  });
  const dividerHeight = interpolate(dividerSpring, [0, 1], [0, 1]);

  // Exit animation for entire scene
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <SceneContainer
      align="left"
      noPadding
      transparent={transparent}
      theme={theme}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingTop: 400,
        paddingBottom: 400,
        opacity: exitOpacity,
      }}>

        {/* Center Title */}
        {centerTitle && (
          <div style={{ textAlign: 'center', paddingLeft: theme.layout.framePadding, paddingRight: theme.layout.framePadding, marginBottom: theme.layout.gap.lg }}>
            <AnimatedText delay={5} type="zoom" style={{
              fontFamily: theme.typography.headline,
              fontSize: 110,
              fontWeight: theme.typography.weights.black,
              lineHeight: 1.05,
              color: theme.colors.text,
            }}>
              {renderHighlightedText(centerTitle, effectiveTopAccentColor)}
            </AnimatedText>
            <div style={{ width: lineWidth, height: 5, backgroundColor: effectiveTopAccentColor, margin: '20px auto 0'}} />
          </div>
        )}

        {/* 2-Column Body */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Titles row — shared height = tallest title */}
          <div style={{ display: 'flex', flexDirection: 'row', flexShrink: 0 }}>
            <div style={{ flex: 1, paddingLeft: theme.layout.framePadding, paddingRight: 48 }}>
              <AnimatedText delay={10} type="slide" style={{
                fontFamily: theme.typography.headline,
                fontSize: theme.typography.sizes.subheadline,
                fontWeight: theme.typography.weights.black,
                lineHeight: 1.05,
                color: theme.colors.text,
                marginBottom: theme.layout.gap.lg,
              }}>
                {renderHighlightedText(topTitle, effectiveTopAccentColor)}
              </AnimatedText>
            </div>
            <div style={{ width: 48, flexShrink: 0 }} />
            <div style={{ flex: 1, paddingLeft: 48, paddingRight: theme.layout.framePadding }}>
              <AnimatedText delay={18} type="slide" style={{
                fontFamily: theme.typography.headline,
                fontSize: theme.typography.sizes.subheadline,
                fontWeight: theme.typography.weights.black,
                lineHeight: 1.05,
                color: theme.colors.text,
                marginBottom: theme.layout.gap.lg,
              }}>
                {renderHighlightedText(bottomTitle, effectiveBottomAccentColor)}
              </AnimatedText>
            </div>
          </div>

          {/* Items row — starts at same Y for both sides */}
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <div style={{ flex: 1, paddingLeft: theme.layout.framePadding, paddingRight: 48 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.layout.gap.md }}>
                {topItems.map((item, i) => (
                  <Card key={i} accentColor={effectiveTopAccentColor} delay={20 + i * 6} padding={20} theme={theme}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <span style={{ color: effectiveTopAccentColor, fontSize: theme.typography.sizes.label, lineHeight: 1.4, flexShrink: 0 }}>—</span>
                      <span style={{
                        color: theme.colors.muted,
                        fontFamily: theme.typography.body,
                        fontSize: theme.typography.sizes.body,
                        fontWeight: theme.typography.weights.normal,
                        lineHeight: 1.45,
                      }}>{item}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div style={{
              width: 3,
              backgroundColor: theme.colors.divider,
              alignSelf: 'stretch',
              transform: `scaleY(${dividerHeight})`,
              transformOrigin: 'top',
            }} />

            <div style={{ flex: 1, paddingLeft: 48, paddingRight: theme.layout.framePadding }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.layout.gap.md }}>
                {bottomItems.map((item, i) => (
                  <Card key={i} accentColor={effectiveBottomAccentColor} delay={28 + i * 6} padding={20} theme={theme}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <span style={{ color: effectiveBottomAccentColor, fontSize: theme.typography.sizes.label, lineHeight: 1.4, flexShrink: 0 }}>—</span>
                      <span style={{
                        color: theme.colors.muted,
                        fontFamily: theme.typography.body,
                        fontSize: theme.typography.sizes.body,
                        fontWeight: theme.typography.weights.normal,
                        lineHeight: 1.45,
                      }}>{item}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Conclusions row — shared start Y */}
          {(topConclusion || bottomConclusion) && (
            <div style={{ display: 'flex', flexDirection: 'row', flexShrink: 0, marginTop: theme.layout.gap.xl }}>
              <div style={{ flex: 1, paddingLeft: theme.layout.framePadding, paddingRight: 48 }}>
                {topConclusion && (
                  <AnimatedText delay={40} type="slide" style={{
                    fontFamily: theme.typography.headline,
                    fontSize: 44,
                    fontWeight: theme.typography.weights.black,
                    lineHeight: 1.1,
                    color: effectiveTopAccentColor,
                    paddingTop: 32,
                    borderTop: `3px solid ${effectiveTopAccentColor}22`,
                  }}>
                    {topConclusion}
                  </AnimatedText>
                )}
              </div>
              <div style={{ width: 48 + 3, flexShrink: 0 }} />
              <div style={{ flex: 1, paddingLeft: 48, paddingRight: theme.layout.framePadding }}>
                {bottomConclusion && (
                  <AnimatedText delay={48} type="slide" style={{
                    fontFamily: theme.typography.headline,
                    fontSize: 44,
                    fontWeight: theme.typography.weights.black,
                    lineHeight: 1.1,
                    color: effectiveBottomAccentColor,
                    paddingTop: 32,
                    borderTop: `3px solid ${effectiveBottomAccentColor}22`,
                  }}>
                    {bottomConclusion}
                  </AnimatedText>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </SceneContainer>
  );
};
