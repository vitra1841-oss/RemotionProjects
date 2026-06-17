import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';

import "./index.css";
import { Composition } from "remotion";
import { M5Composition } from "./M5Composition";

const spaceMono = loadSpaceMono();
const bricolage = loadBricolage();
const fraunces = loadFraunces();
const spaceGrotesk = loadSpaceGrotesk();
const lexend = loadLexend();

export const fontFamilies = {
  fraunces: fraunces.fontFamily,
  bricolage: bricolage.fontFamily,
  spaceMono: spaceMono.fontFamily,
  spaceGrotesk: spaceGrotesk.fontFamily,
  lexend: lexend.fontFamily,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="M5-Chip"
        component={M5Composition}
        durationInFrames={1462}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
