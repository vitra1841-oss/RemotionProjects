import React from 'react';
import { interpolate } from 'remotion';
import { useSpring } from '../theme';
import { useTheme } from './SceneContainer';

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'fade' | 'slide' | 'zoom';
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  children, 
  delay = 0, 
  type = 'fade',
  className = "",
  style = {},
}) => {
  const theme = useTheme();
  const springValue = useSpring(delay, theme.animation.spring);
  
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  
  let transform = '';
  if (type === 'slide') {
    transform = `translateY(${interpolate(springValue, [0, 1], [20, 0])}px)`;
  } else if (type === 'zoom') {
    transform = `scale(${interpolate(springValue, [0, 1], [0.8, 1])})`;
  }

  return (
    <div
      className={className}
      style={{
        opacity,
        transform,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
