import { SpringConfig } from 'remotion';

export interface ThemeColors {
  bg: string;           // nền chính
  text: string;         // chữ chính
  muted: string;        // chữ phụ / label nhỏ
  primary: string;      // accent màu 1
  accent: string;       // accent màu 2
  success: string;
  divider: string;      // màu đường kẻ
  subAccent1: string;   // accent phụ 1
  subAccent2: string;   // accent phụ 2
  subAccent3: string;   // accent phụ 3
  subAccent4: string;   // accent phụ 4
}

export interface ThemeTypography {
  headline: string;     // fontFamily cho headline lớn
  body: string;         // fontFamily cho body/subtitle
  label: string;        // fontFamily cho uppercase labels
  mono: string;         // fontFamily cho code/technical
  sizes: {
    hero: number;       // số to nhất — statistic, outro title
    headline: number;   // headline chính các scene
    subheadline: number;// headline phụ — comparison columns
    body: number;       // body text, items
    label: number;      // uppercase label nhỏ
    caption: number;    // chú thích, brand label
  };
  weights: {
    black: number;
    bold: number;
    normal: number;
  };
}

export interface ThemeAnimation {
  spring: SpringConfig;       // spring cho entrance chính
  springSlow: SpringConfig;   // spring cho entrance phụ, mượt hơn
  springFast: SpringConfig;   // spring cho micro-interactions
}

export interface ThemeLayout {
  framePadding: number;       // padding ngang của frame
  verticalAnchorLeft: number; // 0–1, vị trí content bắt đầu cho left-align scenes
  lineHeight: {
    tight: number;
    normal: number;
    loose: number;
  };
  gap: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  animation: ThemeAnimation;
  layout: ThemeLayout;
}
