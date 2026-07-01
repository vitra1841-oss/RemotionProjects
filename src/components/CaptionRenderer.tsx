import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface WordInfo {
  word: string;
  start: number;
  end: number;
}

interface CaptionChunk {
  text: string;
  start: number;
  end: number;
  words: WordInfo[];
}

interface CaptionRendererProps {
  src: string;
  theme?: Theme;
  fontSize?: number;
  bottom?: number;
}

export const CaptionRenderer: React.FC<CaptionRendererProps> = ({
  src,
  theme = defaultTheme,
  fontSize,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const wScale = width / 1080;
  const currentTime = frame / fps;
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

  if (!activeChunk || !activeChunk.words) return null;

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
            display: 'inline-block',
            maxWidth: '100%',
            textAlign: 'center',
            fontFamily: theme.typography.body,
            fontSize: effectiveFontSize,
            lineHeight: 1.6,
            color: theme.colors.text,
            borderRadius: Math.round(16 * wScale),
            paddingTop: Math.round(18 * wScale),
            paddingBottom: Math.round(18 * wScale),
            paddingLeft: Math.round(32 * wScale),
            paddingRight: Math.round(32 * wScale),
          }}
        >
          {activeChunk.words.map((w, i) => {
            const isActive =
              currentTime >= w.start && currentTime < w.end;
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    color: isActive ? theme.colors.primary : 'inherit',
                  }}
                >
                  {w.word}
                </span>
                {i < activeChunk.words.length - 1 ? ' ' : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
