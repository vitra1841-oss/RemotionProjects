import { fontFamilies } from './fonts';
export { fontFamilies };

import "./index.css";
import { Composition } from "remotion";
import { M5Composition } from "./M5Composition";

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
