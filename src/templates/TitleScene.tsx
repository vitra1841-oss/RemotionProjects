import React from 'react';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { Theme, defaultTheme } from '../theme';

interface TitleSceneProps {
  title: string;
  category?: string;
  subtitle?: string;
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
}

export const TitleScene: React.FC<TitleSceneProps> = ({ 
  title, 
  category, 
  subtitle,
  accentColor,
  transparent = false,
  theme = defaultTheme,
}) => {
  const effectiveAccentColor = accentColor ?? theme.colors.primary;

  return (
    <SceneContainer 
      align="left" 
      transparent={transparent}
      verticalAnchor={theme.layout.verticalAnchorLeft}
      theme={theme}
    >
      {category && (
        <AnimatedText
          delay={5}
          type="slide"
          style={{ 
            color: theme.colors.muted,
            fontFamily: theme.typography.label,
            fontSize: theme.typography.sizes.label,
            fontWeight: theme.typography.weights.bold,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: theme.layout.gap.md,
          }}
        >
          — {category}
        </AnimatedText>
      )}
      
      <AnimatedText
        delay={10}
        type="zoom"
        style={{ 
          fontFamily: theme.typography.headline,
          color: theme.colors.text,
          fontSize: theme.typography.sizes.headline,
          fontWeight: theme.typography.weights.black,
          lineHeight: theme.layout.lineHeight.tight,
          marginBottom: theme.layout.gap.xl,
        }}
      >
        {renderHighlightedText(title, effectiveAccentColor)}
      </AnimatedText>
      
      {subtitle && (
        <AnimatedText
          delay={30}
          type="slide"
          style={{ 
            color: theme.colors.muted,
            fontFamily: theme.typography.body,
            fontSize: 42,
            fontWeight: theme.typography.weights.normal,
            lineHeight: theme.layout.lineHeight.normal,
          }}
        >
          {subtitle}
        </AnimatedText>
      )}
    </SceneContainer>
  );
};
