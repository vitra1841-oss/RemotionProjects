# REMOTION DESIGN SYSTEM

## CORE PRINCIPLE

Visuals illustrate. Narration explains. The screen shows ideas; the
voice explains details. Don't put narration text on screen.

---

## DESIGN DIRECTION

The new visual style is **typography-first**. The frame is dominated by large, bold text. Background is dark and minimal — a near-black base with subtle ambient particles or soft radial glow, never flat solid color. No cards, no bordered boxes, no rounded rectangles containing text blocks. Those are gone. Visual interest comes from typography scale, color contrast, and spacing — not from UI chrome.

Reference: the style seen in high-performing Vietnamese short-form video content — large headline fills 40–60% of the frame, one or two words highlighted in a contrasting accent color, minimal supporting text below in a lighter weight and smaller size, sparse chrome elements anchoring brand identity.

Do not clone this style exactly. Use it as directional reference for scale, weight, and composition logic.

---

## LAYOUT

Scenes alternate between two alignment modes — the composition decides which fits the content:

**Left-aligned scenes:** headline anchors to the left edge, starts at roughly 35–50% from the top of the frame. Supporting text sits below the headline, same left edge. This creates a strong vertical rhythm on the left side with intentional negative space on the right and bottom.

**Center-aligned scenes:** headline centered horizontally, anchored vertically at roughly 40–50% from top. Use for single-concept moments — a statistic, a key takeaway, a section divider.

Never use justify-center + items-center together as the default for every scene. Vertical centering is a deliberate choice, not a default.

**Padding:** 64–80px horizontal, 96px vertical. Content must fill at least 65% of the 1920px frame height. If a scene feels thin, increase font size or add a supporting element — do not add empty cards.

---

## TYPOGRAPHY

**Headline scale:** text-[80px] to text-[120px], font-weight black (900), line-height leading-tight or leading-none. Headlines should feel large enough that they command attention immediately.

**Supporting text:** text-[32px] to text-[40px], font-weight normal or medium, color MUTED, sits 24–32px below the headline.

