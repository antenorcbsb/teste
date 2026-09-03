import React from 'react';
import { Radio, Calendar, Activity } from 'lucide-react';
import { TeatroOperacao } from '../types';

interface TeatroOperacoesCardProps {
  teatros: TeatroOperacao[];
  loading: boolean;
}

export const TeatroOperacoesCard: React.FC<TeatroOperacoesCardProps> = ({ teatros, loading }) => {
  return (
    <div className="flex flex-col h-full bg-[#0a1124] border border-slate-800/90 rounded-lg p-2.5 sm:p-3 shadow-md overflow-hidden">
      {/* Título da Secção */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-sky-400 uppercase tracking-wider font-mono">
              Teatro de Operações / Canais
            </h2>
            <p className="text-[10px] text-slate-400">Canais de rádio ativos BSB, ROB, REPC e SIRESP</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-950/80 text-sky-300 border border-sky-800/40">
          {teatros.length} ATIVOS
        </span>
      </div>

      {/* Conteúdo dos Teatros de Operações */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 custom-scrollbar">
        {loading && teatros.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-500 italic">
            <Activity className="w-4 h-4 animate-spin mr-2 text-sky-400" />
            A carregar canais e teatros de operações...
          </div>
        ) : teatros.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-400 italic bg-slate-900/40 border border-dashed border-slate-800 rounded-md">
            Sem canais ou teatros de operações ativos de momento.
          </div>
        ) : (
          teatros.map(to => (
            <div
              key={to.id}
              className="bg-[#0f172a] border-l-4 border-l-emerald-500 border border-slate-800/80 rounded-md p-2.5 sm:p-3 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
                  {to.evento}
                </h3>
                {to.dataInicio && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 flex-shrink-0 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {to.dataInicio} {to.dataFim && to.dataFim !== to.dataInicio ? `a ${to.dataFim}` : ''}
                  </span>
                )}
              </div>

              {/* Badges de canais de rádio */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {to.canais.map((canal, cIdx) => {
                  let badgeStyles = 'bg-sky-600 text-white border-sky-400/50';
                  if (canal.classe === 'badge-rob') badgeStyles = 'bg-emerald-600 text-white border-emerald-400/50';
                  if (canal.classe === 'badge-repc') badgeStyles = 'bg-amber-600 text-white border-amber-400/50';
                  if (canal.classe === 'badge-siresp') badgeStyles = 'bg-purple-600 text-white border-purple-400/50';
                  if (canal.classe === 'badge-dmo') badgeStyles = 'bg-rose-600 text-white border-rose-400/50';

                  return (
                    <span
                      key={cIdx}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono shadow-sm border ${badgeStyles}`}
                    >
                      <Radio className="w-2.5 h-2.5 opacity-80" />
                      <span className="opacity-75 font-semibold text-[9px] uppercase mr-0.5">
                        {canal.tipoNome}:
                      </span>
                      <span>{canal.texto}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
