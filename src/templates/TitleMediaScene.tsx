import React, { useState } from "react";
import {
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneContainer, AnimatedText } from "../components";
import { renderHighlightedText } from "../utils/parseHighlight";
import { Theme, defaultTheme, useSpring } from "../theme";

interface TitleMediaSceneProps {
  title: string;
  category?: string;
  subtitle?: string;
  mediaSrc: string;
  mediaType?: "image" | "video";
  accentColor?: string;
  transparent?: boolean;
  theme?: Theme;
  videoStartFrom?: number;
  videoMuted?: boolean;
  mediaWidth?: number;
}

export const TitleMediaScene: React.FC<TitleMediaSceneProps> = ({
  title,
  category,
  subtitle,
  mediaSrc,
  mediaType = "image",
  accentColor,
  transparent = false,
  theme = defaultTheme,
  videoStartFrom,
  videoMuted = true,
  mediaWidth = 1000,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: frameWidth } = useVideoConfig();
  const effectiveAccentColor = accentColor ?? theme.colors.primary;
  const [mediaError, setMediaError] = useState(false);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 5],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const wScale = frameWidth / 1080;
  const clampedWidth = Math.min(1300, Math.max(800, mediaWidth));
  const maxMediaWidth = Math.round(clampedWidth * wScale);
  const mediaMinHeight = Math.round(maxMediaWidth / 3);
  const mediaMaxHeight = Math.round(maxMediaWidth);

  const mediaSpring = useSpring(5, theme.animation.spring);
  const mediaOpacity = interpolate(mediaSpring, [0, 1], [0, 1]);
  const mediaScale = interpolate(mediaSpring, [0, 1], [0.8, 1]);

  const titleSpring = useSpring(13, theme.animation.spring);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);

  const cornerBracket = (
    pos: "tl" | "tr" | "bl" | "br",
  ): React.CSSProperties => {
    const s = Math.round(32 * wScale);
    const off = Math.round(3 * wScale);
    const bw = Math.round(5 * wScale);
    const br = Math.round(14 * wScale);
    const base: React.CSSProperties = {
      position: "absolute",
      width: s,
      height: s,
      borderColor: effectiveAccentColor,
      borderStyle: "solid",
      borderWidth: 0,
    };
    switch (pos) {
      case "tl":
        return {
          ...base,
          top: -off,
          left: -off,
          borderTopWidth: bw,
          borderLeftWidth: bw,
          borderRadius: `${br}px 0 0 0`,
        };
      case "tr":
        return {
          ...base,
          top: -off,
          right: -off,
          borderTopWidth: bw,
          borderRightWidth: bw,
          borderRadius: `0 ${br}px 0 0`,
        };
      case "bl":
        return {
          ...base,
          bottom: -off,
          left: -off,
          borderBottomWidth: bw,
          borderLeftWidth: bw,
          borderRadius: `0 0 0 ${br}px`,
        };
      case "br":
        return {
          ...base,
          bottom: -off,
          right: -off,
          borderBottomWidth: bw,
          borderRightWidth: bw,
          borderRadius: `0 0 ${br}px 0`,
        };
    }
  };

  return (
    <SceneContainer
      align="left"
      noPadding
      transparent={transparent}
      theme={theme}
      style={{
        opacity: exitOpacity,
        padding: `${Math.round(96 * wScale)}px 0 0 0`,
      }}
    >
      {/* Title section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          paddingTop: Math.round(180 * wScale),
          paddingLeft: theme.layout.framePadding,
          paddingRight: theme.layout.framePadding,
        }}
      >
        {category && (
          <AnimatedText
            delay={10}
            type="slide"
            style={{
              color: theme.colors.muted,
              fontFamily: theme.typography.label,
              fontSize: theme.typography.sizes.label,
              fontWeight: theme.typography.weights.bold,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: theme.layout.gap.md,
            }}
          >
            — {category}
          </AnimatedText>
        )}

        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: theme.typography.headline,
            color: theme.colors.text,
            fontSize: theme.typography.sizes.headline,
            fontWeight: theme.typography.weights.black,
            lineHeight: theme.layout.lineHeight.tight,
            marginBottom: subtitle ? theme.layout.gap.lg : 0,
          }}
        >
          {renderHighlightedText(title, effectiveAccentColor)}
        </div>

        {subtitle && (
          <AnimatedText
            delay={22}
            type="slide"
            style={{
              color: theme.colors.muted,
              fontFamily: theme.typography.body,
              fontSize: Math.round(38 * wScale),
              fontWeight: theme.typography.weights.normal,
              lineHeight: theme.layout.lineHeight.normal,
            }}
          >
            {subtitle}
          </AnimatedText>
        )}
      </div>
      {/* Media section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: Math.round(90 * wScale),
        }}
      >
        <div
          style={{
            opacity: mediaOpacity,
            transform: `scale(${mediaScale})`,
            position: "relative",
            width: maxMediaWidth,
            minHeight: mediaMinHeight,
            maxHeight: mediaMaxHeight,
            overflow: "hidden",
            borderRadius: Math.round(12 * wScale),
          }}
        >
          {mediaError ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: theme.colors.divider,
                borderRadius: Math.round(12 * wScale),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: theme.colors.muted,
                  fontFamily: theme.typography.body,
                  fontSize: Math.round(24 * wScale),
                }}
              >
                Media not found
              </span>
            </div>
          ) : mediaType === "video" ? (
            <OffthreadVideo
              src={staticFile(mediaSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: Math.round(12 * wScale),
              }}
              startFrom={videoStartFrom ?? 0}
              muted={videoMuted}
            />
          ) : (
            <Img
              src={staticFile(mediaSrc)}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: Math.round(12 * wScale),
                objectFit: "contain",
                scale: 1,
              }}
              onError={() => setMediaError(true)}
            />
          )}

          {mediaType === "video" && !mediaError && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: Math.round(2 * wScale),
                backgroundColor: effectiveAccentColor,
                opacity: 0.4,
              }}
            />
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
