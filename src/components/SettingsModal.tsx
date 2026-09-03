import React, { useState } from 'react';
import { X, Sliders, RefreshCw, Check, AlertCircle, Info } from 'lucide-react';
import { AppSettings, VehicleTypology } from '../types';
import { DEFAULT_SHEET_ID, DEFAULT_GID_VIATURAS, DEFAULT_GID_CANAIS, DEFAULT_GID_AGENDAMENTOS, DEFAULT_GID_COMUNICACOES } from '../services/dataService';
import { VehicleIcon } from './VehicleIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onRefreshNow: () => void;
}

const VEHICLE_CATALOG: {
  tipo: VehicleTypology;
  nome: string;
  exemplo: string;
  descricao: string;
}[] = [
  {
    tipo: 'VLCI',
    nome: 'Veículo Ligeiro de Combate a Incêndios',
    exemplo: 'VLCI 01, VLCI 02',
    descricao: 'Pick-up 4x4 de combate ligeiro e primeiro ataque com carretel de mangueira e bomba.',
  },
  {
    tipo: 'ABSC',
    nome: 'Ambulância de Socorro',
    exemplo: 'ABSC 01, ABSC 03, ABSC 05',
    descricao: 'Ambulância de emergência pré-hospitalar com battenburg refletor e cruz de socorro.',
  },
  {
    tipo: 'VCOT',
    nome: 'Veículo de Comando Tático',
    exemplo: 'VCOT 01, VCOT 02 (Toyota Hilux)',
    descricao: 'Viatura ligeira de comando 4x4 todo-o-terreno com antenas SIRESP/VHF e barra LED.',
  },
  {
    tipo: 'VAOP',
    nome: 'Veículo de Apoio Operacional',
    exemplo: 'VAOP 03',
    descricao: 'Viatura ligeira de apoio operacional e transporte logístico de equipas de socorro.',
  },
  {
    tipo: 'VCOC',
    nome: 'Veículo de Comando Operacional e Comunicações',
    exemplo: 'VCOC 03',
    descricao: 'Posto de comando móvel com equipamento de telecomunicações de teatro de operações.',
  },
  {
    tipo: 'VFCI',
    nome: 'Veículo Florestal de Combate a Incêndios',
    exemplo: 'VFCI 01, VFCI 04, VFCI 06',
    descricao: 'Camião pesado florestal de alta mobilidade com autoproteção e depósito de água.',
  },
  {
    tipo: 'VUCI',
    nome: 'Veículo Urbano de Combate a Incêndios',
    exemplo: 'VUCI 02',
    descricao: 'Autobomba pesada urbana para combate a incêndios estruturais e acidentes urbanos.',
  },
  {
    tipo: 'VTTU',
    nome: 'Veículo Tanque Tático Urbano',
    exemplo: 'VTTU 01',
    descricao: 'Autotanque pesado de abastecimento de água e apoio hídrico de grande capacidade.',
  },
  {
    tipo: 'VTTP',
    nome: 'Veículo Tanque Tático Pesado',
    exemplo: 'VTTP 01',
    descricao: 'Autotanque cisterna de grande porte para alimentação prolongada de linhas de água.',
  },
  {
    tipo: 'VE30',
    nome: 'Veículo Auto-Escada 30 Metros',
    exemplo: 'VE30 01, VE30 02',
    descricao: 'Veículo especial com escada articulada giratória e cesto para salvamento em altura.',
  },
  {
    tipo: 'VP30',
    nome: 'Veículo Plataforma 30 Metros',
    exemplo: 'VP30 01',
    descricao: 'Plataforma elevatória hidráulica de 30 metros para intervenções em edifícios altos.',
  },
  {
    tipo: 'VOPE',
    nome: 'Veículo de Operações Específicas',
    exemplo: 'VOPE 01, VOPE 02, VOPE 03',
    descricao: 'Viatura de suporte técnico, iluminação, escoramento e desencarceramento pesado.',
  },
  {
    tipo: 'BRTP',
    nome: 'Bote de Resgate / Embarcação',
    exemplo: 'BRTP 01',
    descricao: 'Embarcação insuflável rígida de salvamento em meio aquático e apoio a mergulhadores.',
  },
  {
    tipo: 'EAPH',
    nome: 'Equipa de Apoio Pré-Hospitalar',
    exemplo: 'EAPH 01, EAPH 02',
    descricao: 'Equipas de socorristas apeados de reforço ao dispositivo de eventos e prevenção.',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onRefreshNow,
}) => {
  const [activeTab, setActiveTab] = useState<'legenda' | 'conexoes'>('legenda');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onRefreshNow();
    }, 1000);
  };

  const handleResetDefaults = () => {
    setLocalSettings({
      ...localSettings,
      sheetId: DEFAULT_SHEET_ID,
      gidViaturas: DEFAULT_GID_VIATURAS,
      gidCanais: DEFAULT_GID_CANAIS,
      gidAgendamentos: DEFAULT_GID_AGENDAMENTOS,
      gidComunicacoes: DEFAULT_GID_COMUNICACOES,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1220] border border-slate-700/80 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-5 py-3.5 bg-[#0e172a] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase">
                CENTCOM • Configurações & Catálogo de Viaturas
              </h2>
              <p className="text-xs text-slate-400">
                Batalhão Sapadores Bombeiros de Braga — Videowall Operacional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-800 bg-[#0a101d] px-5 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('legenda')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'legenda'
                ? 'border-sky-500 text-sky-400 bg-[#0f172a]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🚒 Catálogo de Tipologia de Viaturas
          </button>
          <button
            onClick={() => setActiveTab('conexoes')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'conexoes'
                ? 'border-sky-500 text-sky-400 bg-[#0f172a]/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Conexão Google Sheets & Parâmetros
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          {activeTab === 'legenda' ? (
            <div>
              <div className="mb-3 p-3 bg-sky-950/30 border border-sky-500/20 rounded-lg flex items-start gap-2 text-xs text-sky-300">
                <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <p>
                  Conforme solicitado, cada viatura inserida na folha de cálculo ou agendamento é identificada automaticamente pela sua sigla oficial do BSB e representada pelo símbolo gráfico correspondente à sua tipologia (ligeiro, ambulância, comando, pesado, tanque, auto-escada, etc.).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VEHICLE_CATALOG.map(v => (
                  <div
                    key={v.tipo}
                    className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-start gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-14 h-14 bg-slate-900/90 border border-slate-700/60 rounded-md flex items-center justify-center p-1 flex-shrink-0 shadow-inner">
                      <VehicleIcon tipologia={v.tipo} size="100%" withGlow={false} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">
                          {v.tipo}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 leading-snug">
                          {v.nome}
                        </h4>
                      </div>
                      <p className="text-[10px] text-sky-400 font-mono mt-0.5">
                        Exemplos: {v.exemplo}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                        {v.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold text-sky-400 uppercase font-mono">
                  Folha Google Sheets (ID do Documento)
                </h3>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Google Spreadsheet ID
                  </label>
                  <input
                    type="text"
                    value={localSettings.sheetId}
                    onChange={e =>
                      setLocalSettings({ ...localSettings, sheetId: e.target.value })
                    }
                    className="w-full bg-[#070d18] border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    ID padrão oficial: <code>1SBvUBwqw7ZOaptKK6YehF8WErcOxzR9pmxtKnehRCx8</code>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      GID Viaturas (INOP)
                    </label>
                    <input
                      type="text"
                      value={localSettings.gidViaturas}
                      onChange={e =>
                        setLocalSettings({ ...localSettings, gidViaturas: e.target.value })
                      }
                      className="w-full bg-[#070d18] border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      GID Canais / Teatro Operações
                    </label>
                    <input
                      type="text"
                      value={localSettings.gidCanais}
                      onChange={e =>
                        setLocalSettings({ ...localSettings, gidCanais: e.target.value })
                      }
                      className="w-full bg-[#070d18] border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      GID Agendamentos
                    </label>
                    <input
                      type="text"
                      value={localSettings.gidAgendamentos}
                      onChange={e =>
                        setLocalSettings({
                          ...localSettings,
                          gidAgendamentos: e.target.value,
                        })
                      }
                      className="w-full bg-[#070d18] border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      GID Observações / Comunicações
                    </label>
                    <input
                      type="text"
                      value={localSettings.gidComunicacoes}
                      onChange={e =>
                        setLocalSettings({
                          ...localSettings,
                          gidComunicacoes: e.target.value,
                        })
                      }
                      className="w-full bg-[#070d18] border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-white focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <button
                    onClick={handleResetDefaults}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Restaurar IDs originais
                  </button>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${localSettings.sheetId}/edit`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Abrir folha no Google Sheets ↗
                  </a>
                </div>
              </div>

              {/* Informação do Ecrã e Resolução */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Ajuste Automático ao Ecrã:</span>
                  <span className="text-slate-400 text-[11px]">
                    O videowall recalcula continuamente a escala, altura e proporção com base no navegador ou monitor utilizado.
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold font-mono ml-3 flex-shrink-0"
                >
                  Ecrã Inteiro
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé da Janela */}
        <div className="px-5 py-3 bg-[#0e172a] border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Configurações salvas e sincronizadas!
              </span>
            ) : (
              <span>Atualização automática a cada 10 segundos</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
