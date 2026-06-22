import React from 'react';
import { Theme, defaultTheme } from '../theme';

interface BrandLabelProps {
  text: string;
  theme?: Theme;
}

export const BrandLabel: React.FC<BrandLabelProps> = ({
  text,
  theme = defaultTheme,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        right: 64,
        color: theme.colors.muted,
        fontFamily: theme.typography.label,
        fontSize: theme.typography.sizes.caption,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
};
