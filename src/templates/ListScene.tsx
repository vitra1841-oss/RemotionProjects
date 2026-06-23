import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme, useSpring } from '../theme';

interface ListSceneProps {
  title?: string;
  items: { primary: string; secondary: string }[];
  variant?: 'numbered' | 'dash';
  accentColor?: string;
  primaryAccentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const ListScene: React.FC<ListSceneProps> = ({
  title,
  items,
  variant = 'dash',
  accentColor,
  primaryAccentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const wScale = width / 1080;
  const effectiveAccentColor = accentColor ?? theme.colors.primary;

  if (items.length > 4) {
    console.warn(
      `[ListScene] items.length (${items.length}) > 4 may cause layout overflow. ` +
        'Split content into multiple ListScene instances.'
    );
  }

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const firstItemDelay = title ? 30 : 10;
  const itemStagger = 7;

  const itemGap =
    items.length <= 3
      ? theme.layout.gap.xl + theme.layout.gap.lg
      : items.length <= 5
        ? theme.layout.gap.lg + theme.layout.gap.md
        : theme.layout.gap.md + theme.layout.gap.sm;

  const highlightColor = primaryAccentColor ?? theme.colors.subAccent1;
  const primaryLineHeightPx = theme.typography.sizes.subheadline * 1.35;
  const markerLineHeightPx = theme.typography.sizes.body * 1.4;
  const markerMarginTop = Math.max(0, (primaryLineHeightPx - markerLineHeightPx) / 2);

  const titleDividerSpring = useSpring(10, theme.animation.spring);
  const titleDividerOpacity = interpolate(titleDividerSpring, [0, 1], [0, 1]);
  const titleDividerScaleX = interpolate(titleDividerSpring, [0, 1], [0, 1]);

  return (
    <SceneContainer
      align="left"
      transparent={transparent}
      theme={theme}
      style={{ paddingTop: Math.round(300 * wScale), opacity: exitOpacity }}
    >
      {title && (
        <AnimatedText
          delay={5}
          type="slide"
          style={{
            fontFamily: theme.typography.headline,
            fontSize: theme.typography.sizes.headline,
            fontWeight: theme.typography.weights.black,
            lineHeight: theme.layout.lineHeight.tight,
            color: theme.colors.text,
            marginBottom: theme.layout.gap.lg,
          }}
        >
          {renderHighlightedText(title, effectiveAccentColor)}
        </AnimatedText>
      )}

      {title && (
        <div style={{ display: 'flex', justifyContent: 'left', width: '50%', marginTop: theme.layout.gap.sm, marginBottom: theme.layout.gap.xl, opacity: titleDividerOpacity, transform: `scaleX(${titleDividerScaleX})`, transformOrigin: 'left' }}>
          <div
            style={{
              height: Math.round(3 * wScale),
              backgroundColor: effectiveAccentColor,
              width: '60%',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {items.map((item, i) => (
          <div key={i}>
            {i > 0 && (() => {
              const dividerDelay = firstItemDelay + i * itemStagger - 3;
              const dividerSpringVal = spring({ frame: frame - dividerDelay, fps, config: theme.animation.spring });
              const dividerOpacity = interpolate(dividerSpringVal, [0, 1], [0, 1]);
              const dividerScaleX = interpolate(dividerSpringVal, [0, 1], [0, 1]);
              return (
                <div
                  style={{
                    marginTop: Math.floor(itemGap / 2),
                    marginBottom: Math.ceil(itemGap / 2),
                    opacity: dividerOpacity,
                    transform: `scaleX(${dividerScaleX})`,
                    transformOrigin: 'left',
                    height: Math.round(1 * wScale),
                    backgroundColor: theme.colors.divider,
                  }}
                />
              );
            })()}
            <AnimatedText
              delay={firstItemDelay + i * itemStagger}
              type="slide"
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: Math.round(14 * wScale) }}>
                <span
                  style={{
                    color: effectiveAccentColor,
                    fontFamily: theme.typography.body,
                    fontSize: theme.typography.sizes.body,
                    lineHeight: 1.4,
                    flexShrink: 0,
                    minWidth: Math.round(32 * wScale),
                    textAlign: 'right',
                    marginTop: markerMarginTop,
                  }}
                >
                  {variant === 'numbered'
                    ? `${(i + 1).toString().padStart(2, '0')}`
                    : '\u2014'}
                </span>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: theme.typography.body,
                      fontSize: theme.typography.sizes.subheadline,
                      fontWeight: theme.typography.weights.bold,
                      lineHeight: 1.35,
                      color: theme.colors.text,
                    }}
                  >
                    {renderHighlightedText(item.primary, highlightColor)}
                  </div>

                  <div
                    style={{
                      fontFamily: theme.typography.body,
                      fontSize: theme.typography.sizes.body,
                      fontWeight: theme.typography.weights.normal,
                      lineHeight: 1.45,
                      color: theme.colors.muted,
                      marginTop: Math.round(4 * wScale),
                    }}
                  >
                    {item.secondary}
                  </div>
                </div>
              </div>
            </AnimatedText>
          </div>
        ))}
      </div>
    </SceneContainer>
  );
};
