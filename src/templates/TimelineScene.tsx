import React, { useRef, useState, useLayoutEffect } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneContainer, AnimatedText, Card } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme, useSpring } from '../theme';


interface TimelineSceneItem {
  primary: string;
  secondary: string;
  start: number;
}

interface TimelineSceneProps {
  title?: string;
  items: TimelineSceneItem[];
  titleAccentColor?: string;
  itemsAccentColor?: string;
  transparent?: boolean;
  theme?: Theme;
  sequenceFrom?: number;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  title,
  items,
  titleAccentColor,
  itemsAccentColor,
  transparent = false,
  theme = defaultTheme,
  sequenceFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const effectiveTitleAccent = titleAccentColor ?? theme.colors.primary;
  const effectiveItemsAccent = itemsAccentColor ?? theme.colors.accent;

  if (items.length > 5) {
    console.warn(
      `[TimelineScene] items.length (${items.length}) > 5 may cause layout overflow. ` +
        'Split content into multiple TimelineScene instances.'
    );
  }

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const titleDividerSpring = useSpring(10, theme.animation.spring);
  const titleDividerOpacity = interpolate(titleDividerSpring, [0, 1], [0, 1]);
  const titleDividerScaleX = interpolate(titleDividerSpring, [0, 1], [0, 1]);

  const itemGap =
    items.length <= 3
      ? theme.layout.gap.xl
      : items.length <= 5
        ? theme.layout.gap.lg
        : theme.layout.gap.md;

  const currentTime = (sequenceFrom + frame) / fps;

  const wScale = width / 1080;
  const dotColumnWidth = Math.round(40 * wScale);
  const dotSize = Math.round(40 * wScale);
  const cardPadding = Math.round(28 * wScale);
  const primaryLineHeightPx = theme.typography.sizes.subheadline * 1.35 * wScale;
  const dotPaddingTop = cardPadding + Math.round((primaryLineHeightPx - dotSize) / 2);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemHeights, setItemHeights] = useState<number[]>([]);

  useLayoutEffect(() => {
    setItemHeights(itemRefs.current.map((el) => el?.offsetHeight ?? 0));
  }, [items]);

  const itemSpringData = items.map((item) => {
    const safeStart = !item.start || isNaN(item.start) ? 0 : item.start;
    const isActive = currentTime >= safeStart;
    const springVal = isActive
      ? spring({
          frame: (currentTime - safeStart) * fps,
          fps,
          config: theme.animation.springSlow,
        })
      : 0;
    const opacity = interpolate(springVal, [0, 1], [0, 1]);
    const translateY = interpolate(springVal, [0, 1], [20, 0]);
    return { safeStart, springVal, opacity, translateY };
  });

  const heightsReady = itemHeights.length === items.length && items.length > 0;

  const cumulativeOffsets: number[] = [];
  if (heightsReady) {
    let offset = theme.layout.gap.lg;
    for (let i = 0; i < items.length; i++) {
      cumulativeOffsets.push(offset);
      if (i < items.length - 1) {
        offset += itemHeights[i] + itemGap;
      }
    }
  }

  return (
    <SceneContainer
      align="left"
      transparent={transparent}
      theme={theme}
      style={{ paddingTop: title ? Math.round(height * 0.14) : Math.round(height * 0.0625), opacity: exitOpacity }}
    >
      {title && (
        <>
          <AnimatedText
            delay={5}
            type="slide"
            style={{
              fontFamily: theme.typography.headline,
              fontSize: theme.typography.sizes.headline,
              fontWeight: theme.typography.weights.black,
              lineHeight: theme.layout.lineHeight.tight,
              color: theme.colors.text,
              marginBottom: theme.layout.gap.sm,
            }}
          >
            {renderHighlightedText(title, effectiveTitleAccent)}
          </AnimatedText>
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              width: '50%',
              marginTop: theme.layout.gap.md,
              marginBottom: theme.layout.gap.md,
              opacity: titleDividerOpacity,
              transform: `scaleX(${titleDividerScaleX})`,
              transformOrigin: 'left',
            }}
          >
            <div
              style={{
                height: Math.round(3 * wScale),
                backgroundColor: effectiveTitleAccent,
                width: '60%',
              }}
            />
          </div>
        </>
      )}

      {items.length > 0 && (
        <div style={{ position: 'relative', width: '100%', paddingLeft: dotColumnWidth + theme.layout.gap.md }}>
          {heightsReady && itemSpringData.slice(0, -1).map((_data, i) => {
            const segmentTop = cumulativeOffsets[i] + dotPaddingTop + dotSize / 2;
            const segmentHeight = cumulativeOffsets[i + 1] - cumulativeOffsets[i];
            const lineScaleY = interpolate(
              itemSpringData[i + 1].springVal,
              [0.3, 1],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={`line-${i}`}
                style={{
                  position: 'absolute',
                  left: dotColumnWidth / 2 - Math.round(1 * wScale),
                  top: segmentTop,
                  width: Math.round(3 * wScale),
                  height: segmentHeight,
                  backgroundColor: theme.colors.divider,
                  transform: `scaleY(${lineScaleY})`,
                  transformOrigin: 'top',
                }}
              />
            );
          })}

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {items.map((item, i) => {
              const { translateY } = itemSpringData[i];

              return (
                <div
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  style={{
                    position: 'relative',
                    transform: `translateY(${translateY}px)`,
                    marginTop: i === 0 ? theme.layout.gap.lg : 0,
                    marginBottom: i < items.length - 1 ? itemGap : 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -(dotColumnWidth + theme.layout.gap.md),
                      top: 0,
                      width: dotColumnWidth,
                      paddingTop: dotPaddingTop,
                      display: 'flex',
                      justifyContent: 'center',
                      opacity: interpolate(itemSpringData[i].springVal, [0, 1], [0, 1]),
                    }}
                  >
                    <div
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        border: `${Math.round(2 * wScale)}px solid ${theme.colors.divider}`,
                        backgroundColor: theme.colors.bg,
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: Math.round(2 * wScale),
                          left: Math.round(2 * wScale),
                          right: Math.round(2 * wScale),
                          bottom: Math.round(2 * wScale),
                          borderRadius: '50%',
                          backgroundColor: effectiveTitleAccent,
                          opacity: interpolate(itemSpringData[i].springVal, [0, 1], [0, 1]),
                        }}
                      />
                    </div>
                  </div>

                  <Card
                    accentColor={effectiveItemsAccent}
                    glow={false}
                    padding={cardPadding}
                    delay={Math.round(Math.max(0, itemSpringData[i].safeStart * fps - sequenceFrom))}
                    theme={theme}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: theme.typography.body,
                          fontSize: theme.typography.sizes.subheadline,
                          fontWeight: theme.typography.weights.bold,
                          lineHeight: 1.35,
                          color: theme.colors.text,
                        }}
                      >
                        {renderHighlightedText(item.primary, effectiveItemsAccent)}
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
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SceneContainer>
  );
};
