import React from 'react';

export interface HighlightSegment {
  text: string;
  isHighlighted: boolean;
}

/**
 * Parse a string with asterisk-wrapped keywords for highlighting.
 * Example: "Hiệu năng AI *gấp ba lần* rưỡi" → [
 *   { text: "Hiệu năng AI ", isHighlighted: false },
 *   { text: "gấp ba lần", isHighlighted: true },
 *   { text: " rưỡi", isHighlighted: false }
 * ]
 */
export function parseHighlight(text: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let currentText = '';
  let inHighlight = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '*') {
      // Save the current segment if it has content
      if (currentText.length > 0) {
        segments.push({
          text: currentText,
          isHighlighted: inHighlight,
        });
        currentText = '';
      }
      // Toggle highlight state
      inHighlight = !inHighlight;
    } else {
      currentText += char;
    }
  }

  // Don't forget the last segment
  if (currentText.length > 0) {
    segments.push({
      text: currentText,
      isHighlighted: inHighlight,
    });
  }

  return segments;
}

/**
 * Render highlighted text as React spans with accent color.
 * @param text - The text with asterisk-wrapped keywords
 * @param accentColor - The accent color for highlighted words (e.g., "#7DD3FC")
 * @param normalColor - The normal text color (default: "#F8FAFC")
 * @param scale - The scale value for highlighted words (from animation)
 */
export function renderHighlightedText(
  text: string,
  accentColor: string,
  normalColor: string = '#F8FAFC',
  scale?: number
): React.ReactNode {
  const segments = parseHighlight(text);

  return segments.map((segment, index) => {
    if (segment.isHighlighted) {
      return (
        <span
          key={index}
          style={{
            display: 'inline-block',
            transform: `scale(${scale ?? 1})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <span style={{ color: accentColor }}>
            {segment.text}
          </span>
        </span>
      );
    }
    return segment.text;
  });
}
