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

## PROJECT STRUCTURE

```
d:\RemotionProjects/
├── audio/                 # Audio and JSON files for each video (gitignored)
│   ├── build_timeline.py  # Python script for timeline generation (tracked)
│   ├── macbookM5.wav      # Audio file for MacBook M5 video
│   ├── macbookM5.json     # Context JSON for agent (timing data)
│   └── macbookM5_captions.json  # Caption JSON for CaptionRenderer
├── public/                # Static assets (gitignored)
│   ├── audio/             # Moved audio files (macbookM5.wav)
│   ├── captions/          # Moved caption JSON files (macbookM5_captions.json)
│   ├── image/             # Images per video
│   └── video/             # Video outputs
├── src/
│   ├── components/        # Reusable UI components (tracked)
│   ├── compositions/      # Video-specific compositions (gitignored)
│   │   ├── M5Composition.tsx
│   │   └── MCPComposition.tsx
│   ├── templates/         # Scene templates (TitleScene, ComparisonScene, etc.)
│   ├── theme/             # Theme definitions
│   └── utils/             # Utility functions
└── DESIGN.md              # Design system documentation
```

**Rules:**
- `src/components/`, `src/templates/`, `src/theme/`, `src/utils/` - **tracked by git**
- `src/compositions/` contains video-specific compositions - **NOT tracked by git**
- `audio/` contains source audio and JSON files - **NOT tracked by git** (except build_timeline.py)
- `public/` contains moved assets for production - **NOT tracked by git**
- Each video has: audio file, context JSON, caption JSON, and composition file

