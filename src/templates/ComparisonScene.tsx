import React from 'react';
import { SceneContainer, AnimatedText, AnimatedList } from '../components';
import { renderHighlightedText } from '../utils/parseHighlight';
import { fontFamilies } from '../Root';

interface ComparisonSceneProps {
  topTitle: string;
  topItems: string[];
  bottomTitle: string;
  bottomItems: string[];
  topAccentColor?: string;
  bottomAccentColor?: string;
  transparent?: boolean;
}

export const ComparisonScene: React.FC<ComparisonSceneProps> = ({
  topTitle,
  topItems,
  bottomTitle,
  bottomItems,
  topAccentColor = '#7DD3FC',
  bottomAccentColor = '#34D399',
  transparent = false
}) => {
  return (
    <SceneContainer 
      align="left"
      transparent={transparent}
      verticalAnchor={0.12}
      noPadding
    >
      {/* Top Panel */}
      <div style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 220, paddingBottom: 80 }}>
        <AnimatedText
          delay={10}
          type="slide"
          style={{ 
            fontFamily: fontFamilies.bricolage,
            color: '#F8FAFC',
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 48,
          }}
        >
          {renderHighlightedText(topTitle, topAccentColor)}
        </AnimatedText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AnimatedList
            children={topItems}
            stagger={5}
            delay={25}
            renderItem={(item, index, delay) => (
              <AnimatedText
                key={index}
                delay={delay}
                type="slide"
                style={{
                  color: '#94A3B8',
                  fontFamily: fontFamilies.spaceGrotesk,
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {item as string}
              </AnimatedText>
            )}
          />
        </div>
      </div>

      {/* Thin Divider */}
      <div
        style={{
          height: 2,
          backgroundColor: '#334155',
          opacity: 0.5,
          margin: '0 80px',
        }}
      />

      {/* Bottom Panel */}
      <div style={{ paddingLeft: 80, paddingRight: 80, paddingTop: 80, paddingBottom: 120 }}>
        <AnimatedText
          delay={20}
          type="slide"
          style={{ 
            fontFamily: fontFamilies.bricolage,
            color: '#F8FAFC',
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 48,
          }}
        >
          {renderHighlightedText(bottomTitle, bottomAccentColor)}
        </AnimatedText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AnimatedList
            children={bottomItems}
            stagger={5}
            delay={35}
            renderItem={(item, index, delay) => (
              <AnimatedText
                key={index}
                delay={delay}
                type="slide"
                style={{
                  color: '#94A3B8',
                  fontFamily: fontFamilies.spaceGrotesk,
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {item as string}
              </AnimatedText>
            )}
          />
        </div>
      </div>
    </SceneContainer>
  );
};
