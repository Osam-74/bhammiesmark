
import { WatermarkSettings } from '../types';

export const renderWatermark = (
  canvas: HTMLCanvasElement,
  baseImage: HTMLImageElement,
  logoImage: HTMLImageElement | null,
  settings: WatermarkSettings
) => {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  canvas.width = baseImage.width;
  canvas.height = baseImage.height;

  // 1. Draw Background
  ctx.drawImage(baseImage, 0, 0);

  // 2. Setup Styles
  ctx.globalAlpha = settings.opacity;
  ctx.fillStyle = settings.color;
  ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  // 3. Calculate Dimensions
  let textWidth = 0;
  if (settings.showText && settings.text) {
    textWidth = ctx.measureText(settings.text).width;
  }

  let logoW = 0;
  let logoH = 0;
  if (settings.showLogo && logoImage) {
    const aspect = logoImage.width / logoImage.height;
    logoH = (settings.fontSize * (settings.logoScale / 50));
    logoW = logoH * aspect;
  }

  // Reduce internal gap to 0 when determining the tile unit to allow true zero-spacing
  const internalGap = (settings.showLogo && settings.showText) ? 12 : 0;
  const unitWidth = (textWidth > 0 ? textWidth : 0) + (logoW > 0 ? logoW : 0) + (textWidth > 0 && logoW > 0 ? internalGap : 0);
  const unitHeight = Math.max(settings.fontSize, logoH);

  // 4. Grid Loop
  const angleRad = (settings.angle * Math.PI) / 180;
  const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
  
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angleRad);

  const stepX = Math.max(1, unitWidth + settings.spacingX);
  const stepY = Math.max(1, unitHeight + settings.spacingY);

  const startX = -diag;
  const endX = diag;
  const startY = -diag;
  const endY = diag;

  for (let y = startY; y < endY; y += stepY) {
    const offsetX = (Math.floor(y / stepY) % 2) * (stepX / 2);
    for (let x = startX; x < endX; x += stepX) {
      const drawX = x + offsetX;
      const drawY = y;

      let currentX = drawX - unitWidth / 2;
      
      if (settings.showLogo && logoImage) {
        ctx.drawImage(logoImage, currentX, drawY - logoH / 2, logoW, logoH);
        currentX += logoW + internalGap;
      }

      if (settings.showText && settings.text) {
        ctx.fillText(settings.text, settings.showLogo && logoImage ? currentX + textWidth / 2 : drawX, drawY);
      }
    }
  }

  ctx.restore();
  ctx.globalAlpha = 1.0;
};
