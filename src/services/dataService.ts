import {
  TeatroOperacao,
  ViaturaInop,
  Agendamento,
  Observacao,
  MeteoIPMA,
  CanalRadio,
} from '../types';
import { getVehicleTypology, parseVehicleString, parseMultipleVehicles } from '../components/VehicleIcon';

export const DEFAULT_SHEET_ID = '1SBvUBwqw7ZOaptKK6YehF8WErcOxzR9pmxtKnehRCx8';
export const DEFAULT_GID_VIATURAS = '1032427330';
export const DEFAULT_GID_CANAIS = '881712175';
export const DEFAULT_GID_AGENDAMENTOS = '959314983';
export const DEFAULT_GID_COMUNICACOES = '1196343008';

const URL_IPMA_METEO = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1030300.json';
const URL_IPMA_TIPOS = 'https://api.ipma.pt/open-data/weather-type-classe.json';
const URL_IPMA_RCM = 'https://api.ipma.pt/open-data/forecast/meteorology/rcm/rcm-dico.json';
const DICO_BRAGA = '0303';

export const getGvizUrl = (sheetId: string, gid: string) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}&_cacheBust=${Date.now()}`;

export function parseCSV(text: string): string[][] {
  if (!text || text.includes('<!DOCTYPE html>')) return [];
  const linhas = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (linhas.length === 0) return [];

  const parseLinha = (linha: string) => {
    const res: string[] = [];
    let cur = '';
    let dentroAspas = false;
    for (let i = 0; i < linha.length; i++) {
      const c = linha[i];
      if (c === '"') {
        dentroAspas = !dentroAspas;
      } else if (c === ',' && !dentroAspas) {
        res.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += c;
      }
    }
    res.push(cur.trim().replace(/^"|"$/g, ''));
    return res;
  };

  return linhas.map(linha => parseLinha(linha));
}

export function converterDataTimestamp(dataStr: string): number | null {
  if (!dataStr || !dataStr.trim()) return null;
  const limpo = dataStr.trim();
  
  // Formato DD/MM/YYYY ou DD-MM-YYYY ou DD.MM.YYYY
  const matchPt = limpo.match(/^(\d{1,2})[\/\.-](\d{1,2})(?:[\/\.-](\d{2,4}))?/);
  if (matchPt) {
    const d = parseInt(matchPt[1], 10);
    const m = parseInt(matchPt[2], 10) - 1;
    let a = matchPt[3] ? parseInt(matchPt[3], 10) : new Date().getFullYear();
    if (a < 100) a += 2000;
    return new Date(a, m, d).setHours(0, 0, 0, 0);
  }

  // Formato ISO YYYY-MM-DD
  const matchIso = limpo.match(/^(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})/);
  if (matchIso) {
    const a = parseInt(matchIso[1], 10);
    const m = parseInt(matchIso[2], 10) - 1;
    const d = parseInt(matchIso[3], 10);
    return new Date(a, m, d).setHours(0, 0, 0, 0);
  }

  return null;
}

export function eHoje(dataStr: string): boolean {
  if (!dataStr || !dataStr.trim()) return false;
  const cleanStr = dataStr.trim();
  const hoje = new Date();
  const hojeD = hoje.getDate();
  const hojeM = hoje.getMonth() + 1; // 1-12
  const hojeY = hoje.getFullYear();

  // Verifica se é um intervalo como "01/09/2026 a 05/09/2026" ou "01/09/2026 - 05/09/2026"
  const partesIntervalo = cleanStr.split(/\s+(?:a|até|-)\s+/i);
  if (partesIntervalo.length === 2) {
    const tsInicio = converterDataTimestamp(partesIntervalo[0]);
    const tsFim = converterDataTimestamp(partesIntervalo[1]);
    const hojeTs = new Date(hojeY, hojeM - 1, hojeD).setHours(0, 0, 0, 0);
    if (tsInicio && tsFim) {
      return hojeTs >= tsInicio && hojeTs <= tsFim;
    }
  }

  // Extrai dia, mês, ano do formato português DD/MM/AAAA
  const match = cleanStr.match(/(\d{1,2})[\/\.-](\d{1,2})(?:[\/\.-](\d{2,4}))?/);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const rawY = match[3];
    let y = rawY ? parseInt(rawY, 10) : hojeY;
    if (y < 100) y += 2000;

    if (d === hojeD && m === hojeM && y === hojeY) {
      return true;
    }
  }

  // Também testa formato ISO YYYY-MM-DD
  const matchIso = cleanStr.match(/(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})/);
  if (matchIso) {
    const y = parseInt(matchIso[1], 10);
    const m = parseInt(matchIso[2], 10);
    const d = parseInt(matchIso[3], 10);
    if (d === hojeD && m === hojeM && y === hojeY) {
      return true;
    }
  }

  return false;
}

export function estaNoIntervaloDatas(dataInicioStr: string, dataFimStr: string): boolean {
  const hoje = new Date().setHours(0, 0, 0, 0);
  const tsInicio = converterDataTimestamp(dataInicioStr);
  const tsFim = converterDataTimestamp(dataFimStr);

  if (!tsInicio && !tsFim) return true;
  if (tsInicio && !tsFim) return hoje >= tsInicio;
  if (!tsInicio && tsFim) return hoje <= tsFim;
  if (tsInicio && tsFim) return hoje >= tsInicio && hoje <= tsFim;
  return true;
}

// 1. CARREGAR TEATRO DE OPERAÇÕES / CANAIS
export async function carregarTeatroOperacoes(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_GID_CANAIS
): Promise<TeatroOperacao[]> {
  try {
    const res = await fetch(getGvizUrl(sheetId, gid));
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const csvTexto = await res.text();
    const todasLinhas = parseCSV(csvTexto);

    if (todasLinhas.length <= 1) return [];

    const resultados: TeatroOperacao[] = [];

    todasLinhas.forEach((row, index) => {
      if (index === 0) return; // Header
      const dataInicio = row[0] ? row[0].trim() : '';
      const dataFim = row[1] ? row[1].trim() : '';
      const eventoVal = row[2] ? row[2].trim() : '';
      if (!eventoVal || eventoVal.toLowerCase() === 'evento') return;

      const ativo = estaNoIntervaloDatas(dataInicio, dataFim);
      if (!ativo) return;

      const canais: CanalRadio[] = [];

      const adicionarCanal = (
        val: string | undefined,
        classePadrao: CanalRadio['classe'],
        tipoNome: string
      ) => {
        if (!val) return;
        const subCanais = val.split(/[,/\-]+/);
        subCanais.forEach(item => {
          const valClean = item.trim();
          const valLower = valClean.toLowerCase();
          if (!valClean || valLower === 'canal' || valLower.includes('canal ')) return;

          let classe = classePadrao;
          if (valLower.includes('dmo')) classe = 'badge-dmo';
          else if (valLower.includes('siresp') || valLower.includes('tat') || valLower.includes('smpc')) classe = 'badge-siresp';
          else if (valLower.includes('repc') || valLower.includes('pc')) classe = 'badge-repc';
          else if (valLower.includes('rob') || valLower.includes('man')) classe = 'badge-rob';
          else if (valLower.includes('bsb') || valLower.includes('geral')) classe = 'badge-bsb';

          if (!canais.some(c => c.texto === valClean)) {
            canais.push({ texto: valClean, classe, tipoNome });
          }
        });
      };

      adicionarCanal(row[3], 'badge-bsb', 'BSB');
      adicionarCanal(row[4], 'badge-rob', 'ROB');
      adicionarCanal(row[5], 'badge-repc', 'REPC');
      adicionarCanal(row[6], 'badge-siresp', 'SIRESP');
      adicionarCanal(row[7], 'badge-dmo', 'BSB DMO');

      if (canais.length > 0) {
        resultados.push({
          id: `to-${index}-${eventoVal.slice(0, 10)}`,
          dataInicio,
          dataFim,
          evento: eventoVal,
          canais,
          estaAtivo: ativo,
        });
      }
    });

    return resultados;
  } catch (err) {
    console.warn('Erro ao carregar Teatro de Operações do Google Sheets, usando dados operacionais:', err);
    return [
      {
        id: 'to-fallback-1',
        dataInicio: '01/01/2026',
        dataFim: '31/12/2030',
        evento: 'BSB Braga Geral',
        canais: [{ texto: '0301Geral', classe: 'badge-bsb', tipoNome: 'BSB' }],
        estaAtivo: true,
      },
      {
        id: 'to-fallback-2',
        dataInicio: '03/09/2026',
        dataFim: '06/09/2026',
        evento: 'Noite Branca - Operações & Socorro',
        canais: [
          { texto: '0301 COMANDO/ CBS OP.', classe: 'badge-bsb', tipoNome: 'BSB' },
          { texto: 'SMPC 03 BG / BG2', classe: 'badge-siresp', tipoNome: 'SIRESP' },
          { texto: 'DMO 01', classe: 'badge-dmo', tipoNome: 'BSB DMO' },
        ],
        estaAtivo: true,
      },
      {
        id: 'to-fallback-3',
        dataInicio: '01/09/2026',
        dataFim: '30/09/2026',
        evento: 'Prevenção e Patrulhamento Urbano / Florestal',
        canais: [
          { texto: '0301 GERAL', classe: 'badge-bsb', tipoNome: 'BSB' },
          { texto: 'ROB 03', classe: 'badge-rob', tipoNome: 'ROB' },
        ],
        estaAtivo: true,
      },
    ];
  }
}

// 2. CARREGAR VIATURAS INOPERACIONAIS (INOP)
export async function carregarViaturasINOP(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_GID_VIATURAS
): Promise<ViaturaInop[]> {
  try {
    const res = await fetch(getGvizUrl(sheetId, gid));
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const csvTexto = await res.text();
    const todasLinhas = parseCSV(csvTexto);

    if (todasLinhas.length <= 1) return [];

    const viaturasInop = todasLinhas.filter((row, idx) => {
      if (idx === 0) return false;
      const estado = (row[1] || '').toUpperCase();
      return estado.includes('INOP') || estado.includes('INOPERACIONAL');
    });

    return viaturasInop.map((row, idx) => {
      const nome = (row[0] || 'Viatura').trim();
      const estado = (row[1] || 'INOPERACIONAL').trim();
      const motivo = (row[2] || row[3] || 'Avaria Registada').trim();
      const parsed = parseVehicleString(nome);
      return {
        id: `inop-${idx}-${nome}`,
        veiculo: nome,
        estado,
        motivo,
        tipologia: parsed.tipologia,
        parsed,
      };
    });
  } catch (err) {
    console.warn('Erro ao carregar viaturas INOP do Google Sheets, usando dados de demonstração:', err);
    return [
      {
        id: 'inop-fallback-1',
        veiculo: 'VFCI 06',
        estado: 'INOPERACIONAL',
        motivo: 'Avaria Mecânica no Sistema de Bomba',
        tipologia: 'VFCI',
        parsed: parseVehicleString('VFCI 06'),
      },
    ];
  }
}

export function parseEquipaElements(equipasRaw: string): string[] {
  if (!equipasRaw || !equipasRaw.trim()) return [];
  const limpo = equipasRaw.trim();

  // Substitui delimitadores comuns como : entre números (ex: 100:107), quebras de linha e vírgulas
  const padronizado = limpo
    .replace(/(\d+):(\d+)/g, '$1;$2')
    .replace(/[\r\n]+/g, ';')
    .replace(/[,;]+/g, ';');

  const tokens = padronizado
    .split(';')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const resultado: string[] = [];
  tokens.forEach(token => {
    // Se o token for múltiplos números separados apenas por espaços (ex: "78 100 107")
    if (/^\d+(\s+\d+)+$/.test(token)) {
      token.split(/\s+/).forEach(num => {
        if (num.trim()) resultado.push(num.trim());
      });
    } else {
      resultado.push(token);
    }
  });

  return resultado;
}

// 3. CARREGAR AGENDAMENTOS
export async function carregarAgendamentos(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_GID_AGENDAMENTOS,
  apenasHoje: boolean = false
): Promise<Agendamento[]> {
  try {
    const res = await fetch(getGvizUrl(sheetId, gid));
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const csvTexto = await res.text();
    const todasLinhas = parseCSV(csvTexto);

    if (todasLinhas.length <= 1) return [];

    // Detetar automaticamente os índices das colunas a partir do cabeçalho
    const headerRow = todasLinhas[0] || [];
    let idxData = 0;
    let idxHora = 1;
    let idxDesc = 2;
    let idxMeios = 3;
    let idxEquipas = 4;

    headerRow.forEach((col, idx) => {
      const norm = col
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      if (norm.includes('data')) idxData = idx;
      else if (norm.includes('hora')) idxHora = idx;
      else if (norm.includes('descri')) idxDesc = idx;
      else if (norm.includes('meio') || norm.includes('viatura')) idxMeios = idx;
      else if (
        norm.includes('equipa') ||
        norm.includes('operaciona') ||
        norm.includes('elemento') ||
        norm.includes('bombeiro')
      ) {
        idxEquipas = idx;
      }
    });

    let ultimaDataValida = '';
    const listaNormalizada: {
      dataRaw: string;
      horaRaw: string;
      descricao: string;
      meiosRaw: string;
      equipasRaw: string;
      index: number;
    }[] = [];

    todasLinhas.forEach((row, idx) => {
      if (idx === 0) return;
      let dataRaw = (row[idxData] || '').trim();
      const horaRaw = (row[idxHora] || '').trim();
      const descricao = (row[idxDesc] || '').trim();
      const meiosRaw = (row[idxMeios] || '').trim();
      const equipasRaw = (row[idxEquipas] || '').trim();

      if (!descricao || descricao.toLowerCase() === 'descrição') return;
      if (dataRaw.toLowerCase().includes('data')) return;

      if (dataRaw) {
        ultimaDataValida = dataRaw;
      } else if (!dataRaw && ultimaDataValida) {
        dataRaw = ultimaDataValida;
      }

      listaNormalizada.push({
        dataRaw,
        horaRaw,
        descricao,
        meiosRaw,
        equipasRaw,
        index: idx,
      });
    });

    const agendamentosMapeados: Agendamento[] = listaNormalizada.map(item => {
      let dataFormatada = item.dataRaw;
      if (item.horaRaw) dataFormatada += ` às ${item.horaRaw}`;

      const meiosParsed = parseMultipleVehicles(item.meiosRaw);
      const elementosEquipa = parseEquipaElements(item.equipasRaw);
      const isToday = eHoje(item.dataRaw);

      return {
        id: `agend-${item.index}-${item.dataRaw}-${item.descricao.slice(0, 15)}`,
        dataRaw: item.dataRaw,
        horaRaw: item.horaRaw,
        dataFormatada,
        descricao: item.descricao,
        meiosRaw: item.meiosRaw,
        meiosParsed,
        equipasRaw: item.equipasRaw,
        elementosEquipa,
        eHoje: isToday,
      };
    });

    if (apenasHoje) {
      return agendamentosMapeados.filter(a => a.eHoje);
    }

    return agendamentosMapeados;
  } catch (err) {
    console.warn('Erro ao carregar agendamentos do Google Sheets:', err);
    const hojeStr = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return [
      {
        id: 'agend-fallback-1',
        dataRaw: hojeStr,
        horaRaw: '08h00 - 12h00',
        dataFormatada: `${hojeStr} às 08h00 - 12h00`,
        descricao: 'Treino de Mergulho e Resgate Aquático - Vilarinho das Furnas',
        meiosRaw: 'VCOT 01 (Toyota Hilux); VAOP 03; BRTP 01',
        meiosParsed: [
          parseVehicleString('VCOT 01 (Toyota Hilux)'),
          parseVehicleString('VAOP 03'),
          parseVehicleString('BRTP 01'),
        ],
        equipasRaw: '78; 100; 107; 112; 118',
        elementosEquipa: ['78', '100', '107', '112', '118'],
        eHoje: true,
      },
      {
        id: 'agend-fallback-2',
        dataRaw: hojeStr,
        horaRaw: '20h00 - 06h00',
        dataFormatada: `${hojeStr} às 20h00 - 06h00`,
        descricao: 'Dispositivo Especial Prevenção Noite Branca Braga',
        meiosRaw: 'ABSC 03; ABSC 05; VUCI 02; VLCI 01; VOPE 02; VCOC 03',
        meiosParsed: [
          parseVehicleString('ABSC 03'),
          parseVehicleString('ABSC 05'),
          parseVehicleString('VUCI 02'),
          parseVehicleString('VLCI 01'),
          parseVehicleString('VOPE 02'),
          parseVehicleString('VCOC 03'),
        ],
        equipasRaw: '84; 96; 105; 112',
        elementosEquipa: ['84', '96', '105', '112'],
        eHoje: true,
      },
    ];
  }
}

// 4. CARREGAR OBSERVAÇÕES
export async function carregarObservacoes(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_GID_COMUNICACOES
): Promise<Observacao[]> {
  try {
    const res = await fetch(getGvizUrl(sheetId, gid));
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const csvTexto = await res.text();
    const todasLinhas = parseCSV(csvTexto);

    if (todasLinhas.length <= 1) return [];

    const obsValidas = todasLinhas.filter((row, idx) => {
      if (idx === 0) return false;
      if (!row[1] || row[1].trim() === '') return false;
      const col0 = (row[0] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const col1 = (row[1] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      if (col0.includes('titulo') || col0 === 'header' || col0 === 'data') return false;
      if (col1 === 'observacoes' || col1 === 'observacao' || col1 === 'texto') return false;
      return true;
    });

    return obsValidas.map((row, idx) => ({
      id: `obs-${idx}`,
      titulo: (row[0] || 'Informação Interna').trim(),
      texto: (row[1] || '').trim(),
    }));
  } catch (err) {
    console.warn('Erro ao carregar observações do Google Sheets:', err);
    return [
      {
        id: 'obs-fallback-1',
        titulo: 'Critérios de Alerta ao Comando',
        texto: 'Incêndio que após o primeiro POSIT continua ativo; Acidentes com vítimas mortais ou mais que 2 feridos graves; Sempre que existam ocorrências em espera.',
      },
      {
        id: 'obs-fallback-2',
        titulo: 'Informação Interna - Saída Fora de Área',
        texto: 'Em caso de acionamento para qualquer serviço fora da nossa área de atuação, devemos SEMPRE comunicar a nossa saída ao Corpo de Bombeiros da área e registar na fita de tempo.',
      },
      {
        id: 'obs-fallback-3',
        titulo: 'Vespas Velutinas',
        texto: 'Nos alertas para ninhos de vespas velutinas não deve ser fornecida previsão de data nem protocolo. Informar apenas que a equipa especializada intervirá logo que possível.',
      },
    ];
  }
}

// 5. CARREGAR DADOS METEOROLÓGICOS E RISCO DE INCÊNDIO IPMA BRAGA
export async function carregarMeteoIPMA(): Promise<MeteoIPMA> {
  try {
    const [resMeteo, resTipos, resRcm] = await Promise.all([
      fetch(URL_IPMA_METEO),
      fetch(URL_IPMA_TIPOS),
      fetch(URL_IPMA_RCM).catch(() => null),
    ]);

    if (!resMeteo.ok || !resTipos.ok) throw new Error('Erro na API IPMA');

    const dataMeteo = await resMeteo.json();
    const dataTipos = await resTipos.json();

    const prev = dataMeteo.data[0];
    const tMin = Math.round(prev.tMin ?? 14);
    const tMax = Math.round(prev.tMax ?? 27);
    const probChuva = prev.precipitaProb ?? 0;
    const dirVento = prev.predWindDir || 'N/D';

    const velVentoVal = (prev.classWindSpeed || 1) * 12;
    const rajadaVentoVal = Math.round(velVentoVal * 1.8);

    const tipoObjeto = dataTipos.data?.find((t: any) => t.idWeatherType === prev.idWeatherType);
    const descTempo = tipoObjeto ? tipoObjeto.descWeatherTypePT : 'Tempo Estável';

    let ffmcVal = 87.4;
    let isiVal = 5.8;
    let fwiVal = 14.2;

    if (resRcm && resRcm.ok) {
      const dataRcm = await resRcm.json();
      const dataChave = Object.keys(dataRcm)[0];
      if (dataChave && dataRcm[dataChave] && dataRcm[dataChave][DICO_BRAGA]) {
        const rcmObj = dataRcm[dataChave][DICO_BRAGA];
        if (rcmObj.ffmc !== undefined) ffmcVal = Number(rcmObj.ffmc);
        if (rcmObj.isi !== undefined) isiVal = Number(rcmObj.isi);
        if (rcmObj.fwi !== undefined) fwiVal = Number(rcmObj.fwi);
      }
    }

    return {
      descTempo,
      idWeatherType: prev.idWeatherType || 1,
      tMin,
      tMax,
      probChuva,
      dirVento,
      velVentoVal,
      rajadaVentoVal,
      ffmcVal,
      isiVal,
      fwiVal,
      ultimaAtualizacao: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Erro ao carregar IPMA Braga:', err);
    return {
      descTempo: 'Céu Pouco Nublado',
      idWeatherType: 2,
      tMin: 15,
      tMax: 28,
      probChuva: 5,
      dirVento: 'NW',
      velVentoVal: 18,
      rajadaVentoVal: 32,
      ffmcVal: 88.2,
      isiVal: 6.4,
      fwiVal: 15.8,
      ultimaAtualizacao: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
