import { useState, useEffect, useCallback } from 'react';
import { LayoutMode, ScaleMode } from '../types';

export interface ViewportInfo {
  width: number;
  height: number;
  scale: number;
  aspectRatio: number;
  aspectLabel: string;
  isUltrawide: boolean;
  isPortrait: boolean;
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
}

export function useVideowallScaler(scaleMode: ScaleMode = 'auto-fit', layoutMode: LayoutMode = 'quad') {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    scale: 1,
    aspectRatio: 16 / 9,
    aspectLabel: '16:9',
    isUltrawide: false,
    isPortrait: false,
    isFullscreen: false,
    toggleFullscreen: async () => {},
  });

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / (height || 1);

    // Identifica o formato de tela
    let aspectLabel = '16:9';
    if (aspectRatio > 2.2) aspectLabel = '21:9 UltraWide';
    else if (aspectRatio > 3.0) aspectLabel = '32:9 SuperWide';
    else if (aspectRatio < 1.0) aspectLabel = 'Vertical (Portrait)';
    else if (aspectRatio < 1.4) aspectLabel = '4:3';
    else if (aspectRatio < 1.7) aspectLabel = '16:10';

    const isUltrawide = aspectRatio >= 2.1;
    const isPortrait = aspectRatio < 1.0;

    // Cálculo do multiplicador proporcional baseado em 1920x1080 como referência padrão
    // No modo auto-fit, calculamos a escala geométrica para que caiba 100% no viewport
    const scaleX = width / 1920;
    const scaleY = height / 1080;
    const rawScale = Math.min(scaleX, scaleY);
    // Limites de escala para legibilidade de texto no centro de operações
    const scale = Math.max(0.65, Math.min(2.5, Number(rawScale.toFixed(3))));

    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    // Atualiza as variáveis CSS globais para sincronização de layout
    const root = document.documentElement;
    root.style.setProperty('--vw-scale', String(scale));
    root.style.setProperty('--vw-width', `${width}px`);
    root.style.setProperty('--vw-height', `${height}px`);

    setViewport(prev => ({
      ...prev,
      width,
      height,
      scale,
      aspectRatio,
      aspectLabel,
      isUltrawide,
      isPortrait,
      isFullscreen,
    }));
  }, [scaleMode, layoutMode]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen toggle not available or allowed in iframe:', err);
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    document.addEventListener('fullscreenchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('fullscreenchange', updateDimensions);
    };
  }, [updateDimensions]);

  return {
    ...viewport,
    toggleFullscreen,
  };
}
