import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadLexend } from '@remotion/google-fonts/Lexend';
import { loadFont as loadBigShoulders } from '@remotion/google-fonts/BigShoulders';

export const fontFamilies = {
  fraunces: loadFraunces().fontFamily,
  bricolage: loadBricolage().fontFamily,
  spaceMono: loadSpaceMono().fontFamily,
  spaceGrotesk: loadSpaceGrotesk().fontFamily,
  lexend: loadLexend().fontFamily,
  bigShoulders: loadBigShoulders().fontFamily,
};