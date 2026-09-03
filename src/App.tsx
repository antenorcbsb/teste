import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TeatroOperacao,
  ViaturaInop,
  Agendamento,
  Observacao,
  MeteoIPMA,
  AppSettings,
} from './types';
import {
  DEFAULT_SHEET_ID,
  DEFAULT_GID_VIATURAS,
  DEFAULT_GID_CANAIS,
  DEFAULT_GID_AGENDAMENTOS,
  DEFAULT_GID_COMUNICACOES,
  carregarTeatroOperacoes,
  carregarViaturasINOP,
  carregarAgendamentos,
  carregarObservacoes,
  carregarMeteoIPMA,
} from './services/dataService';
import { useVideowallScaler } from './hooks/useVideowallScaler';
import { VideowallHeader } from './components/VideowallHeader';
import { TeatroOperacoesCard } from './components/TeatroOperacoesCard';
import { ViaturasInopCard } from './components/ViaturasInopCard';
import { AgendamentosCard } from './components/AgendamentosCard';
import { ObservacoesCard } from './components/ObservacoesCard';
import { TickerFooter } from './components/TickerFooter';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEY = 'bsb_braga_centcom_settings_v1';

export default function App() {
  // Configurações persistidas
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          mostrarApenasHoje: true, // Garante que por padrão exibe apenas os agendamentos do dia
        };
      }
    } catch (e) {
      console.warn('Erro ao carregar configurações salvas:', e);
    }
    return {
      sheetId: DEFAULT_SHEET_ID,
      gidViaturas: DEFAULT_GID_VIATURAS,
      gidCanais: DEFAULT_GID_CANAIS,
      gidAgendamentos: DEFAULT_GID_AGENDAMENTOS,
      gidComunicacoes: DEFAULT_GID_COMUNICACOES,
      dicoBraga: '0303',
      intervaloSegundos: 10,
      layoutMode: 'quad',
      scaleMode: 'auto-fit',
      mostrarApenasHoje: true,
    };
  });

  // Salva configurações quando alteradas
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Erro ao persistir configurações:', e);
    }
  }, [settings]);

  // Hook de Escala Automática ao Ecrã (Videowall Auto-Fit)
  const viewport = useVideowallScaler(settings.scaleMode, settings.layoutMode);

  // Estados dos Dados Operacionais
  const [teatros, setTeatros] = useState<TeatroOperacao[]>([]);
  const [viaturasInop, setViaturasInop] = useState<ViaturaInop[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [meteo, setMeteo] = useState<MeteoIPMA | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Carrega todos os dados das Google Sheets e IPMA
  const carregarDados = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);

    try {
      const [novosTeatros, novasViaturas, novosAgend, novasObs, novosMeteo] = await Promise.all([
        carregarTeatroOperacoes(settings.sheetId, settings.gidCanais),
        carregarViaturasINOP(settings.sheetId, settings.gidViaturas),
        carregarAgendamentos(settings.sheetId, settings.gidAgendamentos, false),
        carregarObservacoes(settings.sheetId, settings.gidComunicacoes),
        carregarMeteoIPMA(),
      ]);

      setTeatros(novosTeatros);
      setViaturasInop(novasViaturas);
      setAgendamentos(novosAgend);
      setObservacoes(novasObs);
      setMeteo(novosMeteo);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erro ao atualizar dados do CENTCOM:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [settings.sheetId, settings.gidCanais, settings.gidViaturas, settings.gidAgendamentos, settings.gidComunicacoes, settings.mostrarApenasHoje]);

  // Polling automático a cada 10 segundos
  useEffect(() => {
    carregarDados(false);
    const intervalMs = Math.max(5, settings.intervaloSegundos) * 1000;
    const interval = setInterval(() => {
      carregarDados(false);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [carregarDados, settings.intervaloSegundos]);

  // Layout dinâmico condicional
  const isQuad = settings.layoutMode === 'quad';
  const isPanoramic = settings.layoutMode === 'panoramic';
  const isAutoFit = settings.scaleMode === 'auto-fit';

  return (
    <div
      id="centcom-videowall-root"
      className={`w-screen h-screen flex flex-col bg-[#060b17] text-white select-none ${
        isAutoFit ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      {/* 1. Barra Superior Oficial com Relógio, Resolução e Controles */}
      <VideowallHeader
        viewport={viewport}
        layoutMode={settings.layoutMode}
        setLayoutMode={(mode) => setSettings(s => ({ ...s, layoutMode: mode }))}
        scaleMode={settings.scaleMode}
        setScaleMode={(mode) => setSettings(s => ({ ...s, scaleMode: mode }))}
        onRefresh={() => carregarDados(true)}
        isRefreshing={isRefreshing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lastUpdated={lastUpdated}
      />

      {/* 2. Área Principal com as 4 Secções Operacionais com Ajuste Automático ao Ecrã */}
      <main
        id="centcom-grid-container"
        className={`flex-1 p-2 sm:p-2.5 md:p-3 min-h-0 ${
          isAutoFit ? 'h-full overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        {/* Layout Panorâmico (4 Colunas Paralelas - ideal para monitores ultrawide / 21:9 / 32:9) */}
        {isPanoramic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 h-full min-h-0">
            <div className="h-full min-h-0">
              <TeatroOperacoesCard teatros={teatros} loading={loading} />
            </div>
            <div className="h-full min-h-0">
              <ViaturasInopCard viaturas={viaturasInop} loading={loading} />
            </div>
            <div className="h-full min-h-0">
              <AgendamentosCard
                agendamentos={agendamentos}
                loading={loading}
                mostrarApenasHoje={settings.mostrarApenasHoje}
                setMostrarApenasHoje={(val) =>
                  setSettings(s => ({ ...s, mostrarApenasHoje: val }))
                }
              />
            </div>
            <div className="h-full min-h-0">
              <ObservacoesCard observacoes={observacoes} loading={loading} />
            </div>
          </div>
        ) : (
          /* Layout Padrão em 4 Quadrantes (2x2) - Ajustado milimetricamente ao ecrã */
          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-none md:grid-rows-2 gap-2.5 sm:gap-3 h-full min-h-0">
            {/* Quadrante 1 (Superior Esquerdo): Teatro de Operações & Canais */}
            <div className="h-full min-h-0">
              <TeatroOperacoesCard teatros={teatros} loading={loading} />
            </div>

            {/* Quadrante 2 (Superior Direito): Viaturas Inoperacionais (com símbolos de tipologia) */}
            <div className="h-full min-h-0">
              <ViaturasInopCard viaturas={viaturasInop} loading={loading} />
            </div>

            {/* Quadrante 3 (Inferior Esquerdo): Agendamentos & Meios Alocados */}
            <div className="h-full min-h-0">
              <AgendamentosCard
                agendamentos={agendamentos}
                loading={loading}
                mostrarApenasHoje={settings.mostrarApenasHoje}
                setMostrarApenasHoje={(val) =>
                  setSettings(s => ({ ...s, mostrarApenasHoje: val }))
                }
              />
            </div>

            {/* Quadrante 4 (Inferior Direito): Observações & Ordens de Serviço */}
            <div className="h-full min-h-0">
              <ObservacoesCard observacoes={observacoes} loading={loading} />
            </div>
          </div>
        )}
      </main>

      {/* 3. Rodapé Oficial com Ticker do IPMA Braga (Meteorologia & FWI Risco de Incêndio) */}
      <TickerFooter meteo={meteo} loading={loading} />

      {/* Modal de Configurações, Parâmetros e Catálogo de Ícones de Viaturas */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onRefreshNow={() => carregarDados(true)}
      />
    </div>
  );
}
