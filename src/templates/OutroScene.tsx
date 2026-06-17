import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { fontFamilies } from '../Root';

interface OutroSceneProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  transparent?: boolean;
}

export const OutroScene: React.FC<OutroSceneProps> = ({ 
  title, 
  subtitle,
  accentColor = '#7DD3FC',
  transparent = false
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // Fade to black at the end
  const exitFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer 
      align="center"
      transparent={transparent}
    >
      {/* Brand Moment - Centered */}
      <AnimatedText
        delay={10}
        type="zoom"
        className="text-[110px] font-black leading-none mb-8 text-center"
        style={{ 
          fontFamily: fontFamilies.fraunces,
          color: '#F8FAFC'
        }}
      >
        {renderHighlightedText(title, accentColor)}
      </AnimatedText>

      {subtitle && (
        <AnimatedText
          delay={30}
          type="slide"
          className="text-[36px] font-normal text-center"
          style={{ 
            color: '#94A3B8',
            fontFamily: fontFamilies.spaceGrotesk 
          }}
        >
          {subtitle}
        </AnimatedText>
      )}

      {/* Exit Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          backgroundColor: '#0A0F1C',
          opacity: exitFade 
        }}
      />
    </SceneContainer>
  );
};
