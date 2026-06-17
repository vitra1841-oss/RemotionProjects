import React from 'react';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { fontFamilies } from '../Root';

interface TitleSceneProps {
  title: string;
  category?: string;
  subtitle?: string;
  accentColor?: string;
  transparent?: boolean;
}

export const TitleScene: React.FC<TitleSceneProps> = ({ 
  title, 
  category, 
  subtitle,
  accentColor = '#7DD3FC',
  transparent = false
}) => {
  return (
    <SceneContainer 
      align="left" 
      transparent={transparent}
      verticalAnchor={0.35}
    >
      {category && (
        <AnimatedText
          delay={5}
          type="slide"
          style={{ 
            color: '#94A3B8',
            fontFamily: fontFamilies.spaceGrotesk,
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          — {category}
        </AnimatedText>
      )}
      
      <AnimatedText
        delay={10}
        type="zoom"
        style={{ 
          fontFamily: fontFamilies.bricolage,
          color: '#F8FAFC',
          fontSize: 130,
          fontWeight: 900,
          lineHeight: 1.0,
          marginBottom: 40,
        }}
      >
        {renderHighlightedText(title, accentColor)}
      </AnimatedText>
      
      {subtitle && (
        <AnimatedText
          delay={30}
          type="slide"
          style={{ 
            color: '#94A3B8',
            fontFamily: fontFamilies.spaceGrotesk,
            fontSize: 42,
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </AnimatedText>
      )}
    </SceneContainer>
  );
};
