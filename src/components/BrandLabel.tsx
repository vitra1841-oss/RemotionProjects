import React from 'react';
import { useVideoConfig } from 'remotion';
import { Theme, defaultTheme } from '../theme';

interface BrandLabelProps {
  text: string;
  theme?: Theme;
}

export const BrandLabel: React.FC<BrandLabelProps> = ({
  text,
  theme = defaultTheme,
}) => {
  const { width } = useVideoConfig();
  const wScale = width / 1080;

  return (
    <div
      style={{
        position: 'absolute',
        top: Math.round(48 * wScale),
        right: Math.round(64 * wScale),
        color: theme.colors.muted,
        fontFamily: theme.typography.label,
        fontSize: Math.round((theme.typography.sizes.caption) * wScale),
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
};
