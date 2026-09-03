import React from 'react';
import { VehicleTypology, VehicleParsed } from '../types';

export function getVehicleTypology(input: string): {
  tipologia: VehicleTypology;
  designacao: string;
  subtipo: string;
  badgeClass: string;
  accentColor: string;
  bgGlow: string;
} {
  const str = (input || '').toUpperCase().trim();

  // 1. ABSC / Ambulâncias
  if (str.startsWith('ABSC') || str.startsWith('ABTD') || str.includes('AMBULANCIA') || str.includes('AMBULÂNCIA')) {
    return {
      tipologia: 'ABSC',
      designacao: 'Ambulância de Socorro',
      subtipo: 'Emergência Médica Pré-Hospitalar',
      badgeClass: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300',
      accentColor: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    };
  }

  // 2. VLCI - Veículo Ligeiro de Combate a Incêndios (Requested specifically by user)
  if (str.startsWith('VLCI') || str.includes('VLCI')) {
    return {
      tipologia: 'VLCI',
      designacao: 'Veículo Ligeiro Combate',
      subtipo: 'Carro de Bombeiros Ligeiro (Ataque Rápido)',
      badgeClass: 'border-amber-500/60 bg-amber-950/40 text-amber-300',
      accentColor: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
    };
  }

  // 3. VCOT & VAOP & VCOC - Veículos Ligeiros de Comando e Apoio (Requested specifically by user)
  if (str.startsWith('VCOT') || str.includes('VCOT')) {
    return {
      tipologia: 'VCOT',
      designacao: 'Veículo Ligeiro Comando Tático',
      subtipo: 'Comando & Reconhecimento Operacional',
      badgeClass: 'border-blue-500/60 bg-blue-950/40 text-blue-300',
      accentColor: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
    };
  }

  if (str.startsWith('VAOP') || str.includes('VAOP')) {
    return {
      tipologia: 'VAOP',
      designacao: 'Veículo Ligeiro Apoio Operacional',
      subtipo: 'Logística & Apoio Operacional',
      badgeClass: 'border-sky-500/60 bg-sky-950/40 text-sky-300',
      accentColor: '#0ea5e9',
      bgGlow: 'rgba(14, 165, 233, 0.15)',
    };
  }

  if (str.startsWith('VCOC') || str.includes('VCOC')) {
    return {
      tipologia: 'VCOC',
      designacao: 'Veículo Ligeiro Comando & Comms',
      subtipo: 'Posto Comando Operacional & Rádio',
      badgeClass: 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300',
      accentColor: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
    };
  }

  // 4. VFCI / VUCI / VRCI / VECI - Carros de Bombeiros Pesados (Combate a Incêndios)
  if (str.startsWith('VFCI') || str.includes('VFCI')) {
    return {
      tipologia: 'VFCI',
      designacao: 'Veículo Florestal de Combate',
      subtipo: 'Pesado 4x4 Combate a Incêndios',
      badgeClass: 'border-red-500/60 bg-red-950/40 text-red-300',
      accentColor: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
    };
  }

  if (str.startsWith('VUCI') || str.includes('VUCI')) {
    return {
      tipologia: 'VUCI',
      designacao: 'Veículo Urbano de Combate',
      subtipo: 'Autobomba Urbana Pesada',
      badgeClass: 'border-rose-500/60 bg-rose-950/40 text-rose-300',
      accentColor: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
    };
  }

  if (str.startsWith('VRCI') || str.includes('VRCI')) {
    return {
      tipologia: 'VRCI',
      designacao: 'Veículo Rural de Combate',
      subtipo: 'Pesado Todo-o-Terreno',
      badgeClass: 'border-orange-500/60 bg-orange-950/40 text-orange-300',
      accentColor: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
    };
  }

  if (str.startsWith('VECI') || str.includes('VECI')) {
    return {
      tipologia: 'VECI',
      designacao: 'Veículo Especial de Combate',
      subtipo: 'Combate Químico / Especial',
      badgeClass: 'border-fuchsia-500/60 bg-fuchsia-950/40 text-fuchsia-300',
      accentColor: '#d946ef',
      bgGlow: 'rgba(217, 70, 239, 0.15)',
    };
  }

  // 5. VTTU & VTTP - Veículos Tanque Táticos (Autotanques)
  if (str.startsWith('VTTU') || str.includes('VTTU')) {
    return {
      tipologia: 'VTTU',
      designacao: 'Tanque Tático Urbano',
      subtipo: 'Autotanque Pesado de Água',
      badgeClass: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300',
      accentColor: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
    };
  }

  if (str.startsWith('VTTP') || str.includes('VTTP')) {
    return {
      tipologia: 'VTTP',
      designacao: 'Tanque Tático Pesado',
      subtipo: 'Grande Cisterna de Abastecimento',
      badgeClass: 'border-teal-500/60 bg-teal-950/40 text-teal-300',
      accentColor: '#14b8a6',
      bgGlow: 'rgba(20, 184, 166, 0.15)',
    };
  }

  // 6. VE30 & VP30 - Auto-Escada e Plataforma
  if (str.startsWith('VE30') || str.startsWith('VE') || str.includes('ESCAD') || str.includes('VE30')) {
    return {
      tipologia: 'VE30',
      designacao: 'Veículo Auto-Escada 30m',
      subtipo: 'Salvamento e Combate em Altura',
      badgeClass: 'border-yellow-500/60 bg-yellow-950/40 text-yellow-300',
      accentColor: '#eab308',
      bgGlow: 'rgba(234, 179, 8, 0.15)',
    };
  }

  if (str.startsWith('VP30') || str.includes('PLATAFORMA') || str.includes('VP30')) {
    return {
      tipologia: 'VP30',
      designacao: 'Veículo Plataforma 30m',
      subtipo: 'Braço Articulado Telescópico',
      badgeClass: 'border-yellow-500/60 bg-yellow-950/40 text-yellow-300',
      accentColor: '#eab308',
      bgGlow: 'rgba(234, 179, 8, 0.15)',
    };
  }

  // 7. VOPE - Operações Específicas
  if (str.startsWith('VOPE') || str.includes('VOPE')) {
    return {
      tipologia: 'VOPE',
      designacao: 'Veículo Operações Específicas',
      subtipo: 'Socorro Técnico & Desencarceramento',
      badgeClass: 'border-purple-500/60 bg-purple-950/40 text-purple-300',
      accentColor: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
    };
  }

  // 8. VPMA - Posto Médico Avançado
  if (str.startsWith('VPMA') || str.includes('VPMA')) {
    return {
      tipologia: 'VPMA',
      designacao: 'Posto Médico Avançado',
      subtipo: 'Triagem e Cuidados Médicos PMA',
      badgeClass: 'border-emerald-600/60 bg-emerald-950/40 text-emerald-200',
      accentColor: '#059669',
      bgGlow: 'rgba(5, 150, 105, 0.15)',
    };
  }

  // 9. BRTP & Botes - Embarcação de Socorro Aquático
  if (str.startsWith('BRTP') || str.includes('BOTE') || str.includes('BARCO') || str.includes('MERGULHO')) {
    return {
      tipologia: 'BRTP',
      designacao: 'Bote Resgate e Mergulho',
      subtipo: 'Embarcação Socorro em Meio Aquático',
      badgeClass: 'border-blue-400/60 bg-blue-950/40 text-blue-200',
      accentColor: '#60a5fa',
      bgGlow: 'rgba(96, 165, 250, 0.15)',
    };
  }

  // 10. EAPH - Equipas de Apoio Pré-Hospitalar
  if (str.startsWith('EAPH') || str.includes('EAPH')) {
    return {
      tipologia: 'EAPH',
      designacao: 'Equipa Apoio Pré-Hospitalar',
      subtipo: 'Socorristas BSB em Apoio',
      badgeClass: 'border-green-500/60 bg-green-950/40 text-green-300',
      accentColor: '#22c55e',
      bgGlow: 'rgba(34, 197, 94, 0.15)',
    };
  }

  return {
    tipologia: 'GENERICO',
    designacao: 'Viatura de Bombeiros',
    subtipo: 'Viatura Operacional BSB',
    badgeClass: 'border-slate-500/60 bg-slate-900/60 text-slate-300',
    accentColor: '#94a3b8',
    bgGlow: 'rgba(148, 163, 184, 0.15)',
  };
}

