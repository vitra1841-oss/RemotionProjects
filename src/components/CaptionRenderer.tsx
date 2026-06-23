import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

interface CaptionChunk {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
}

interface CaptionRendererProps {
  src: string; // staticFile path, e.g. staticFile('captions/m5.json')
  theme?: Theme;
  accentColor?: string;
  fontSize?: number;
  bottom?: number;
}

export const CaptionRenderer: React.FC<CaptionRendererProps> = ({
  src,
  theme = defaultTheme,
  accentColor,
  fontSize,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wScale = width / 1080;
  const currentTime = frame / fps;
  const effectiveAccent = accentColor ?? theme.colors.primary;
  const effectiveFontSize = fontSize ?? Math.round(48 * wScale);
  const effectiveBottom = bottom ?? Math.round(250 * wScale);

  const [captions, setCaptions] = React.useState<CaptionChunk[]>([]);

  React.useEffect(() => {
    fetch(src)
        .then((r) => {
        if (!r.ok) return;
        return r.json();
        })
        .then((data) => {
        if (data) setCaptions(data);
        })
        .catch(() => {});
    }, [src]);

  const activeChunk = captions.find(
    (chunk) => currentTime >= chunk.start && currentTime < chunk.end
  );

  if (!activeChunk) return null;

  const fadeOpacity = Math.min((currentTime - activeChunk.start) / 0.1, 1);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: effectiveBottom,
          left: theme.layout.framePadding,
          right: theme.layout.framePadding,
          textAlign: 'center',
          opacity: fadeOpacity,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: '0.8em',
            wordSpacing: '0.1em',
            maxWidth: '80%',
            borderRadius: Math.round(16 * wScale),
            paddingTop: Math.round(18 * wScale),
            paddingBottom: Math.round(18 * wScale),
            paddingLeft: Math.round(32 * wScale),
            paddingRight: Math.round(32 * wScale),
          }}
        >
          {activeChunk.words.map((w, i) => {
            const isActive = currentTime >= w.start && currentTime < w.end;

            return (
              <span
                key={i}
                style={{
                  fontFamily: theme.typography.body,
                  fontSize: effectiveFontSize,
                  fontWeight: isActive
                    ? theme.typography.weights.bold
                    : theme.typography.weights.normal,
                  color: isActive ? effectiveAccent : theme.colors.text,
                  lineHeight: 1.4,
                  display: 'inline-block',
                }}
              >
                {w.word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};