**Keyword highlighting:** within a headline, one to three words are wrapped in a span with a contrasting accent color — PRIMARY (#7DD3FC), ACCENT (#A78BFA), SUCCESS (#34D399), WARNING (#FBBF24), or ERROR (#FB7185). Choose the accent based on the emotional tone of the content. The rest of the headline stays in TEXT (#F8FAFC). This is the primary way color is used — on words, not on backgrounds or borders.

**Category label:** a short uppercase string sits above the headline, separated by an em dash or a thin line. Small size (text-xl), MUTED color, letter-spacing wide. Example: "— HIỆU NĂNG AI". This is optional, use when the scene introduces a new topic.

**Brand label:** top-right corner, persistent across all scenes, small text showing channel or video identity. This is part of the Composition layer, not individual scenes.

### Font Selection

A font palette is available — pick fonts per scene based on role, not fixed bindings. All fonts below have good Vietnamese diacritic support. Prefer heavier weights (Bold/ExtraBold/Black) for headlines.

**Primary fonts — prefer these first:**

- **Fraunces** — serif with character, editorial feel, strong at heavy weights. Use `font="Fraunces 9pt"` with `weight=BOLD` for headlines.

- **Bricolage Grotesque** — bold display sans with personality. Use `font="Bricolage Grotesque 14pt"` with `weight=BOLD` for headlines.

**Secondary fonts — use when a specific role calls for them:**

- **Space Mono** — monospace. Use for code, terminal output, file paths, technical identifiers.
- **Space Grotesk** — geometric sans, clean and technical.
- **Lexend** — humanist sans, very readable at small sizes.
- **Chakra Petch** — technical/sci-fi flavored sans.

**Usage pattern:**

- Pick one primary font (Fraunces or Bricolage Grotesque) as the video's main font
- Use Space Mono for any code/terminal content
- Reach for secondary fonts only when the primary font doesn't serve a specific role well

### Fitting Vietnamese text

Vietnamese diacritics and longer words mean text often runs wider than the English equivalent at the same font_size. After creating any text element that could be long (headlines, labels), manually check and scale it to fit within the safe area.

---

## COLOR SYSTEM

Background:        #0A0F1C  (BG)

Primary:            #7DD3FC  (PRIMARY)

Accent:             #A78BFA  (ACCENT)

Success:            #34D399  (SUCCESS)

Warning:            #FBBF24  (WARNING)

Error:              #FB7185  (ERROR)

Text:               #F8FAFC  (TEXT)

Muted:              #94A3B8  (MUTED)

Rules:
- Dark background always.
- One dominant accent color per scene — pick PRIMARY, ACCENT, SUCCESS, WARNING, or ERROR based on the scene's emotional tone.
- TEXT and MUTED for typography hierarchy — TEXT for primary copy, MUTED for secondary/supporting copy.
- Color is used primarily on keyword highlights, not on backgrounds or borders.

---

## BACKGROUND

Base color: #0A0F1C

Background is rendered as a **persistent layer at the Composition level**, not per scene. This ensures visual continuity across scene transitions.

Use the `BackgroundLayer` component in your Composition file:

```tsx
import { BackgroundLayer } from './components';

<AbsoluteFill style={{ backgroundColor: '#0A0F1C' }}>
  <BackgroundLayer color="#7DD3FC" showDots={true} />
  {/* Your scenes here */}
</AbsoluteFill>
```

**BackgroundLayer props:**
- `color`: Accent color for the gradient blobs (default: #7DD3FC)
- `showDots`: Whether to render dot grid overlay (default: true)

**Visual effect:**
- Two animated gradient blobs (primary 900px, secondary 500px) with slow breathing movement
- Dot grid masked to only show in bright gradient regions — dots fade out at edges
- Dots: 2px size, 24px spacing (tighter, more visible than before)
- Blobs animate position with sin/cos functions for subtle drift

The background must never compete with the text. If the background is visible, it should feel like depth, not decoration.

---

## PERSISTENT CHROME (Composition layer, not scene layer)

These elements render on top of all scenes, outside any Sequence:

1. **Brand label** — top right, small uppercase text, MUTED color, always visible
2. **Progress indicator** — optional, a thin line at the very bottom of the frame showing video progress

These are placed directly in the Composition component, not in any scene template.

---

## KEYWORD HIGHLIGHT IMPLEMENTATION

In scene props, accept a highlights array or use a simple markdown-like syntax in the title string to mark which words get accent color. Example approach:

Title string: "Hiệu năng AI *gấp ba lần* rưỡi"

Words between asterisks render in the scene's accent color. All other words render in TEXT color.

Implement a `parseHighlight(text, accentColor)` utility function that splits the string on asterisks and returns an array of spans — normal spans and highlighted spans alternating. Use this function in every scene that renders a headline.

---

## TEMPLATES

Keep these, rewrite them fully to match the new direction:
- **HookScene** (or TitleScene repurposed as hook) — left-aligned, large headline with keyword highlight, category label above, supporting text below
- **SectionDividerScene** — center-aligned, single concept, minimal
- **ComparisonScene** — two stacked panels (top/bottom), no cards, just text blocks with a thin divider line between them
- **StatisticScene** — center-aligned, hero number with accent color, label below in MUTED
- **OutroScene** — center-aligned, brand moment

Delete all other scene template files. They will be replaced by LLM-generated custom scenes per video.

---

## COMPONENTS

Keep and upgrade:
- **SceneContainer** — remove default centering, add background layer (particles or glow), accept align prop ('left' | 'center', default 'left')
- **AnimatedText** — keep as animation wrapper, no changes needed
- **AnimatedList** — keep, no changes needed

Delete:
- **Card.tsx** — no more card UI pattern
- **MetricCard.tsx**
- **DiagramNode.tsx**
- **SectionTitle.tsx** — fold its responsibility into each scene directly

---

## SCENE GENERATION RULES FOR LLM

When an LLM generates a new scene for a specific video segment, it must:
- Choose left or center alignment based on content type
- Apply keyword highlighting to the headline using parseHighlight()
- Choose one accent color for the scene based on emotional tone
- Not use any card, box, or bordered container for text
- Fill at least 65% of the 1920px frame height with content
- Use fontFamilies imported from Root.tsx — never hardcode font strings

---

## WHAT DOES NOT CHANGE

- Color palette tokens — same as current DESIGN.md
- Font selection — Fraunces, Bricolage Grotesque, Space Grotesk, Space Mono, Lexend
- Animation primitives — spring, interpolate, useCurrentFrame
- Dark background always
- One dominant accent color per scene
- No gradients on text, no rainbow palettes
- Vietnamese primary, English for technical terms only