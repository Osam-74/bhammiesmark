
export interface WatermarkSettings {
  text: string;
  showText: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  
  showLogo: boolean;
  logoUrl: string | null;
  logoScale: number;
  
  opacity: number;
  angle: number;
  spacingX: number;
  spacingY: number;
}

export interface BatchImage {
  id: string;
  file: File;
  img: HTMLImageElement;
  name: string;
}

export const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana'
];
