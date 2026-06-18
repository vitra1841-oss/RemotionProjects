import { fontFamilies } from './fonts';
export { fontFamilies };

import "./index.css";
import { Composition } from "remotion";
import { M5Composition } from "./compositions/M5Composition";
import { MCPComposition } from "./compositions/MCPComposition";

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
      <Composition
        id="MCP-Protocol"
        component={MCPComposition}
        durationInFrames={1632}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
