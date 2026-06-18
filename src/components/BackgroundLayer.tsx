import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Theme } from '../theme';

interface BackgroundLayerProps {
  color?: string;
  showDots?: boolean;
  theme?: Theme;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ 
  color,
  showDots = true,
  theme,
}) => {
  const effectiveColor = color ?? theme?.colors.primary ?? '#7DD3FC';
  const effectiveTextColor = theme?.colors.text ?? '#F8FAFC';
  const dotColor = effectiveTextColor + '33'; // 33 = ~20% alpha hex
  const frame = useCurrentFrame();

  const offsetX = Math.sin(frame / 45) * 100;
  const offsetY = Math.cos(frame / 60) * 120;

  // Primary blob position — dùng pixel thay vì % để dễ sync với mask
  const FRAME_W = 1080;
  const FRAME_H = 1920;
  const primaryX = FRAME_W * 0.5 + offsetX;
  const primaryY = FRAME_H * 0.45 + offsetY;
  const primaryR = 450; // radius = width/2 = 900/2

  const secondaryX = FRAME_W * 0.25 - offsetX * 0.4;
  const secondaryY = FRAME_H * 0.20 - offsetY * 0.5;
  const secondaryR = 250;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 0 }}>
      {/* Gradient blobs — render bình thường */}
      <div
        style={{
          position: 'absolute',
          top: primaryY,
          left: primaryX,
          transform: 'translate(-50%, -50%)',
          width: primaryR * 2,
          height: primaryR * 2,
          background: `radial-gradient(circle, ${effectiveColor} 0%, transparent 85%)`,
          opacity: 0.35,
          filter: 'blur(90px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: secondaryY,
          left: secondaryX,
          transform: 'translate(-50%, -50%)',
          width: secondaryR * 2,
          height: secondaryR * 2,
          background: `radial-gradient(circle, ${effectiveColor} 0%, transparent 85%)`,
          opacity: 0.35,
          filter: 'blur(80px)',
        }}
      />

      {/* Dot grid — full frame nhưng masked theo shape của blob */}
      {showDots && (
        <>
          {/* Primary dot region */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${dotColor} 2px, transparent 2px)`,
              backgroundSize: '24px 24px',
              WebkitMaskImage: `radial-gradient(circle ${primaryR * 1.1}px at ${primaryX}px ${primaryY}px, black 0%, black 30%, transparent 75%)`,
              maskImage: `radial-gradient(circle ${primaryR * 1.1}px at ${primaryX}px ${primaryY}px, black 0%, black 30%, transparent 75%)`,
            }}
          />
          {/* Secondary dot region */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${dotColor} 2px, transparent 2px)`,
              backgroundSize: '24px 24px',
              WebkitMaskImage: `radial-gradient(circle ${secondaryR * 1.1}px at ${secondaryX}px ${secondaryY}px, black 0%, black 20%, transparent 70%)`,
              maskImage: `radial-gradient(circle ${secondaryR * 1.1}px at ${secondaryX}px ${secondaryY}px, black 0%, black 20%, transparent 70%)`,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
