import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
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
  const { width, height } = useVideoConfig();
  const wScale = width / 1080;

  const offsetX = Math.sin(frame / 45) * Math.round(100 * wScale);
  const offsetY = Math.cos(frame / 60) * Math.round(120 * wScale);

  // Primary blob position — dùng pixel thay vì % để dễ sync với mask
  const FRAME_W = width;
  const FRAME_H = height;
  const primaryX = FRAME_W * 0.5 + offsetX;
  const primaryY = FRAME_H * 0.45 + offsetY;
  const primaryR = Math.round(450 * wScale); // radius = width/2 = 900/2

  const secondaryX = FRAME_W * 0.25 - offsetX * 0.4;
  const secondaryY = FRAME_H * 0.20 - offsetY * 0.5;
  const secondaryR = Math.round(250 * wScale);

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
          filter: `blur(${Math.round(90 * wScale)}px)`,
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
          filter: `blur(${Math.round(80 * wScale)}px)`,
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
              backgroundImage: `radial-gradient(circle, ${dotColor} ${Math.round(2 * wScale)}px, transparent ${Math.round(2 * wScale)}px)`,
              backgroundSize: `${Math.round(24 * wScale)}px ${Math.round(24 * wScale)}px`,
              WebkitMaskImage: `radial-gradient(circle ${primaryR * 1.1}px at ${primaryX}px ${primaryY}px, black 0%, black 30%, transparent 75%)`,
              maskImage: `radial-gradient(circle ${primaryR * 1.1}px at ${primaryX}px ${primaryY}px, black 0%, black 30%, transparent 75%)`,
            }}
          />
          {/* Secondary dot region */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${dotColor} ${Math.round(2 * wScale)}px, transparent ${Math.round(2 * wScale)}px)`,
              backgroundSize: `${Math.round(24 * wScale)}px ${Math.round(24 * wScale)}px`,
              WebkitMaskImage: `radial-gradient(circle ${secondaryR * 1.1}px at ${secondaryX}px ${secondaryY}px, black 0%, black 20%, transparent 70%)`,
              maskImage: `radial-gradient(circle ${secondaryR * 1.1}px at ${secondaryX}px ${secondaryY}px, black 0%, black 20%, transparent 70%)`,
            }}
          />
        </>
      )}

      {/* Film grain / dither overlay — breaks color banding on gradient blobs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.035,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
