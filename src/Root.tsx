import { fontFamilies } from './fonts';
export { fontFamilies };

import "./index.css";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { M5Composition } from "./compositions/M5Composition";
import { MCPComposition } from "./compositions/MCPComposition";
import { VyComposition } from "./compositions/VyComposition";
import { HermesComposition } from "./compositions/hermesComposition";
import { MathEditorComposition } from "./compositions/matheditorComposition";
import { FRAME_WIDTH, FRAME_HEIGHT } from "./config";

const resolveDimensions: CalculateMetadataFunction<Record<string, unknown>> = ({ props }) => ({
  width: (props?.width as number) ?? FRAME_WIDTH,
  height: (props?.height as number) ?? FRAME_HEIGHT,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Vy-Love"
        component={VyComposition}
        durationInFrames={1743}
        fps={30}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        calculateMetadata={resolveDimensions}
      />
      <Composition
        id="M5-Chip"
        component={M5Composition}
        durationInFrames={1462}
        fps={30}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        calculateMetadata={resolveDimensions}
      />
      <Composition
        id="MCP-Protocol"
        component={MCPComposition}
        durationInFrames={1632}
        fps={30}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        calculateMetadata={resolveDimensions}
      />
      <Composition
        id="Hermes-Agent"
        component={HermesComposition}
        durationInFrames={1768}
        fps={30}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        calculateMetadata={resolveDimensions}
      />
      <Composition
        id="Math-Editor"
        component={MathEditorComposition}
        durationInFrames={1273}
        fps={30}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        calculateMetadata={resolveDimensions}
      />
    </>
  );
};
