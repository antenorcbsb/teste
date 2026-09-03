import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ViaturaInop } from '../types';
import { VehicleIcon, getVehicleTypology } from './VehicleIcon';

interface ViaturasInopCardProps {
  viaturas: ViaturaInop[];
  loading: boolean;
}

export const ViaturasInopCard: React.FC<ViaturasInopCardProps> = ({ viaturas, loading }) => {
  return (
    <div className="flex flex-col h-full bg-[#0a1124] border border-slate-800/90 rounded-lg p-2.5 sm:p-3 shadow-md overflow-hidden">
      {/* Título da Secção */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-red-400 uppercase tracking-wider font-mono">
              Veículos Inoperacionais (INOP)
            </h2>
            <p className="text-[10px] text-slate-400">Estado de prontidão da frota do BSB Braga</p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
            viaturas.length > 0
              ? 'bg-red-950/90 text-red-300 border-red-800/60 animate-pulse'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40'
          }`}
        >
          {viaturas.length > 0 ? `${viaturas.length} INOPERACIONAL` : '0 INOP'}
        </span>
      </div>

      {/* Lista de Viaturas INOP */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 custom-scrollbar">
        {loading && viaturas.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-500 italic">
            <ShieldAlert className="w-4 h-4 animate-spin mr-2 text-red-400" />
            A verificar estado operacional das viaturas...
          </div>
        ) : viaturas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-emerald-950/20 border border-emerald-500/20 rounded-md">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1.5 opacity-90" />
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300">
              Todas as Viaturas Operacionais
            </h4>
            <p className="text-[11px] text-emerald-400/80 mt-0.5 max-w-[280px]">
              Nenhum veículo em reparação ou inoperacional registado no Centro de Comunicações.
            </p>
          </div>
        ) : (
          viaturas.map(v => {
            const typoInfo = getVehicleTypology(v.veiculo);

            return (
              <div
                key={v.id}
                className="bg-[#0f172a] border-l-4 border-l-red-500 border border-slate-800/80 rounded-md p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-sm hover:border-red-900/50 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Caixa do Símbolo do Veículo Bombeiros Consoante a Tipologia */}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center p-1.5 flex-shrink-0 border"
                    style={{
                      backgroundColor: typoInfo.bgGlow,
                      borderColor: `${typoInfo.accentColor}55`,
                    }}
                    title={`${v.veiculo} - ${typoInfo.designacao} (${typoInfo.subtipo})`}
                  >
                    <VehicleIcon
                      tipologia={v.tipologia}
                      size="100%"
                      withGlow={true}
                    />
                  </div>

                  {/* Informações da Viatura */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white font-mono leading-tight">
                        {v.veiculo}
                      </h3>
                      {/* Badge da Tipologia do Veículo */}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${typoInfo.badgeClass}`}
                      >
                        {typoInfo.designacao}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {v.motivo || 'Avaria mecânica / manutenção preventiva'}
                    </p>

                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      Tipologia: {typoInfo.subtipo}
                    </p>
                  </div>
                </div>

                {/* Badge INOP */}
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className="px-2 py-1 bg-red-600 text-white font-extrabold text-[10px] sm:text-xs rounded font-mono shadow-md shadow-red-950 animate-pulse tracking-wider">
                    INOP
                  </span>
                  <span className="text-[9px] text-red-400 font-semibold uppercase">
                    Indisponível
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
