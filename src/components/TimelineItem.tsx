import React from 'react';
import { interpolate } from 'remotion';
import { useSpring } from '../theme';
import { fontFamilies } from '../Root';

interface TimelineItemProps {
  year: string;
  label: string;
  delay?: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ year, label, delay = 0 }) => {
  const springValue = useSpring(delay);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);
  const translateY = interpolate(springValue, [0, 1], [20, 0]);

  return (
    <div
      className="flex flex-col items-center relative"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div 
        className="w-6 h-6 rounded-full border-4 border-zinc-950 z-10 mb-6" 
        style={{ backgroundColor: '#3b82f6' }}
      />
      <span className="text-2xl font-bold mb-2" style={{ color: '#60a5fa', fontFamily: fontFamilies.bricolage }}>{year}</span>
      <span className="text-xl text-zinc-400 text-center max-w-[150px] font-medium" style={{ fontFamily: fontFamilies.spaceGrotesk }}>
        {label}
      </span>
    </div>
  );
};
