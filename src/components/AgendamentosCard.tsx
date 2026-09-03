import React from 'react';
import { CalendarDays, Clock, Truck, Filter, CheckCircle2, Users, User } from 'lucide-react';
import { Agendamento } from '../types';
import { VehicleIcon, getVehicleTypology } from './VehicleIcon';

interface AgendamentosCardProps {
  agendamentos: Agendamento[];
  loading: boolean;
  mostrarApenasHoje: boolean;
  setMostrarApenasHoje: (val: boolean) => void;
}

export const AgendamentosCard: React.FC<AgendamentosCardProps> = ({
  agendamentos,
  loading,
  mostrarApenasHoje,
  setMostrarApenasHoje,
}) => {
  const hojeStr = new Date().toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Filtra estritamente os agendamentos do respetivo dia quando ativo (padrão)
  const listaExibida = mostrarApenasHoje
    ? agendamentos.filter(a => a.eHoje)
    : agendamentos;

  return (
    <div
      id="card-agendamentos-centcom"
      className="flex flex-col h-full bg-[#0a1124] border border-slate-800/90 rounded-lg p-2.5 sm:p-3 shadow-md overflow-hidden"
    >
      {/* Título da Secção e Filtro */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-amber-400 uppercase tracking-wider font-mono">
              {mostrarApenasHoje ? 'Agendamentos do Dia' : 'Todos os Agendamentos'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {mostrarApenasHoje
                ? `Serviços programados para hoje (${hojeStr})`
                : 'Prevenções, eventos e tarefas agendadas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge da Data de Hoje */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
            HOJE • {hojeStr}
          </span>

          {/* Toggle para alternar visualização se necessário */}
          <button
            onClick={() => setMostrarApenasHoje(!mostrarApenasHoje)}
            title={
              mostrarApenasHoje
                ? 'A exibir apenas serviços de hoje. Clique para ver todos os agendamentos.'
                : 'A exibir todos os agendamentos. Clique para filtrar apenas o dia de hoje.'
            }
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all border ${
              mostrarApenasHoje
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Filter className="w-2.5 h-2.5" />
            <span>{mostrarApenasHoje ? 'Só Hoje' : 'Todos'}</span>
          </button>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
              listaExibida.length > 0
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            {listaExibida.length} {listaExibida.length === 1 ? 'SERVIÇO' : 'SERVIÇOS'}
          </span>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 custom-scrollbar">
        {loading && listaExibida.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4 text-xs text-slate-500 italic">
            <CalendarDays className="w-4 h-4 animate-spin mr-2 text-amber-400" />
            A verificar agendamentos programados para hoje...
          </div>
        ) : listaExibida.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-md">
            <CheckCircle2 className="w-7 h-7 text-amber-400/80 mb-2" />
            <p className="text-xs sm:text-sm font-bold text-slate-200">
              {mostrarApenasHoje
                ? `Sem agendamentos previstos para hoje (${hojeStr})`
                : 'Sem agendamentos registados na folha de serviço.'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[300px]">
              {mostrarApenasHoje
                ? 'Os agendamentos futuros serão exibidos automaticamente assim que chegar o respetivo dia.'
                : 'Nenhum registo encontrado na folha de cálculo.'}
            </p>
            {mostrarApenasHoje && agendamentos.length > 0 && (
              <button
                onClick={() => setMostrarApenasHoje(false)}
                className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
              >
                Ver agendamentos das próximas datas ({agendamentos.length})
              </button>
            )}
          </div>
        ) : (
          listaExibida.map(item => {
            // Se houver meios definidos, pegamos o veículo principal para o ícone de cabeçalho
            const primeiroMeio = item.meiosParsed.length > 0 ? item.meiosParsed[0] : null;
            const tipoDestaque = primeiroMeio
              ? primeiroMeio.tipologia
              : getVehicleTypology(item.descricao).tipologia;
            const infoDestaque = getVehicleTypology(
              primeiroMeio ? primeiroMeio.raw : item.descricao
            );

            return (
              <div
                key={item.id}
                className="bg-[#0f172a] border-l-4 border-l-amber-500 border border-slate-800/80 rounded-md p-2 sm:p-2.5 flex flex-col gap-2 shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-2.5">
                  {/* Ícone de Destaque da Viatura Alocada */}
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center p-1 flex-shrink-0 border"
                    style={{
                      backgroundColor: infoDestaque.bgGlow,
                      borderColor: `${infoDestaque.accentColor}50`,
                    }}
                    title={primeiroMeio ? primeiroMeio.descricaoCompleta : 'Serviço BSB'}
                  >
                    <VehicleIcon tipologia={tipoDestaque} size="100%" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Data e Hora */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {item.horaRaw ? `${item.horaRaw}` : item.dataRaw}
                      </span>

                      {item.eHoje && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-600 text-white font-mono uppercase tracking-wider animate-pulse">
                          Hoje
                        </span>
                      )}

                      {!mostrarApenasHoje && item.dataRaw && (
                        <span className="text-[10px] font-mono text-slate-400">
                          ({item.dataRaw})
                        </span>
                      )}
                    </div>

                    {/* Descrição do Evento */}
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug break-words">
                      {item.descricao}
                    </h3>
                  </div>
                </div>

                {/* Meios Alocados com Ícones Dedicados para Cada Veículo */}
                {item.meiosParsed.length > 0 && (
                  <div className="mt-1 pt-1.5 border-t border-slate-800/70">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 mb-1">
                      <Truck className="w-3 h-3" />
                      <span>Meios Alocados ({item.meiosParsed.length}):</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.meiosParsed.map((veiculo, vIdx) => {
                        const info = getVehicleTypology(veiculo.raw);

                        return (
                          <div
                            key={vIdx}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-bold border shadow-sm ${info.badgeClass}`}
                            title={`${veiculo.codigo} • ${info.designacao} (${info.subtipo})`}
                          >
                            {/* Miniatura do Ícone do Veículo Consoante a Tipologia */}
                            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                              <VehicleIcon tipologia={veiculo.tipologia} size={16} />
                            </div>
                            <span>{veiculo.codigo}</span>
                            {veiculo.subtipo && (
                              <span className="text-[9px] opacity-75 font-sans font-normal">
                                ({veiculo.subtipo})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Equipas / Elementos Operacionais Alocados */}
                {item.elementosEquipa && item.elementosEquipa.length > 0 && (
                  <div className="mt-1 pt-1.5 border-t border-slate-800/70">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mb-1">
                      <Users className="w-3 h-3 text-emerald-400" />
                      <span>Equipa Operacional ({item.elementosEquipa.length} {item.elementosEquipa.length === 1 ? 'elemento' : 'elementos'}):</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.elementosEquipa.map((elemento, eIdx) => {
                        const isNumero = /^\d+$/.test(elemento.trim());
                        return (
                          <div
                            key={eIdx}
                            id={`agendamento-elemento-${item.id}-${eIdx}`}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-bold border border-emerald-500/40 bg-emerald-950/60 text-emerald-200 shadow-sm"
                            title={`Operacional / Elemento: ${elemento}`}
                          >
                            <span className="w-4 h-4 rounded bg-emerald-900/80 border border-emerald-500/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
                              <User className="w-2.5 h-2.5 text-emerald-300" />
                            </span>
                            <span>{isNumero ? `Nº ${elemento}` : elemento}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
