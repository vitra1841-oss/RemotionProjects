import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneContainer, AnimatedText } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { fontFamilies } from '../Root';

interface SectionDividerSceneProps {
  title: string;
  accentColor?: string;
  transparent?: boolean;
}

export const SectionDividerScene: React.FC<SectionDividerSceneProps> = ({ 
  title, 
  accentColor = '#A78BFA',
  transparent = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, mass: 1, stiffness: 50 },
  });

  const opacity = interpolate(textSpring, [0, 1], [0, 1]);
  const scale = interpolate(textSpring, [0, 1], [0.95, 1]);

  return (
    <SceneContainer 
      align="center"
      transparent={transparent}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: accentColor,
            margin: '0 auto 40px',
            opacity: 0.6,
          }}
        />
        
        <AnimatedText
          delay={15}
          type="zoom"
          style={{ 
            fontFamily: fontFamilies.fraunces,
            color: '#F8FAFC',
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1.0,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {renderHighlightedText(title, accentColor)}
        </AnimatedText>
        
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: accentColor,
            margin: '40px auto 0',
            opacity: 0.6,
          }}
        />
      </div>
    </SceneContainer>
  );
};
