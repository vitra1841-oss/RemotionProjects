import React, { createContext, useContext } from 'react';
import { AbsoluteFill } from 'remotion';
import { Theme, defaultTheme } from '../theme';

export const ThemeContext = createContext<Theme>(defaultTheme);
export const useTheme = () => useContext(ThemeContext);

export type SceneAlign = 'left' | 'center';

interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
  align?: SceneAlign;
  verticalAnchor?: number; // 0–1, fraction of frame height where content starts. Default 0.38
  transparent?: boolean; // When true, backgroundColor is transparent to show BackgroundLayer underneath
  theme?: Theme;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({ 
  children, 
  className = "", 
  style = {},
  noPadding = false,
  align = 'left',
  verticalAnchor = 0.38,
  transparent = false,
  theme = defaultTheme,
}) => {
  const FRAME_HEIGHT = 1920;
  const HORIZONTAL_PADDING = theme.layout.framePadding;
  const VERTICAL_PADDING_BOTTOM = 96;
  // For left-align: push content down to verticalAnchor position
  // For center: use flexbox centering instead
  const computedPaddingTop = align === 'left'
    ? Math.round(FRAME_HEIGHT * verticalAnchor)
    : 0;

  const containerStyle: React.CSSProperties = noPadding
    ? {}
    : {
        paddingLeft: HORIZONTAL_PADDING,
        paddingRight: HORIZONTAL_PADDING,
        paddingTop: align === 'left' ? computedPaddingTop : 0,
        paddingBottom: VERTICAL_PADDING_BOTTOM,
      };

  const backgroundColor = transparent ? 'transparent' : theme.colors.bg;

  const alignClass = align === 'center'
    ? 'flex flex-col items-center justify-center'
    : 'flex flex-col items-start justify-start';

  return (
    <ThemeContext.Provider value={theme}>
      <AbsoluteFill
        className={`${alignClass} ${className}`}
        style={{
          backgroundColor,
          color: theme.colors.text,
          fontFamily: theme.typography.headline,
          position: 'relative',
          overflow: 'hidden',
          ...containerStyle,
          ...style,
        }}
      >
        {children}
      </AbsoluteFill>
    </ThemeContext.Provider>
  );
};
