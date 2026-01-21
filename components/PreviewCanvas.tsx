
import React, { useEffect, useCallback } from 'react';
import { WatermarkSettings } from '../types';
import { renderWatermark } from '../utils/drawEngine';

interface PreviewCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  baseImage: HTMLImageElement;
  logoImage: HTMLImageElement | null;
  settings: WatermarkSettings;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ canvasRef, baseImage, logoImage, settings }) => {
  const draw = useCallback(() => {
    if (canvasRef.current) {
      renderWatermark(canvasRef.current, baseImage, logoImage, settings);
    }
  }, [baseImage, logoImage, settings, canvasRef]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full shadow-2xl rounded-lg object-contain bg-white transition-opacity duration-300"
        style={{ width: 'auto', height: 'auto', maxHeight: '100%' }}
      />
    </div>
  );
};

export default PreviewCanvas;
