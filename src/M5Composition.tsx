import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, staticFile } from 'remotion';
import { TitleScene } from './templates/TitleScene';
import { SectionDividerScene } from './templates/SectionDividerScene';
import { ComparisonScene } from './templates/ComparisonScene';
import { StatisticScene } from './templates/StatisticScene';
import { OutroScene } from './templates/OutroScene';
import { BackgroundLayer } from './components';
import { fontFamilies } from './Root';

export const M5Composition: React.FC = () => {
  const { fps } = useVideoConfig();

  // Timing from audio/macbookM5.json
  // Segment 0: 0.0 - 4.35s
  // Segment 1: 4.35 - 8.65s
  // Segment 2: 8.65 - 15.15s
  // Segment 3: 15.15 - 20.7s
  // Segment 4: 20.7 - 27.44s
  // Segment 5: 27.44 - 33.46s
  // Segment 6: 33.46 - 40.86s
  // Segment 7: 40.86 - 48.73s

  const s0Frames = Math.round(4.35 * fps);
  const s1Frames = Math.round(8.65 * fps) - s0Frames;
  const s2Frames = Math.round(17.25 * fps) - (s0Frames + s1Frames);
  const s3Frames = Math.round(23 * fps) - (s0Frames + s1Frames + s2Frames);
  const s4Frames = Math.round(28.17 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames);
  const s5Frames = Math.round(34.78 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames);
  const s6Frames = Math.round(41.25 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames);
  const s7Frames = Math.round(48.73 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0F1C' }}>
      <Audio src={staticFile('audio/macbookM5.wav')} />
      
      {/* Persistent Background Layer — nằm trên tất cả scene để giữ continuity */}
      <BackgroundLayer color="#7DD3FC" showDots={true} />
      
      {/* Segment 0: Hook */}
      <Sequence from={0} durationInFrames={s0Frames}>
        <TitleScene 
          title="Hiệu năng AI *gấp ba lần rưỡi*"
          category="M5 CHIP"
          subtitle="Bước nhảy vọt về xử lý trí tuệ nhân tạo"
          accentColor="#7DD3FC"
          transparent={true}
        />
      </Sequence>

      {/* Segment 1: Intro */}
      <Sequence from={s0Frames} durationInFrames={s1Frames}>
        <SectionDividerScene 
          title="Apple *M5* Chip"
          accentColor="#A78BFA"
          transparent={true}
        />
      </Sequence>

      {/* Segment 2: GPU/Neural Accelerator */}
      <Sequence from={s0Frames + s1Frames} durationInFrames={s2Frames}>
        <TitleScene 
          title="Nhân GPU có *Neural Accelerator*"
          subtitle="Mỗi nhân GPU giờ có bộ xử lý AI riêng"
          accentColor="#34D399"
          transparent={true}
        />
      </Sequence>

      {/* Segment 3: LLM Comparison */}
      <Sequence from={s0Frames + s1Frames + s2Frames} durationInFrames={s3Frames}>
        <ComparisonScene 
          topTitle="*LLM* trên thiết bị"
          topItems={["Chạy trực tiếp trên máy", "Không cần kết nối Cloud"]}
          bottomTitle="Nhanh hơn *M4*"
          bottomItems={["Phản hồi tức thì", "Bảo mật dữ liệu tuyệt đối"]}
          topAccentColor="#7DD3FC"
          bottomAccentColor="#FBBF24"
          transparent={true}
        />
      </Sequence>

      {/* Segment 4: Memory Bandwidth */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames} durationInFrames={s4Frames}>
        <StatisticScene 
          value={150}
          suffix=" GB/s"
          label="Băng thông bộ nhớ"
          accentColor="#34D399"
          transparent={true}
        />
      </Sequence>

      {/* Segment 5: CPU/GPU Access */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames} durationInFrames={s5Frames}>
        <ComparisonScene 
          topTitle="*CPU & GPU*"
          topItems={["Truy cập dữ liệu siêu tốc", "Tối ưu hóa đa nhiệm"]}
          bottomTitle="Giảm *nghẽn*"
          bottomItems={["Xử lý tác vụ nặng mượt mà", "Hiệu suất duy trì ổn định"]}
          topAccentColor="#A78BFA"
          bottomAccentColor="#7DD3FC"
          transparent={true}
        />
      </Sequence>

      {/* Segment 6: Battery/Efficiency */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames} durationInFrames={s6Frames}>
        <StatisticScene 
          value={24}
          suffix=" Giờ"
          label="Thời lượng Pin"
          accentColor="#FBBF24"
          transparent={true}
        />
      </Sequence>

      {/* Segment 7: Outro */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames} durationInFrames={s7Frames}>
        <OutroScene 
          title="Kỷ nguyên *AI*"
          subtitle="Apple M5 - Thiết kế cho tương lai"
          accentColor="#7DD3FC"
          transparent={true}
        />
      </Sequence>

      {/* Persistent Brand Label */}
      <div 
        style={{
          position: 'absolute',
          top: 48,
          right: 64,
          color: '#94A3B8',
          fontFamily: fontFamilies.spaceGrotesk,
          fontSize: 24,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          zIndex: 10
        }}
      >
        Apple Tech Insight
      </div>
    </AbsoluteFill>
  );
};
