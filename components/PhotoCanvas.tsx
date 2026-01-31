
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FrameSettings, TEMPLATE_CONFIG } from '../types';

interface PhotoCanvasProps {
  image: HTMLImageElement | null;
  frameImage: HTMLImageElement | null;
  settings: FrameSettings;
}

export interface PhotoCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const PhotoCanvas = forwardRef<PhotoCanvasHandle, PhotoCanvasProps>(({ image, frameImage, settings }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));

  useEffect(() => {
    if (!image || !frameImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Pobieramy wymiary ramki. Dla SVG bez jawnych wymiarów próbujemy 
    // pobrać naturalne wymiary lub domyślnie używamy proporcji z configu.
    let fW = frameImage.width || frameImage.naturalWidth;
    let fH = frameImage.height || frameImage.naturalHeight;

    // Fallback dla SVG które mogą zgłaszać 0/0 jeśli nie mają width/height w XML
    if (fW === 0 || fH === 0) {
       fW = 2000; // Wysoka jakość bazowa
       fH = fW / TEMPLATE_CONFIG.aspectRatio;
    }

    canvas.width = fW;
    canvas.height = fH;

    const hX = TEMPLATE_CONFIG.holeX * canvas.width;
    const hY = TEMPLATE_CONFIG.holeY * canvas.height;
    const hW = TEMPLATE_CONFIG.holeWidth * canvas.width;
    const hH = TEMPLATE_CONFIG.holeHeight * canvas.height;

    // 1. Czyścimy tło
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Rysujemy zdjęcie użytkownika (pod ramką)
    const imgRatio = image.width / image.height;
    const holeRatio = hW / hH;
    
    let drawW, drawH, drawX, drawY;

    // Logika dopasowania zdjęcia (object-fit: cover)
    if (imgRatio > holeRatio) {
      drawH = hH * settings.zoom;
      drawW = drawH * imgRatio;
    } else {
      drawW = hW * settings.zoom;
      drawH = drawW / imgRatio;
    }

    // Centrowanie w okienku + przesunięcie użytkownika
    drawX = hX + (hW - drawW) / 2 + settings.offsetX;
    drawY = hY + (hH - drawH) / 2 + settings.offsetY;

    ctx.save();
    // Maskowanie zdjęcia do obszaru okienka
    ctx.beginPath();
    ctx.rect(hX, hY, hW, hH);
    ctx.clip();
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 3. Nakładamy ramkę na wierzch
    // Przeglądarki renderują SVG do canvas przy użyciu drawImage
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

  }, [image, frameImage, settings]);

  return (
    <div className="relative w-full flex justify-center items-center bg-gray-50 p-2 rounded-xl overflow-hidden border border-gray-200">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto shadow-2xl rounded-sm bg-white"
        style={{ maxHeight: '75vh' }}
      />
    </div>
  );
});

export default PhotoCanvas;
