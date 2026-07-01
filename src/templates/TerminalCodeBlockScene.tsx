import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme, useSpring } from '../theme';

interface TerminalCodeBlockSceneProps {
  title?: string;
  category?: string;
  accentColor?: string;
  commands: string[];
  transparent?: boolean;
  theme?: Theme;
}

export const TerminalCodeBlockScene: React.FC<TerminalCodeBlockSceneProps> = ({
  title,
  category,
  accentColor,
  commands,
  transparent = true,
  theme = defaultTheme,
}) => {
  const frame = useCurrentFrame();
  const effectiveAccentColor = accentColor ?? theme.colors.primary;

  const totalChars = commands.reduce((sum, c) => sum + c.length, 0);
  const charsPerCommand = commands.map(c => c.length);
  const typingDuration = 50;
  const totalTyped = Math.min(Math.floor((frame / typingDuration) * totalChars), totalChars);

  let remaining = totalTyped;
  const typedCommands = charsPerCommand.map((len) => {
    const typed = Math.min(remaining, len);
    remaining = Math.max(0, remaining - len);
    return typed;
  });

  const isTypingDone = totalTyped >= totalChars;
  const cursorVisible = isTypingDone ? Math.sin(frame * 0.15) > 0 : true;

  const windowScale = spring({ frame, fps: 30, config: { damping: 15, mass: 0.4, stiffness: 130 } });
  const titleSpring = useSpring(5, theme.animation.spring);
  const categorySpring = useSpring(3, theme.animation.spring);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparent ? 'transparent' : theme.colors.bg,
        padding: 80,
        paddingTop: title ? 600 : 560,
      }}
    >
      {category && (
        <div
          style={{
            color: theme.colors.muted,
            fontFamily: theme.typography.label,
            fontSize: theme.typography.sizes.label,
            fontWeight: theme.typography.weights.bold,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: theme.layout.gap.md,
            opacity: categorySpring,
          }}
        >
          — {category}
        </div>
      )}

      {title && (
        <div
          style={{
            fontFamily: theme.typography.headline,
            fontSize: theme.typography.sizes.headline,
            fontWeight: theme.typography.weights.black,
            lineHeight: theme.layout.lineHeight.tight,
            color: theme.colors.text,
            marginBottom: theme.layout.gap.xl,
            opacity: titleSpring,
            transform: `scale(${0.8 + 0.2 * titleSpring})`,
          }}
        >
          {renderHighlightedText(title, effectiveAccentColor)}
        </div>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: 960,
          backgroundColor: '#1A1B2E',
          borderRadius: 14,
          border: '1px solid #2A2D45',
          overflow: 'hidden',
          transform: `scale(${windowScale})`,
          opacity: windowScale,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 20px',
            background: 'linear-gradient(180deg, #252840 0%, #1E2138 100%)',
            borderBottom: '1px solid #2A2D45',
          }}
        >
          <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#FF5F57', marginRight: 9 }} />
          <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#FFBD2E', marginRight: 9 }} />
          <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#28C840', marginRight: 20 }} />
          <span style={{ color: '#6B6E8A', fontFamily: theme.typography.mono, fontSize: 14, letterSpacing: 0.5 }}>
            Terminal
          </span>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {commands.map((cmd, cmdIdx) => (
            <div key={cmdIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: cmdIdx < commands.length - 1 ? 8 : 0 }}>
              <span style={{ color: theme.colors.primary, fontFamily: theme.typography.mono, fontSize: 24, marginRight: 14, fontWeight: 700 }}>
                {'>'}
              </span>
              <span style={{ color: theme.colors.text, fontFamily: theme.typography.mono, fontSize: 24 }}>
                {cmd.substring(0, typedCommands[cmdIdx])}
              </span>
              {cmdIdx === commands.length - 1 && cursorVisible && (
                <span style={{ color: theme.colors.primary, fontFamily: theme.typography.mono, fontSize: 24, marginLeft: 3, opacity: 0.9 }}>
                  ▊
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
