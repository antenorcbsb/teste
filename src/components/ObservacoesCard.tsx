import React from 'react';
import { Megaphone, AlertCircle, Info } from 'lucide-react';
import { Observacao } from '../types';

interface ObservacoesCardProps {
  observacoes: Observacao[];
  loading: boolean;
}

export const ObservacoesCard: React.FC<ObservacoesCardProps> = ({ observacoes, loading }) => {
  return (
    <div className="flex flex-col h-full bg-[#0a1124] border border-slate-800/90 rounded-lg p-2.5 sm:p-3 shadow-md overflow-hidden">
      {/* Título da Secção */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-purple-400 uppercase tracking-wider font-mono">
              Observações & Ordens de Serviço
            </h2>
            <p className="text-[10px] text-slate-400">Diretivas operacionais e critérios de alerta</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-950/80 text-purple-300 border border-purple-800/40">
          {observacoes.length} NOTAS
        </span>
      </div>

      {/* Lista de Observações */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 custom-scrollbar">
        {loading && observacoes.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-500 italic">
            <Info className="w-4 h-4 animate-spin mr-2 text-purple-400" />
            A carregar observações operacionais...
          </div>
        ) : observacoes.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-400 italic bg-slate-900/40 border border-dashed border-slate-800 rounded-md">
            Sem observações ou ordens registadas de momento.
          </div>
        ) : (
          observacoes.map(obs => {
            const isCritico =
              obs.titulo.toLowerCase().includes('alerta') ||
              obs.titulo.toLowerCase().includes('comando') ||
              obs.titulo.toLowerCase().includes('urgente');

            return (
              <div
                key={obs.id}
                className={`bg-[#0f172a] border-l-4 rounded-md p-2.5 sm:p-3 shadow-sm transition-all border ${
                  isCritico
                    ? 'border-l-amber-500 border-slate-800/90'
                    : 'border-l-purple-500 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertCircle
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isCritico ? 'text-amber-400' : 'text-purple-400'
                    }`}
                  />
                  <h3
                    className={`text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider ${
                      isCritico ? 'text-amber-300' : 'text-purple-300'
                    }`}
                  >
                    {obs.titulo}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                  {obs.texto}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