**Audio File Workflow:**
1. Detect audio file (e.g., `macbookM5.wav`) in `audio/` folder
2. Detect context JSON (e.g., `macbookM5.json`) in `audio/` folder - used by agent for video generation
3. Detect caption JSON (e.g., `macbookM5_captions.json`) in `audio/` folder - used by CaptionRenderer (don't need to read this file, just have to move it to the right path)
4. Move `.wav` file to `public/audio/` for production
5. Move `_captions.json` file to `public/captions/` for production
6. Context JSON stays in `audio/` as reference for agent

---

## TIMING CALCULATION PATTERN

All new Composition files must follow the timing calculation pattern from M5Composition.tsx. This ensures consistency and maintainability.

### Standard Pattern

```tsx
export const MyComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const theme = themes['dark-tech'];

  // Timing from audio/myAudio.json
  // Segment 0: 0.0 - 4.35s
  // Segment 1: 4.35 - 8.65s
  // Segment 2: 8.65 - 15.15s
  // Segment 3: 15.15 - 20.7s
  // ... continue for all segments

  const s0Frames = Math.round(4.35 * fps);
  const s1Frames = Math.round(8.65 * fps) - s0Frames;
  const s2Frames = Math.round(15.15 * fps) - (s0Frames + s1Frames);
  const s3Frames = Math.round(20.7 * fps) - (s0Frames + s1Frames + s2Frames);
  // ... continue this pattern
```

### Frame Calculation Rules

1. **Segment 0 (first):** `Math.round(endTime * fps)` — since startTime is always 0
2. **Segment N (from segment 1 onwards):** `Math.round(endTime * fps) - sum(s0Frames to s(N-1)Frames)`

This pattern ensures each segment has the correct duration based on timing from audio JSON.

### Using in Sequence

```tsx
{/* Segment 0: starts from 0 */}
<Sequence from={0} durationInFrames={s0Frames}>
  <Scene ... />
</Sequence>

{/* Segment 1: starts from s0Frames */}
<Sequence from={s0Frames} durationInFrames={s1Frames}>
  <Scene ... />
</Sequence>

{/* Segment 2: starts from s0Frames + s1Frames */}
<Sequence from={s0Frames + s1Frames} durationInFrames={s2Frames}>
  <Scene ... />
</Sequence>

{/* Segment 3: starts from s0Frames + s1Frames + s2Frames */}
<Sequence from={s0Frames + s1Frames + s2Frames} durationInFrames={s3Frames}>
  <Scene ... />
</Sequence>
```

### Rules for `from` prop

- **Segment 0:** `from={0}`
- **Segment 1:** `from={s0Frames}`
- **Segment 2:** `from={s0Frames + s1Frames}`
- **Segment 3:** `from={s0Frames + s1Frames + s2Frames}`
- **Segment N:** `from={sum of all previous segments}`

### Why this pattern?

1. **Easy to debug:** Timing comments at the top of the file allow quick verification of mapping between audio time and frame numbers
2. **Consistent:** Same pattern for every composition file
3. **Flexible:** Easy to add/remove segments without recalculating everything
4. **Accurate:** Uses `Math.round()` to ensure frame numbers are integers

### Real Example from M5Composition

```tsx
// Timing from audio/macbookM5.json
// Segment 0: 0.0 - 4.35s
// Segment 1: 4.35 - 8.65s
// Segment 2: 8.65 - 15.15s
// Segment 3: 15.15 - 20.7s
// Segment 4: 20.7 - 27.44s
// Segment 5: 27.44 - 33.46s
// Segment 6: 33.46 - 40.86s
// Segment 7: 40.86 - 48.73s

const s0Frames = Math.round(4.35 * fps);           // 4.35s * 30fps = 131 frames
const s1Frames = Math.round(8.65 * fps) - s0Frames; // (8.65 - 4.35) * 30fps = 129 frames
const s2Frames = Math.round(15.15 * fps) - (s0Frames + s1Frames); // (15.15 - 8.65) * 30fps = 195 frames
// ... and continue
```

**Note:** Composition files are located in `src/compositions/`, not in root. This allows gitignore to exclude video-specific composition files.

### Checklist for Creating New Composition

- [ ] Create composition file in `src/compositions/`
- [ ] Comment timing from audio JSON file with start-end times for each segment
- [ ] Calculate frames for segment 0: `Math.round(endTime * fps)`
- [ ] Calculate frames for subsequent segments: `Math.round(endTime * fps) - sum(previousSegments)`
- [ ] Use cumulative sum for `from` prop in Sequence
- [ ] Verify total durationInFrames matches total audio duration
- [ ] Add CaptionRenderer if caption JSON file exists
- [ ] Place audio file in `public/audio/` with appropriate name
- [ ] Place captions JSON in `public/captions/` with `_captions.json` suffix

---

## THEME SYSTEM

Project uses a centralized theme system in `src/theme/`. Each theme defines full colors, typography, animation, and layout.

### How to Use Theme

In Composition file, import and select theme:

```tsx
import { themes } from '../theme';

const theme = themes['dark-tech']; // or 'bright-education', 'minimal-corporate'
```

Available themes:
- **dark-tech** — dark background, cyan/amber colors, Bricolage Grotesque + Space Grotesk fonts
- **bright-education** — bright background, indigo/orange colors, Fraunces + Lexend fonts
- **minimal-corporate** — minimal dark background, blue/gray colors, Bricolage Grotesque + Space Grotesk fonts

### Passing Theme to Components

All scene templates and components accept `theme` prop:

```tsx
<TitleScene
  title="AI Performance *3.5x faster*"
  accentColor={theme.colors.primary}
  transparent={true}
  theme={theme}
/>
```

BackgroundLayer also accepts theme to automatically get colors:

```tsx
<BackgroundLayer color={theme.colors.primary} showDots={true} theme={theme} />
```

### Theme Structure

Each theme has 4 main parts:

**Colors:** `bg`, `text`, `muted`, `primary`, `accent`, `success`, `divider`, `subAccent1-4`

**Typography:** `headline`, `body`, `label`, `mono` (fontFamily), `sizes` (hero, headline, subheadline, body, label, caption), `weights` (black, bold, normal)

**Animation:** `spring`, `springSlow`, `springFast` (SpringConfig)

**Layout:** `framePadding`, `verticalAnchorLeft`, `lineHeight` (tight, normal, loose), `gap` (xs, sm, md, lg, xl)

---

## LAYOUT

Scenes alternate between two alignment modes — the composition decides which fits the content:

**Left-aligned scenes:** headline anchors to the left edge, starts at roughly 35–50% from the top of the frame. Supporting text sits below the headline, same left edge. This creates a strong vertical rhythm on the left side with intentional negative space on the right and bottom.

**Center-aligned scenes:** headline centered horizontally, anchored vertically at roughly 40–50% from top. Use for single-concept moments — a statistic, a key takeaway, a section divider.

Never use justify-center + items-center together as the default for every scene. Vertical centering is a deliberate choice, not a default.

**Padding:** Defined in theme (`theme.layout.framePadding`), typically 64–96px horizontal, 96px vertical. Content must fill at least 65% of 1920px frame height. If scene feels thin, increase font size or add supporting element — don't add empty cards.

---

## TYPOGRAPHY

Typography is defined in theme system. Don't hardcode font sizes.

**Headline scale:** `theme.typography.sizes.headline` (typically 110–130px), font-weight `theme.typography.weights.black` (900), line-height `theme.layout.lineHeight.tight`. Headlines must be large enough to grab attention immediately.

**Supporting text:** `theme.typography.sizes.body` (typically 30–34px), font-weight `theme.typography.weights.normal` or `bold`, color `theme.colors.muted`, sits 24–32px below headline.

**Keyword highlighting:** in headline, 1–3 words wrapped in span with accent color — `theme.colors.primary`, `accent`, `success`, or `subAccent` colors. Choose accent based on emotional tone of content. Rest of headline uses `theme.colors.text`. This is the primary way to use color — on words, not on backgrounds or borders.

**Category label:** short uppercase string sits above headline, separated by em dash or thin line. Size `theme.typography.sizes.label`, color `theme.colors.muted`, letter-spacing wide. Example: "— AI PERFORMANCE". Optional, used when scene introduces new topic.

**Brand label:** top-right corner, persistent across all scenes, small text showing channel or video identity. This is part of Composition layer, not individual scenes.

### Font Selection

Font palette is defined in `src/fonts.ts` and used by themes. All fonts have good Vietnamese diacritic support. Prefer heavier weights (Bold/ExtraBold/Black) for headlines.

**Available font families:**

- **fraunces** — serif with character, editorial feel, strong at heavy weights. Used for headline in bright-education theme.
- **bricolage** — bold display sans with personality. Used for headline in dark-tech and minimal-corporate themes.
- **spaceMono** — monospace. Used for code, terminal output, file paths, technical identifiers.
- **spaceGrotesk** — geometric sans, clean and technical. Used for body text in dark-tech and minimal-corporate.
- **lexend** — humanist sans, very readable at small sizes. Used for body text in bright-education.
- **bigShoulders** — condensed display sans, used for uppercase labels.

**Usage pattern:**

- Theme automatically selects fonts for each role (headline, body, label, mono)
- Don't hardcode font strings — always use `theme.typography.headline`, `theme.typography.body`, etc.
- When creating custom scene, use theme typography values

### Fitting Vietnamese Text

Vietnamese diacritics and longer words mean text often runs wider than English equivalent at same font_size. After creating any potentially long text element (headlines, labels), manually check and scale it to fit in safe area.

---

## COLOR SYSTEM

Colors are defined in theme. Don't hardcode color values.

**Color tokens in each theme:**

- `bg` — main background (dark: #0A0F1C, bright: #F8FAFC)
- `text` — main text (#F8FAFC for dark, #1A1A2E for bright)
- `muted` — secondary text / small label (#94A3B8, #6B7280)
- `primary` — accent color 1 (#67E8F9, #5B8DEF, #4338CA)
- `accent` — accent color 2 (#F59E0B, #94A3B8, #FB923C)
- `success` — success color (#34D399, #10B981)
- `divider` — divider line color (#233046, #2A2D35, #d2c9e4)
- `subAccent1-4` — secondary accent colors for variety

**Rules:**
- Dark background for dark-tech and minimal-corporate, bright background for bright-education.
- One dominant accent color per scene — pick from theme colors based on scene's emotional tone.
- TEXT and MUTED for typography hierarchy — TEXT for primary copy, MUTED for secondary/supporting copy.
- Color is primarily used on keyword highlights, not on backgrounds or borders.

---

## BACKGROUND

Background is rendered as a **persistent layer at Composition level**, not per scene. This ensures visual continuity across scene transitions.

Use `BackgroundLayer` component in Composition file:

```tsx
import { BackgroundLayer } from '../components';

<AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
  <BackgroundLayer color={theme.colors.primary} showDots={true} theme={theme} />
  {/* Your scenes here */}
</AbsoluteFill>
```

**BackgroundLayer props:**
- `color`: Accent color for gradient blobs (default: theme.colors.primary if theme is passed)
- `showDots`: Whether to render dot grid overlay (default: true)
- `theme`: Theme object to automatically get colors

**Visual effect:**
- Two animated gradient blobs (primary 900px, secondary 500px) with slow breathing movement
- Dot grid masked to only show in bright gradient regions — dots fade out at edges
- Dots: 2px size, 24px spacing
- Blobs animate position with sin/cos functions for subtle drift

Background must never compete with text. If background is visible, it should feel like depth, not decoration.

---

## PERSISTENT CHROME (Composition layer, not scene layer)

These elements render on top of all scenes, outside any Sequence:

1. **Brand label** — top right, small uppercase text, MUTED color, always visible
2. **CaptionRenderer** — subtitle overlay from JSON file with _captions.json suffix, rendered at bottom of frame
3. **Progress indicator** — optional, a thin line at very bottom of frame showing video progress

Placed directly in Composition component, not in any scene template.

---

## KEYWORD HIGHLIGHT IMPLEMENTATION

In scene props, use markdown-like syntax in title string to mark which words get accent color:

```tsx
title="AI Performance *3.5x faster*"
```

Words between asterisks render in scene's accent color. All other words render in TEXT color.

Utility function `renderHighlightedText(text, accentColor)` in `src/utils/parseHighlight.ts` splits string on asterisks and returns array of spans — normal spans and highlighted spans alternating. Use this function in every scene that renders headlines.

---

## TEMPLATE SCENES

Available template scenes in `src/templates/`:

### TitleScene
Left-aligned, large headline with keyword highlight, category label above, supporting text below.

```tsx
<TitleScene
  title="AI Performance *3.5x faster*"
  category="M5 CHIP"
  subtitle="Revolutionary leap in AI processing"
  accentColor={theme.colors.primary}
  transparent={true}
  theme={theme}
  start={2.73}
  sequenceFrom={0}
/>
```

**Props:**
- `title`: Main headline (can use *word* for highlight)
- `category`: Optional uppercase label above headline
- `subtitle`: Optional supporting text below headline
- `accentColor`: Color for highlighted words (default: theme.colors.primary)
- `transparent`: If true, background transparent to show BackgroundLayer
- `theme`: Theme object
- `start`: Time in seconds from video start to begin highlight text animation (optional)
- `sequenceFrom`: Frame where this sequence starts in video (default: 0)

**Highlight Animation:**
When `start` prop is provided, highlighted words will have scale up/scale down animation at that time. Animation lasts 0.5 seconds.

### SectionDividerScene
Center-aligned, single concept, minimal. Used for section transitions.

```tsx
<SectionDividerScene
  title="Apple *M5* Chip"
  eyebrow="Next Generation"
  tagline="Most advanced Apple Silicon chip architecture"
  accentColor={theme.colors.accent}
  transparent={true}
  theme={theme}
/>
```

**Props:**
- `title`: Main headline (can use *word* for highlight)
- `eyebrow`: Optional small label above
- `tagline`: Optional supporting text below
- `accentColor`: Color for highlighted words
- `transparent`: Background transparency
- `theme`: Theme object

### ComparisonScene
Two stacked panels (top/bottom), no cards, just text blocks with thin divider line between them.

```tsx
<ComparisonScene
  centerTitle="*M5* vs M4"
  topTitle="*LLM* on device"
  topItems={["Run directly on device", "No Cloud connection needed"]}
  topConclusion="Private & Fast"
  bottomTitle="Faster than *M4*"
  bottomItems={["Instant response", "Absolute data security"]}
  bottomConclusion="3.5× AI perf"
  topAccentColor={theme.colors.primary}
  bottomAccentColor={theme.colors.subAccent4}
  transparent={true}
  theme={theme}
/>
```

**Props:**
- `centerTitle`: Optional center title between divider
- `topTitle`: Title for top panel
- `topItems`: Array of strings for top panel
- `topConclusion`: Optional conclusion text for top panel
- `bottomTitle`: Title for bottom panel
- `bottomItems`: Array of strings for bottom panel
- `bottomConclusion`: Optional conclusion text for bottom panel
- `topAccentColor`: Accent color for top panel
- `bottomAccentColor`: Accent color for bottom panel
- `transparent`: Background transparency
- `theme`: Theme object

### StatisticScene
Center-aligned, hero number with accent color, label below in MUTED.

```tsx
<StatisticScene
  value={150}
  suffix=" GB/s"
  label="Memory bandwidth"
  accentColor={theme.colors.success}
  transparent={true}
  theme={theme}
/>
```

**Props:**
- `value`: Main number (number)
- `suffix`: Optional suffix string (e.g., " GB/s")
- `label`: Label text below number
- `accentColor`: Color for number
- `transparent`: Background transparency
- `theme`: Theme object

### OutroScene
Center-aligned, brand moment.

```tsx
<OutroScene
  title="The *AI* Era"
  subtitle="Apple M5 - Designed for the future"
  accentColor={theme.colors.primary}
  transparent={true}
  theme={theme}
/>
```

**Props:**
- `title`: Main headline (can use *word* for highlight)
- `subtitle`: Optional supporting text
- `accentColor`: Color for highlighted words
- `transparent`: Background transparency
- `theme`: Theme object

---

## COMPONENTS

Available components in `src/components/`:

### SceneContainer
Container for scenes with theme context and alignment options.

```tsx
<SceneContainer
  align="left" // or "center"
  transparent={true}
  verticalAnchor={theme.layout.verticalAnchorLeft}
  theme={theme}
>
  {/* Scene content */}
</SceneContainer>
```

**Props:**
- `align`: 'left' | 'center' (default: 'left')
- `verticalAnchor`: 0–1, fraction of frame height where content starts (default: 0.38)
- `transparent`: If true, backgroundColor transparent to show BackgroundLayer
- `noPadding`: If true, don't apply padding
- `theme`: Theme object

**Features:**
- Provides ThemeContext to child components
- Auto-applies theme colors, fonts, layout values
- Supports left and center alignment modes

### BackgroundLayer
Animated background with gradient blobs and dot grid.

```tsx
<BackgroundLayer
  color={theme.colors.primary}
  showDots={true}
  theme={theme}
/>
```

**Props:**
- `color`: Accent color for gradient blobs
- `showDots`: Render dot grid overlay (default: true)
- `theme`: Theme object (for fallback colors)

### AnimatedText
Wrapper for text with entrance animations.

```tsx
<AnimatedText
  delay={10}
  type="zoom" // or "slide"
  style={{
    color: theme.colors.text,
    fontFamily: theme.typography.headline,
    fontSize: theme.typography.sizes.headline,
  }}
>
  {renderHighlightedText(title, accentColor)}
</AnimatedText>
```

**Props:**
- `delay`: Frame delay before animation starts
- `type`: "zoom" | "slide" — animation type
- `style`: CSS style object
- `children`: Text content

### AnimatedList
List with staggered item animations.

```tsx
<AnimatedList
  items={["Item 1", "Item 2", "Item 3"]}
  delay={20}
  stagger={5}
  style={{
    color: theme.colors.muted,
    fontSize: theme.typography.sizes.body,
  }}
/>
```

**Props:**
- `items`: Array of strings
- `delay`: Frame delay before animation starts
- `stagger`: Frames between each item animation
- `style`: CSS style object

### TimelineItem
Component for timeline-style items.

```tsx
<TimelineItem
  label="Step 1"
  value="Description"
  accentColor={theme.colors.primary}
  theme={theme}
/>
```

### Card
Card component with glow effect and backdrop blur.

```tsx
<Card
  accentColor={theme.colors.primary}
  glow={true}
  padding={24}
  borderRadius={16}
  delay={0}
  theme={theme}
>
  {/* Content */}
</Card>
```

**Props:**
- `children`: Content inside card
- `accentColor`: Accent color for border and glow (default: theme.colors.primary)
- `glow`: Show radial gradient glow effect (default: false)
- `padding`: Padding inside card (default: 24)
- `borderRadius`: Border radius (default: 16)
- `delay`: Frame delay before animation starts (default: 0)
- `theme`: Theme object

### CountUp
Animated number counter with spring animation.

```tsx
<CountUp
  value={150}
  suffix=" GB/s"
  fontSize={120}
  accentColor={theme.colors.success}
  delay={10}
  theme={theme}
/>
```

**Props:**
- `value`: Target number (number)
- `suffix`: Optional suffix string (e.g., " GB/s")
- `fontSize`: Font size for number (default: theme.typography.sizes.hero)
- `accentColor`: Color for number (default: theme.colors.primary)
- `delay`: Frame delay before animation starts (default: 10)
- `theme`: Theme object

### ProgressBar
Progress bar with timing-based or frame-based animation.

```tsx
<ProgressBar
  startTime={0}
  endTime={10}
  accentColor={theme.colors.primary}
  height={8}
  showPercentage={true}
  theme={theme}
/>
```

**Props:**
- `startTime`: Time in seconds when progress starts (optional)
- `endTime`: Time in seconds when progress ends (optional)
- `value`: Value 0-100 (fallback if timing not provided)
- `duration`: Frames to fill (fallback, default: 60)
- `accentColor`: Accent color for progress bar (default: theme.colors.primary)
- `height`: Height of progress bar (default: 8)
- `showPercentage`: Show percentage text (default: true)
- `theme`: Theme object

### CaptionRenderer
Subtitle renderer from JSON file with _captions.json suffix.

```tsx
<CaptionRenderer
  src={staticFile('captions/macbookM5_captions.json')}
  theme={theme}
  accentColor={theme.colors.primary}
  fontSize={48}
  bottom={120}
/>
```

**Props:**
- `src`: staticFile path to JSON captions (e.g., staticFile('captions/m5.json'))
- `theme`: Theme object
- `accentColor`: Color for active word (default: theme.colors.primary)
- `fontSize`: Font size for text (default: 48)
- `bottom`: Distance from bottom of frame (default: 120)

**JSON Format:**
JSON file must have this format:
```json
[
  {
    "text": "Full caption text",
    "start": 0.0,
    "end": 2.5,
    "words": [
      { "word": "Full", "start": 0.0, "end": 0.3 },
      { "word": "caption", "start": 0.3, "end": 0.8 },
      { "word": "text", "start": 0.8, "end": 2.5 }
    ]
  }
]
```

### TitleCard
Card component for title-style content.

```tsx
<TitleCard
  title="Title"
  subtitle="Subtitle"
  accentColor={theme.colors.primary}
  theme={theme}
/>
```

---

## SCENE GENERATION RULES FOR LLM

When LLM generates a new scene for specific video segment, it must:
- Choose left or center alignment based on content type
- Apply keyword highlighting to headline using renderHighlightedText()
- Choose an accent color for scene based on emotional tone (from theme colors)
- Don't use any card, box, or bordered container for text
- Fill at least 65% of 1920px frame height with content
- Use theme typography values — don't hardcode font sizes or font families
- Pass theme prop to all components
- Use transparent={true} to show BackgroundLayer

---

## UTILITY FUNCTIONS

### renderHighlightedText
```tsx
import { renderHighlightedText } from '../utils/parseHighlight';

const highlighted = renderHighlightedText(
  "AI Performance *3.5x faster*",
  theme.colors.primary
);
// Returns array of spans with appropriate colors
```

---

## WHAT DOES NOT CHANGE

- Typography-first design direction
- Dark background for dark themes, bright for bright-education
- One dominant accent color per scene
- No gradients on text, no rainbow palettes
- Vietnamese primary, English for technical terms only
- Animation primitives — spring, interpolate, useCurrentFrame
- Core layout principles (left/center alignment, padding rules)