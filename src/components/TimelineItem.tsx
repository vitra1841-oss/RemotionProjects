import React from 'react';
import { interpolate, useVideoConfig } from 'remotion';
import { useSpring } from '../theme';
import { fontFamilies } from '../Root';

interface TimelineItemProps {
  year: string;
  label: string;
  delay?: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ year, label, delay = 0 }) => {
  const { width } = useVideoConfig();
  const wScale = width / 1080;
  const springValue = useSpring(delay);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const translateY = interpolate(springValue, [0, 1], [Math.round(20 * wScale), 0]);

  return (
    <div
      className="flex flex-col items-center relative"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div 
        className="rounded-full border-zinc-950 z-10" 
        style={{
          width: Math.round(24 * wScale),
          height: Math.round(24 * wScale),
          borderWidth: Math.round(4 * wScale),
          backgroundColor: '#3b82f6',
          marginBottom: Math.round(24 * wScale),
        }}
      />
      <span className="font-bold" style={{
        fontSize: Math.round(24 * wScale),
        marginBottom: Math.round(8 * wScale),
        color: '#60a5fa',
        fontFamily: fontFamilies.bricolage,
      }}>{year}</span>
      <span className="text-zinc-400 text-center font-medium" style={{
        fontSize: Math.round(20 * wScale),
        maxWidth: Math.round(150 * wScale),
        fontFamily: fontFamilies.spaceGrotesk,
      }}>
        {label}
      </span>
    </div>
  );
};
