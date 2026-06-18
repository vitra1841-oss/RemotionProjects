import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, staticFile } from 'remotion';
import { TitleScene } from '../templates/TitleScene';
import { SectionDividerScene } from '../templates/SectionDividerScene';
import { ComparisonScene } from '../templates/ComparisonScene';
import { StatisticScene } from '../templates/StatisticScene';
import { OutroScene } from '../templates/OutroScene';
import { BackgroundLayer, CaptionRenderer } from '../components';
import { themes } from '../theme';
import { fontFamilies } from '../Root';

export const M5Composition: React.FC = () => {
  const { fps } = useVideoConfig();
  const theme = themes['dark-tech'];

  // Timing from audio/macbookM5.json
  const s0Frames = Math.round(4.35 * fps);
  const s1Frames = Math.round(8.65 * fps) - s0Frames;
  const s2Frames = Math.round(17.25 * fps) - (s0Frames + s1Frames);
  const s3Frames = Math.round(23 * fps) - (s0Frames + s1Frames + s2Frames);
  const s4Frames = Math.round(28.17 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames);
  const s5Frames = Math.round(34.78 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames);
  const s6Frames = Math.round(41.25 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames);
  const s7Frames = Math.round(48.73 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames);


  return (
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
        <Audio src={staticFile('audio/macbookM5.wav')} />
        
        <BackgroundLayer color={theme.colors.primary} showDots={true} theme={theme} />
        
        {/* Segment 0: Hook */}
        <Sequence from={0} durationInFrames={s0Frames}>
          <TitleScene
            title="Hiệu năng AI *gấp ba lần rưỡi*"
            category="M5 CHIP"
            subtitle="Bước nhảy vọt về xử lý trí tuệ nhân tạo"
            accentColor={theme.colors.primary}
            transparent={true}
            theme={theme}
            start={2.73}
            sequenceFrom={0}
          />
        </Sequence>
        {/* Segment 1: Intro */}
        <Sequence from={s0Frames} durationInFrames={s1Frames}>
          <SectionDividerScene 
            title="Apple *M5* Chip"
            eyebrow="Thế hệ mới"
            tagline="Kiến trúc chip Apple Silicon tiên tiến nhất"
            accentColor={theme.colors.accent}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Segment 2: GPU/Neural Accelerator */}
        <Sequence from={s0Frames + s1Frames} durationInFrames={s2Frames}>
          <TitleScene
            title="Nhân GPU có *Neural Accelerator*"
            subtitle="Mỗi nhân GPU giờ có bộ xử lý AI riêng"
            accentColor={theme.colors.success}
            transparent={true}
            theme={theme}
            start={16.12}
            sequenceFrom={s0Frames + s1Frames}
          />
        </Sequence>

        {/* Segment 3: LLM Comparison */}
        <Sequence from={s0Frames + s1Frames + s2Frames} durationInFrames={s3Frames}>
          <ComparisonScene 
            centerTitle="*M5* vs M4"
            topTitle="*LLM* trên thiết bị"
            topItems={["Chạy trực tiếp trên máy", "Không cần kết nối Cloud"]}
            topConclusion="Private & Fast"
            bottomTitle="Nhanh hơn *M4*"
            bottomItems={["Phản hồi tức thì", "Bảo mật dữ liệu tuyệt đối"]}
            bottomConclusion="3.5× AI perf"
            topAccentColor={theme.colors.primary}
            bottomAccentColor={theme.colors.subAccent4}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Segment 4: Memory Bandwidth */}
        <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames} durationInFrames={s4Frames}>
          <StatisticScene 
            value={150}
            suffix=" GB/s"
            label="Băng thông bộ nhớ"
            accentColor={theme.colors.success}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Segment 5: CPU/GPU Access */}
        <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames} durationInFrames={s5Frames}>
          <ComparisonScene 
            centerTitle="*CPU* & GPU"
            topTitle="*CPU & GPU*"
            topItems={["Truy cập dữ liệu siêu tốc", "Tối ưu hóa đa nhiệm"]}
            topConclusion="Zero bottleneck"
            bottomTitle="Giảm *nghẽn*"
            bottomItems={["Xử lý tác vụ nặng mượt mà", "Hiệu suất duy trì ổn định"]}
            bottomConclusion="Luôn mượt mà"
            topAccentColor={theme.colors.accent}
            bottomAccentColor={theme.colors.primary}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Segment 6: Battery/Efficiency */}
        <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames} durationInFrames={s6Frames}>
          <StatisticScene 
            value={24}
            suffix=" Giờ"
            label="Thời lượng Pin"
            accentColor={theme.colors.subAccent4}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Segment 7: Outro */}
        <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames} durationInFrames={s7Frames}>
          <OutroScene 
            title="Kỷ nguyên *AI*"
            subtitle="Apple M5 - Thiết kế cho tương lai"
            accentColor={theme.colors.primary}
            transparent={true}
            theme={theme}
          />
        </Sequence>

        {/* Persistent Brand Label */}
        <div 
          style={{
            position: 'absolute',
            top: 48,
            right: 64,
            color: theme.colors.muted,
            fontFamily: fontFamilies.spaceGrotesk,
            fontSize: theme.typography.sizes.caption,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            zIndex: 10
          }}
        >
          Apple Tech Insight
        </div>
        <CaptionRenderer src={staticFile('captions/macbookM5_captions.json')} theme={theme} />
      </AbsoluteFill>
  );
};