export function parseVehicleString(rawStr: string): VehicleParsed {
  const raw = rawStr.trim();
  const typoInfo = getVehicleTypology(raw);

  // Extrai o código principal (ex: "VLCI 01", "VCOT 01", "ABSC 03")
  const match = raw.match(/^([A-Z0-9]+(?:\s+[A-Z0-9]+)?)/i);
  const codigo = match ? match[1].toUpperCase().trim() : raw;
  const subtipo = raw.includes('(') ? raw.replace(/^[^(]+\(([^)]+)\).*/, '$1') : undefined;

  return {
    raw,
    codigo,
    subtipo,
    tipologia: typoInfo.tipologia,
    designacao: typoInfo.designacao,
    descricaoCompleta: `${codigo} - ${typoInfo.designacao}`,
  };
}

export function parseMultipleVehicles(meiosStr: string): VehicleParsed[] {
  if (!meiosStr || !meiosStr.trim()) return [];

  // Divide por ponto e vírgula, barra ou vírgula
  const tokens = meiosStr
    .split(/[;]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const results: VehicleParsed[] = [];

  tokens.forEach(token => {
    // Caso haja sub-veículos separados por vírgula dentro do token
    if (token.includes(',') && !token.includes('(')) {
      const subTokens = token.split(',').map(st => st.trim()).filter(Boolean);
      subTokens.forEach(st => results.push(parseVehicleString(st)));
    } else {
      results.push(parseVehicleString(token));
    }
  });

  return results;
}

interface VehicleIconProps {
  tipologia: VehicleTypology | string;
  size?: number | string;
  className?: string;
  withGlow?: boolean;
}

export const VehicleIcon: React.FC<VehicleIconProps> = ({
  tipologia,
  size = 40,
  className = '',
  withGlow = false,
}) => {
  const typoKey = typeof tipologia === 'string' ? getVehicleTypology(tipologia).tipologia : tipologia;

  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : { width: size, height: size };

  // Renderiza o SVG específico e detalhado de cada categoria de viatura
  switch (typoKey) {
    case 'VLCI':
      // Veículo Ligeiro de Combate a Incêndios (Pick-up 4x4 vermelha de bombeiros com carretel de ataque rápido e girofarol)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sombra */}
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Chassis e caixa de carga traseira com bomba */}
          <path d="M48 24H72C73.1 24 74 24.9 74 26V37H48V24Z" fill="#b91c1c" />
          {/* Cabine da Pick-up 4x4 */}
          <path d="M12 28L24 16H48V37H10C8.9 37 8 36.1 8 35V30L12 28Z" fill="#dc2626" />
          {/* Janelas */}
          <path d="M25 18L16 27H33V18H25Z" fill="#38bdf8" fillOpacity="0.85" />
          <path d="M36 18H46V27H36V18Z" fill="#38bdf8" fillOpacity="0.85" />
          {/* Faixa amarela/branca refletora de bombeiros portugueses */}
          <path d="M8 30H74V33H8V30Z" fill="#fde047" />
          <path d="M10 30L15 33M20 30L25 33M30 30L35 33M40 30L45 33M50 30L55 33M60 30L65 33M70 30L74 32.5" stroke="#ef4444" strokeWidth="1" />
          {/* Carretel de mangueira no módulo traseiro */}
          <circle cx="60" cy="21" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
          <circle cx="60" cy="21" r="2" fill="#451a03" />
          <path d="M55 21H65" stroke="#d97706" strokeWidth="1" />
          {/* Faróis e piscas */}
          <circle cx="9" cy="31" r="2" fill="#fef08a" />
          <rect x="73" y="27" width="2" height="4" rx="1" fill="#ef4444" />
          {/* Girofarol azul no tejadilho com emissão de luz */}
          <rect x="32" y="13" width="7" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="35.5" cy="14" r="1.5" fill="#bae6fd" />
          {/* Rodas todo-o-terreno robustas 4x4 */}
          <circle cx="20" cy="38" r="8" fill="#1e293b" />
          <circle cx="20" cy="38" r="5" fill="#64748b" />
          <circle cx="20" cy="38" r="2" fill="#0f172a" />
          <circle cx="62" cy="38" r="8" fill="#1e293b" />
          <circle cx="62" cy="38" r="5" fill="#64748b" />
          <circle cx="62" cy="38" r="2" fill="#0f172a" />
          {/* Letreiro VLCI */}
          <text x="38" y="29.5" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">VLCI</text>
        </svg>
      );

    case 'ABSC':
      // Ambulância de Socorro (Ambulância branca/vermelha com estrela da vida / cruz de emergência e luzes azuis)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sombra */}
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Carroçaria furgão alta da ambulância */}
          <path d="M12 28L20 15H72C73.1 15 74 15.9 74 17V37H10C8.9 37 8 36.1 8 35V30L12 28Z" fill="#f8fafc" />
          {/* Cabine e janelas da frente */}
          <path d="M21 17L15 26H28V17H21Z" fill="#38bdf8" fillOpacity="0.85" />
          <rect x="31" y="18" width="10" height="7" rx="1" fill="#38bdf8" fillOpacity="0.85" />
          <rect x="58" y="18" width="12" height="7" rx="1" fill="#38bdf8" fillOpacity="0.85" />
          {/* Faixas refletoras battenburg (Amarelo e Verde / Vermelho de socorro) */}
          <rect x="8" y="29" width="66" height="5" fill="#facc15" />
          <path d="M12 29L16 34H20L16 29H12ZM24 29L28 34H32L28 29H24ZM36 29L40 34H44L40 29H36ZM48 29L52 34H56L52 29H48ZM60 29L64 34H68L64 29H60Z" fill="#15803d" />
          {/* Cruz Vermelha / Estrela de Socorro na lateral */}
          <rect x="47" y="18" width="3" height="9" fill="#dc2626" rx="0.5" />
          <rect x="44" y="21" width="9" height="3" fill="#dc2626" rx="0.5" />
          {/* Faróis */}
          <circle cx="9" cy="30" r="2" fill="#fef08a" />
          <rect x="73" y="26" width="2" height="6" rx="1" fill="#ef4444" />
          {/* Barra de Girofaróis azuis no topo com flash */}
          <rect x="24" y="12" width="10" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="26" cy="13.5" r="1.5" fill="#38bdf8" />
          <circle cx="32" cy="13.5" r="1.5" fill="#38bdf8" />
          <rect x="64" y="12" width="6" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="67" cy="13.5" r="1.5" fill="#38bdf8" />
          {/* Rodas */}
          <circle cx="20" cy="38" r="7.5" fill="#1e293b" />
          <circle cx="20" cy="38" r="4.5" fill="#94a3b8" />
          <circle cx="20" cy="38" r="2" fill="#0f172a" />
          <circle cx="62" cy="38" r="7.5" fill="#1e293b" />
          <circle cx="62" cy="38" r="4.5" fill="#94a3b8" />
          <circle cx="62" cy="38" r="2" fill="#0f172a" />
          {/* Texto ABSC */}
          <text x="32" y="28" fontSize="4.5" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">ABSC</text>
        </svg>
      );

    case 'VCOT':
    case 'VAOP':
    case 'VCOC':
      // Veículo Ligeiro de Comando / Apoio Operacional (SUV / Jipe de Comando Operacional com barra de luzes e antenas rádio)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sombra */}
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Carroçaria SUV / 4x4 de comando */}
          <path d="M12 28L22 17H68C69.1 17 70 17.9 70 19V36H10C8.9 36 8 35.1 8 34V30L12 28Z" fill="#dc2626" />
          {/* Janelas */}
          <path d="M23 19L16 27H33V19H23Z" fill="#38bdf8" fillOpacity="0.85" />
          <path d="M36 19H50V27H36V19Z" fill="#38bdf8" fillOpacity="0.85" />
          <path d="M53 19H66V27H53V19Z" fill="#38bdf8" fillOpacity="0.85" />
          {/* Faixa branca / amarela de comando */}
          <path d="M8 30H70V33H8V30Z" fill="#ffffff" />
          <path d="M12 30H70V31.5H12V30Z" fill="#facc15" />
          {/* Antena de comunicações SIRESP/VHF traseira */}
          <line x1="66" y1="17" x2="68" y2="8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="68" cy="8" r="1.5" fill="#38bdf8" />
          {/* Barra de LED Comando no tejadilho */}
          <rect x="34" y="14" width="16" height="3" rx="1.5" fill="#1e293b" />
          <circle cx="37" cy="15.5" r="1.2" fill="#0284c7" />
          <circle cx="42" cy="15.5" r="1.2" fill="#f59e0b" />
          <circle cx="47" cy="15.5" r="1.2" fill="#0284c7" />
          {/* Faróis */}
          <circle cx="9" cy="30" r="2" fill="#fef08a" />
          <rect x="69" y="27" width="2" height="4" rx="1" fill="#ef4444" />
          {/* Rodas SUV */}
          <circle cx="21" cy="37" r="7.5" fill="#1e293b" />
          <circle cx="21" cy="37" r="4.5" fill="#94a3b8" />
          <circle cx="21" cy="37" r="2" fill="#0f172a" />
          <circle cx="59" cy="37" r="7.5" fill="#1e293b" />
          <circle cx="59" cy="37" r="4.5" fill="#94a3b8" />
          <circle cx="59" cy="37" r="2" fill="#0f172a" />
          {/* Sigla */}
          <text x="36" y="29.5" fontSize="4.5" fontWeight="bold" fill="#b91c1c" fontFamily="sans-serif">
            {typoKey}
          </text>
        </svg>
      );

    case 'VFCI':
    case 'VUCI':
    case 'VRCI':
    case 'VECI':
      // Carro de Bombeiros Pesado (Autobomba Florestal / Urbana com canhão monitor, armários e cabine dupla)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sombra */}
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Superestrutura pesada do camião */}
          <path d="M30 16H74C75.1 16 76 16.9 76 18V38H30V16Z" fill="#b91c1c" />
          {/* Cabine pesada frontal */}
          <path d="M6 38V22C6 20.9 6.9 20 8 20H14L22 16H30V38H6Z" fill="#dc2626" />
          {/* Janelas */}
          <path d="M14 21L21 17H28V26H10L14 21Z" fill="#38bdf8" fillOpacity="0.85" />
          {/* Canhão Monitor de água no tejadilho */}
          <rect x="42" y="13" width="8" height="3" rx="1" fill="#475569" />
          <line x1="46" y1="13" x2="40" y2="10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="39" cy="9.5" r="1.5" fill="#38bdf8" />
          {/* Cortinas de material / armários de mangueiras */}
          <rect x="33" y="19" width="11" height="15" fill="#cbd5e1" rx="1" />
          <rect x="47" y="19" width="11" height="15" fill="#cbd5e1" rx="1" />
          <rect x="61" y="19" width="11" height="15" fill="#cbd5e1" rx="1" />
          {/* Linhas das persianas */}
          <line x1="33" y1="23" x2="44" y2="23" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="33" y1="27" x2="44" y2="27" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="33" y1="31" x2="44" y2="31" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="47" y1="23" x2="58" y2="23" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="47" y1="27" x2="58" y2="27" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="47" y1="31" x2="58" y2="31" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="61" y1="23" x2="72" y2="23" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="61" y1="27" x2="72" y2="27" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="61" y1="31" x2="72" y2="31" stroke="#94a3b8" strokeWidth="0.8" />
          {/* Faixa amarela refletora */}
          <rect x="6" y="28" width="70" height="3" fill="#facc15" />
          {/* Girofarol azul */}
          <rect x="22" y="13" width="6" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="25" cy="14.5" r="1.5" fill="#38bdf8" />
          {/* Rodas pesadas com cubo duplo */}
          <circle cx="18" cy="38" r="8" fill="#0f172a" />
          <circle cx="18" cy="38" r="4.5" fill="#64748b" />
          <circle cx="54" cy="38" r="8" fill="#0f172a" />
          <circle cx="54" cy="38" r="4.5" fill="#64748b" />
          <circle cx="68" cy="38" r="8" fill="#0f172a" />
          <circle cx="68" cy="38" r="4.5" fill="#64748b" />
          {/* Faróis */}
          <circle cx="7" cy="30" r="2" fill="#fef08a" />
          <text x="33" y="14" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
            {typoKey}
          </text>
        </svg>
      );

    case 'VTTU':
    case 'VTTP':
      // Veículo Tanque Tático (Autotanque com grande cisterna cilíndrica)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Cisterna arredondada */}
          <rect x="32" y="16" width="42" height="19" rx="8" fill="#dc2626" />
          {/* Boca de enchimento e corrimão */}
          <rect x="48" y="13" width="10" height="3" rx="1" fill="#cbd5e1" />
          <line x1="36" y1="14" x2="70" y2="14" stroke="#94a3b8" strokeWidth="1" />
          {/* Cabine frontal */}
          <path d="M8 35V22C8 20.9 8.9 20 10 20H16L24 16H32V35H8Z" fill="#b91c1c" />
          <path d="M16 21L23 17H30V26H12L16 21Z" fill="#38bdf8" fillOpacity="0.85" />
          {/* Faixa refletora com símbolo de água */}
          <rect x="8" y="27" width="66" height="3.5" fill="#38bdf8" />
          {/* Girofarol */}
          <rect x="23" y="13" width="6" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="26" cy="14.5" r="1.5" fill="#bae6fd" />
          {/* Rodas triplas pesadas */}
          <circle cx="18" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="18" cy="38" r="4.5" fill="#64748b" />
          <circle cx="48" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="48" cy="38" r="4.5" fill="#64748b" />
          <circle cx="64" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="64" cy="38" r="4.5" fill="#64748b" />
          <text x="44" y="26" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">ÁGUA</text>
        </svg>
      );

    case 'VE30':
    case 'VP30':
      // Veículo Auto-Escada de 30 metros (Camião com escada telescópica articulada e cesto)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          {/* Plataforma base do camião */}
          <rect x="30" y="24" width="44" height="12" fill="#b91c1c" rx="1" />
          <path d="M8 36V23C8 21.9 8.9 21 10 21H18L26 17H30V36H8Z" fill="#dc2626" />
          <path d="M18 22L24 18H28V26H14L18 22Z" fill="#38bdf8" fillOpacity="0.85" />
          {/* Torre giratória da escada */}
          <rect x="60" y="20" width="10" height="5" fill="#475569" rx="1" />
          {/* Lança / Escada telescópica inclinada de 30m */}
          <line x1="65" y1="21" x2="22" y2="9" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <line x1="64" y1="22" x2="23" y2="10" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          {/* Cesto de salvamento no topo da escada */}
          <rect x="18" y="7" width="6" height="5" fill="#facc15" stroke="#713f12" strokeWidth="0.8" rx="0.5" />
          {/* Estabilizadores laterais */}
          <rect x="33" y="31" width="5" height="5" fill="#eab308" />
          <rect x="67" y="31" width="5" height="5" fill="#eab308" />
          {/* Girofarol */}
          <rect x="24" y="14" width="5" height="3" rx="1.5" fill="#0284c7" />
          {/* Rodas */}
          <circle cx="18" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="18" cy="38" r="4.5" fill="#64748b" />
          <circle cx="52" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="52" cy="38" r="4.5" fill="#64748b" />
          <circle cx="66" cy="38" r="7.5" fill="#0f172a" />
          <circle cx="66" cy="38" r="4.5" fill="#64748b" />
          <text x="36" y="29" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">30M</text>
        </svg>
      );

    case 'BRTP':
      // Bote de Resgate / Embarcação de Socorro e Mergulho
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Água */}
          <path d="M8 40C16 38 24 42 32 40C40 38 48 42 56 40C64 38 72 42 76 40" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          {/* Casco do bote insuflável semi-rígido */}
          <path d="M12 28C14 24 20 23 28 23H66C70 23 72 26 70 32C68 36 62 37 54 37H24C16 37 10 33 12 28Z" fill="#dc2626" />
          {/* Tubo flutuador cinzento/preto */}
          <path d="M14 29C20 27 60 27 68 30C66 34 22 35 14 29Z" fill="#1e293b" />
          {/* Consola de comando e volante */}
          <rect x="42" y="19" width="6" height="8" rx="1" fill="#cbd5e1" />
          <circle cx="44" cy="21" r="1.5" fill="#0284c7" />
          {/* Motor fora de borda na popa */}
          <rect x="66" y="24" width="6" height="12" rx="1" fill="#0f172a" />
          <rect x="64" y="34" width="4" height="4" fill="#64748b" />
          {/* Luz de navegação / mastro */}
          <line x1="56" y1="23" x2="56" y2="14" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="56" cy="13" r="1.5" fill="#38bdf8" />
          <text x="24" y="32" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">BRTP</text>
        </svg>
      );

    case 'VOPE':
      // Veículo de Operações Específicas (Furgão / Carrinha técnica de salvamento)
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          <path d="M10 29L18 17H70C71.1 17 72 17.9 72 19V36H10C8.9 36 8 35.1 8 34V31L10 29Z" fill="#9333ea" />
          <path d="M19 19L14 27H26V19H19Z" fill="#38bdf8" fillOpacity="0.85" />
          <rect x="30" y="20" width="18" height="12" fill="#7e22ce" rx="1" />
          <rect x="52" y="20" width="16" height="12" fill="#7e22ce" rx="1" />
          <rect x="8" y="29" width="64" height="3" fill="#facc15" />
          <rect x="25" y="14" width="8" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="29" cy="15.5" r="1.5" fill="#38bdf8" />
          <circle cx="20" cy="37" r="7.5" fill="#0f172a" />
          <circle cx="20" cy="37" r="4" fill="#94a3b8" />
          <circle cx="60" cy="37" r="7.5" fill="#0f172a" />
          <circle cx="60" cy="37" r="4" fill="#94a3b8" />
          <text x="32" y="27" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">VOPE</text>
        </svg>
      );

    case 'EAPH':
    case 'VPMA':
    default:
      // Padrão genérico de Bombeiros BSB
      return (
        <svg
          viewBox="0 0 80 50"
          className={`${className} ${withGlow ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}`}
          style={sizeStyle}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="40" cy="46" rx="34" ry="3" fill="#000000" fillOpacity="0.4" />
          <path d="M12 28L22 17H70C71.1 17 72 17.9 72 19V36H10C8.9 36 8 35.1 8 34V30L12 28Z" fill="#dc2626" />
          <path d="M23 19L16 27H33V19H23Z" fill="#38bdf8" fillOpacity="0.85" />
          <path d="M36 19H66V27H36V19Z" fill="#38bdf8" fillOpacity="0.85" />
          <rect x="8" y="29" width="64" height="3" fill="#facc15" />
          <rect x="30" y="14" width="8" height="3" rx="1.5" fill="#0284c7" />
          <circle cx="34" cy="15.5" r="1.5" fill="#38bdf8" />
          <circle cx="21" cy="37" r="7.5" fill="#1e293b" />
          <circle cx="21" cy="37" r="4" fill="#94a3b8" />
          <circle cx="59" cy="37" r="7.5" fill="#1e293b" />
          <circle cx="59" cy="37" r="4" fill="#94a3b8" />
          <text x="36" y="28" fontSize="4.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">BSB</text>
        </svg>
      );
  }
};
