import React from 'react';
import { CloudSun, Flame, Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { MeteoIPMA } from '../types';

interface TickerFooterProps {
  meteo: MeteoIPMA | null;
  loading: boolean;
}

export const TickerFooter: React.FC<TickerFooterProps> = ({ meteo, loading }) => {
  // Se não houver dados ainda, renderiza placeholder elegante
  if (!meteo) {
    return (
      <footer
        id="ticker-ipma-braga"
        className="h-9 sm:h-10 bg-[#0c1322] border-t-2 border-sky-500 text-white flex items-center px-3 text-xs font-mono select-none flex-shrink-0 z-20 shadow-lg"
      >
        <div className="flex items-center gap-1.5 text-sky-400 font-bold mr-3 pr-3 border-r border-slate-700">
          <CloudSun className="w-4 h-4" />
          <span>IPMA BRAGA</span>
        </div>
        <span className="text-slate-400 italic">A obter dados meteorológicos e risco de incêndio IPMA...</span>
      </footer>
    );
  }

  // Define a cor de alerta do FWI (Índice Meteorológico de Risco de Incêndio)
  let fwiColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
  let fwiNivel = 'Reduzido';
  if (meteo.fwiVal >= 38.3) {
    fwiColor = 'text-purple-300 bg-purple-950/80 border-purple-500/60';
    fwiNivel = 'Máximo';
  } else if (meteo.fwiVal >= 24.6) {
    fwiColor = 'text-red-300 bg-red-950/80 border-red-500/60';
    fwiNivel = 'Muito Elevado';
  } else if (meteo.fwiVal >= 13.5) {
    fwiColor = 'text-amber-300 bg-amber-950/80 border-amber-500/60';
    fwiNivel = 'Elevado';
  } else if (meteo.fwiVal >= 7.3) {
    fwiColor = 'text-yellow-300 bg-yellow-950/60 border-yellow-500/40';
    fwiNivel = 'Moderado';
  }

  const items = [
    {
      icon: <CloudSun className="w-3.5 h-3.5 text-sky-400" />,
      label: 'Previsão:',
      val: meteo.descTempo,
    },
    {
      icon: <Thermometer className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Temp. Máx / Mín:',
      val: `${meteo.tMax}°C / ${meteo.tMin}°C`,
    },
    {
      icon: <Droplets className="w-3.5 h-3.5 text-blue-400" />,
      label: 'Prob. Chuva:',
      val: `${meteo.probChuva}%`,
    },
    {
      icon: <Wind className="w-3.5 h-3.5 text-teal-400" />,
      label: 'Vento:',
      val: `${meteo.velVentoVal} km/h (${meteo.dirVento})`,
    },
    {
      icon: <Wind className="w-3.5 h-3.5 text-cyan-400" />,
      label: 'Rajada:',
      val: `${meteo.rajadaVentoVal} km/h`,
    },
    {
      icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />,
      label: 'FFMC (Combustível Fino):',
      val: String(meteo.ffmcVal),
    },
    {
      icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
      label: 'ISI (Propagação Inicial):',
      val: String(meteo.isiVal),
    },
    {
      icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
      label: 'Índice FWI (Risco):',
      val: `${meteo.fwiVal} (${fwiNivel})`,
      customStyle: fwiColor,
    },
  ];

  return (
    <footer
      id="ticker-ipma-braga"
      className="h-8 sm:h-9 bg-[#0c1322] border-t border-sky-500/80 text-white flex items-center overflow-hidden flex-shrink-0 z-20 shadow-2xl relative select-none"
    >
      {/* Label Fixo do IPMA à Esquerda */}
      <div className="h-full bg-gradient-to-r from-sky-700 to-blue-700 text-white px-3 sm:px-4 flex items-center gap-1.5 font-extrabold text-[11px] sm:text-xs tracking-wider z-10 flex-shrink-0 shadow-md">
        <CloudSun className="w-4 h-4 text-sky-200" />
        <span className="font-mono">IPMA BRAGA</span>
        <span className="hidden md:inline-block text-[10px] text-sky-200/80 font-normal">
          • CONCELHO 0303
        </span>
      </div>

      {/* Ticker com animação fluida contínua */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="ticker-track flex items-center whitespace-nowrap">
          {/* Loop duplo para rolagem infinita e sem cortes */}
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-1.5 mx-3 sm:mx-4 text-xs font-mono">
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-slate-400 text-[11px] font-sans">{item.label}</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  item.customStyle || 'text-white bg-slate-800/80 border border-slate-700'
                }`}
              >
                {item.val}
              </span>
              <span className="text-sky-500/40 ml-3">✦</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
