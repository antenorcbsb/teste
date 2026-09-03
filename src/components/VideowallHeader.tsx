import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  LayoutGrid,
  Columns4,
  Sliders,
  Radio,
  Clock,
  Tv,
} from 'lucide-react';
import { LayoutMode, ScaleMode } from '../types';
import { ViewportInfo } from '../hooks/useVideowallScaler';

interface VideowallHeaderProps {
  viewport: ViewportInfo;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  scaleMode: ScaleMode;
  setScaleMode: (mode: ScaleMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  lastUpdated: Date | null;
}

export const VideowallHeader: React.FC<VideowallHeaderProps> = ({
  viewport,
  layoutMode,
  setLayoutMode,
  scaleMode,
  setScaleMode,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  lastUpdated,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-PT', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-PT', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="centcom-header"
      className="flex-shrink-0 bg-[#0a1124] border-b border-slate-800/80 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg shadow-black/40 z-30"
    >
      {/* Esquerda: Identificação Oficial BSB Braga & CENTCOM */}
      <div className="flex items-center gap-2.5">
        {/* Emblema BSB */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-amber-700 p-0.5 shadow-md shadow-red-950/50 flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full bg-[#0b1220] rounded-[6px] flex items-center justify-center">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-white uppercase font-mono leading-tight">
              BATALHÃO SAPADORES BOMBEIROS DE BRAGA
            </h1>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              CENTCOM ATIVO
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
            <span className="text-sky-400 font-semibold">SITUAÇÃO OPERACIONAL</span>
            <span className="text-slate-600">•</span>
            <span>Centro de Comunicações & Gestão de Meios</span>
          </div>
        </div>
      </div>

      {/* Centro: Relógio Oficial em Tempo Real */}
      <div className="hidden md:flex items-center gap-3 bg-[#0f172a]/90 border border-slate-800 rounded-lg px-3 py-1 shadow-inner">
        <Clock className="w-4 h-4 text-sky-400" />
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {currentDate}
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-white tracking-widest tabular-nums">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Direita: Ferramentas do Videowall (Resolução, Escala, Layout, Ecrã Inteiro) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Badge da Resolução do Ecrã Detetada */}
        <div
          title="Resolução nativa e ajuste automático ao ecrã"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-md text-[11px] font-mono text-slate-300"
        >
          <Tv className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {viewport.width}×{viewport.height}
          </span>
          <span className="text-cyan-400 font-bold">
            ({viewport.aspectLabel})
          </span>
        </div>

        {/* Botão de Alternar Modo: Ajuste Automático 100% vs Scroll Livre */}
        <button
          id="btn-scale-mode"
          onClick={() => setScaleMode(scaleMode === 'auto-fit' ? 'scroll' : 'auto-fit')}
          title={
            scaleMode === 'auto-fit'
              ? 'Modo Videowall Auto-Fit (100% no ecrã sem scroll). Clique para alternar para scroll livre.'
              : 'Modo Rolagem Livre. Clique para ativar ajuste automático ao ecrã.'
          }
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
            scaleMode === 'auto-fit'
              ? 'bg-sky-950/60 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-950'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <span>{scaleMode === 'auto-fit' ? 'Auto-Fit 100%' : 'Scroll Livre'}</span>
        </button>

        {/* Botão de Alternar Layout */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-md p-0.5">
          <button
            id="btn-layout-quad"
            onClick={() => setLayoutMode('quad')}
            title="Layout 4 Quadrantes (2x2)"
            className={`p-1.5 rounded transition-all ${
              layoutMode === 'quad'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-layout-panoramic"
            onClick={() => setLayoutMode('panoramic')}
            title="Layout Panorâmico (4 Colunas para Telas Largas)"
            className={`p-1.5 rounded transition-all ${
              layoutMode === 'panoramic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns4 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Atualizar Manualmente */}
        <button
          id="btn-refresh-data"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Atualizar dados do Google Sheets e IPMA agora"
          className="p-1.5 sm:px-2.5 sm:py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs flex items-center gap-1 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          <span className="hidden sm:inline">Sincronizar</span>
        </button>

        {/* Tela Inteira (F11 / Fullscreen) */}
        <button
          id="btn-toggle-fullscreen"
          onClick={viewport.toggleFullscreen}
          title={viewport.isFullscreen ? 'Sair do Ecrã Inteiro' : 'Entrar em Ecrã Inteiro (Videowall)'}
          className="p-1.5 sm:px-2.5 sm:py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 rounded-md text-xs flex items-center gap-1 transition-all"
        >
          {viewport.isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Janela</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ecrã Inteiro</span>
            </>
          )}
        </button>

        {/* Definições / Informação */}
        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          title="Configurações e IDs de Conexão"
          className="p-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md text-xs transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
