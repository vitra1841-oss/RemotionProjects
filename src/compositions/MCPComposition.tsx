import React from 'react';
import { AbsoluteFill, Audio, Sequence, useVideoConfig, staticFile } from 'remotion';
import { TitleScene } from '../templates/TitleScene';
import { SectionDividerScene } from '../templates/SectionDividerScene';
import { ComparisonScene } from '../templates/ComparisonScene';
import { OutroScene } from '../templates/OutroScene';
import { BackgroundLayer } from '../components';
import { themes } from '../theme';
import { fontFamilies } from '../fonts';

export const MCPComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  const theme = themes['dark-tech'];

  // Timings from audio/MCP.json
  const s0Frames = Math.round(5.8 * fps);
  const s1Frames = Math.round(13.09 * fps) - s0Frames;
  const s2Frames = Math.round(19.69 * fps) - (s0Frames + s1Frames);
  const s3Frames = Math.round(24.3 * fps) - (s0Frames + s1Frames + s2Frames);
  const s4Frames = Math.round(28.91 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames);
  const s5Frames = Math.round(35.83 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames);
  const s6Frames = Math.round(41.44 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames);
  const s7Frames = Math.round(48.54 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames);
  const s8Frames = Math.round(54.4 * fps) - (s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames + s7Frames);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <Audio src={staticFile('audio/MCP.wav')} />
      
      {/* Persistent Background Layer */}
      <BackgroundLayer color={theme.colors.primary} showDots={true} theme={theme} />
      
      {/* Segment 0: Hook */}
      <Sequence from={0} durationInFrames={s0Frames}>
        <TitleScene 
          title="AI có thể *tự hành động*?"
          category="MCP PROTOCOL"
          subtitle="Đặt đơn hàng, đọc file, gọi API thật"
          accentColor={theme.colors.primary}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 1: The Problem - Isolated LLM */}
      <Sequence from={s0Frames} durationInFrames={s1Frames}>
        <TitleScene 
          title="Bộ não trong *hộp kính*"
          subtitle="LLM suy nghĩ tốt nhưng bị cô lập với thế giới thực"
          accentColor={theme.colors.accent}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 2: Integration Difficulty */}
      <Sequence from={s0Frames + s1Frames} durationInFrames={s2Frames}>
        <ComparisonScene 
          centerTitle="THÁCH THỨC"
          topTitle="*Tích hợp* thủ công"
          topItems={["Viết code riêng cho mỗi công cụ", "Tốn hàng giờ lập trình"]}
          topConclusion="Chậm & Tốn kém"
          bottomTitle="Khó *duy trì*"
          bottomItems={["Phức tạp khi mở rộng", "Dễ gây lỗi hệ thống"]}
          bottomConclusion="Thiếu linh hoạt"
          topAccentColor={theme.colors.primary}
          bottomAccentColor={theme.colors.subAccent2}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 3: Messy Connections */}
      <Sequence from={s0Frames + s1Frames + s2Frames} durationInFrames={s3Frames}>
        <TitleScene 
          title="Kết nối *chằng chịt*"
          subtitle="Mới kết nối không nhất quán và rất khó mở rộng"
          accentColor={theme.colors.subAccent4}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 4: Solution - MCP Introduction */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames} durationInFrames={s4Frames}>
        <SectionDividerScene 
          title="Model Context *Protocol*"
          eyebrow="GIẢI PHÁP"
          tagline="Giao thức chuẩn hóa kết nối cho LLM"
          accentColor={theme.colors.success}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 5: Standardized Connection */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames} durationInFrames={s5Frames}>
        <TitleScene 
          title="Ngôn ngữ *chung* duy nhất"
          subtitle="Cho phép LLM nói chuyện với mọi công cụ bên ngoài"
          accentColor={theme.colors.primary}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 6: Capabilities */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames} durationInFrames={s6Frames}>
        <ComparisonScene 
          centerTitle="KHẢ NĂNG"
          topTitle="*Đọc* dữ liệu"
          topItems={["Truy cập tài liệu (Resources)", "Phản hồi thông tin thực tế"]}
          topConclusion="Knowledge access"
          bottomTitle="*Thực hiện* lệnh"
          bottomItems={["Sử dụng công cụ (Tools)", "Tương tác với hệ thống"]}
          bottomConclusion="Real action"
          topAccentColor={theme.colors.success}
          bottomAccentColor={theme.colors.subAccent1}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 7: Extended Arm Metaphor */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames} durationInFrames={s7Frames}>
        <TitleScene 
          title="Cánh tay *nối dài*"
          subtitle="Biến bộ não AI đơn thuần thành trợ lý thực thụ"
          accentColor={theme.colors.accent}
          transparent={true}
          theme={theme}
        />
      </Sequence>

      {/* Segment 8: Conclusion */}
      <Sequence from={s0Frames + s1Frames + s2Frames + s3Frames + s4Frames + s5Frames + s6Frames + s7Frames} durationInFrames={s8Frames}>
        <OutroScene 
          title="Kỷ nguyên *tương tác*"
          subtitle="MCP - Thay đổi cách AI kết nối với thế giới"
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
        AI Technology Insight
      </div>
    </AbsoluteFill>
  );
};
