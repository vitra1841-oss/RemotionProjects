import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { fontFamilies } from '../Root';

interface StatisticSceneProps {
  value: number;
  suffix?: string;
  label: string;
  accentColor?: string;
  transparent?: boolean;
}

export const StatisticScene: React.FC<StatisticSceneProps> = ({ 
  value, 
  suffix = '', 
  label,
  accentColor = '#34D399',
  transparent = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springValue = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, mass: 1, stiffness: 50 },
  });

  const labelSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20, mass: 1, stiffness: 50 },
  });

  // Animate number from 0 to value
  const currentValue = interpolate(springValue, [0, 1], [0, value], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: transparent ? 'transparent' : '#0A0F1C',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* Hero Number */}
        <div
          className="text-[140px] font-black leading-none mb-8"
          style={{
            opacity: springValue,
            transform: `scale(${interpolate(springValue, [0, 1], [0.5, 1])})`,
            fontFamily: fontFamilies.fraunces,
            color: accentColor,
          }}
        >
          {currentValue % 1 === 0 ? Math.floor(currentValue) : currentValue.toFixed(1)}
          {suffix}
        </div>

        {/* Label */}
        <div
          className="text-[40px] font-normal tracking-wide uppercase"
          style={{
            opacity: labelSpring,
            transform: `translateY(${interpolate(labelSpring, [0, 1], [20, 0])}px)`,
            fontFamily: fontFamilies.spaceGrotesk,
            color: '#94A3B8',
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
