import { spring, useVideoConfig, useCurrentFrame } from 'remotion';

export const SPRING_CONFIG = {
  damping: 12,
  mass: 0.5,
  stiffness: 100,
};

export const SLOW_SPRING_CONFIG = {
  damping: 20,
  mass: 1,
  stiffness: 100,
};

export const useSpring = (frameOffset: number = 0, config = SPRING_CONFIG) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return spring({
    frame: frame - frameOffset,
    fps,
    config,
  });
};

export const useFade = (frameOffset: number = 0, duration: number = 15) => {
  const frame = useCurrentFrame();
  return Math.min(1, Math.max(0, (frame - frameOffset) / duration));
};

export const easings = {
  inOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
};
