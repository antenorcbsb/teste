export type VehicleTypology =
  | 'VLCI'   // Veículo Ligeiro de Combate a Incêndios (Carro ligeiro de bombeiros)
  | 'ABSC'   // Ambulância de Socorro
  | 'VCOT'   // Veículo de Comando Tático
  | 'VAOP'   // Veículo de Apoio Operacional
  | 'VCOC'   // Veículo de Comando Operacional e Comunicações
  | 'VFCI'   // Veículo Florestal de Combate a Incêndios (Carro pesado)
  | 'VUCI'   // Veículo Urbano de Combate a Incêndios (Carro pesado)
  | 'VRCI'   // Veículo Rural de Combate a Incêndios
  | 'VECI'   // Veículo Especial de Combate a Incêndios
  | 'VTTU'   // Veículo Tanque Tático Urbano (Autotanque)
  | 'VTTP'   // Veículo Tanque Tático Pesado
  | 'VE30'   // Veículo Escada / Plataforma 30m
  | 'VP30'   // Veículo Plataforma 30m
  | 'VOPE'   // Veículo de Operações Específicas
  | 'VPMA'   // Veículo Posto Médico Avançado
  | 'BRTP'   // Bote de Resgate / Embarcação
  | 'EAPH'   // Equipa de Apoio Pré-Hospitalar
  | 'GENERICO';

export interface VehicleParsed {
  raw: string;
  codigo: string;
  subtipo?: string;
  tipologia: VehicleTypology;
  designacao: string;
  descricaoCompleta: string;
}

export interface CanalRadio {
  texto: string;
  classe: 'badge-bsb' | 'badge-rob' | 'badge-repc' | 'badge-siresp' | 'badge-dmo';
  tipoNome: string;
}

export interface TeatroOperacao {
  id: string;
  dataInicio: string;
  dataFim: string;
  evento: string;
  canais: CanalRadio[];
  estaAtivo: boolean;
}

export interface ViaturaInop {
  id: string;
  veiculo: string;
  estado: string;
  motivo: string;
  tipologia: VehicleTypology;
  parsed: VehicleParsed;
}

export interface Agendamento {
  id: string;
  dataRaw: string;
  horaRaw: string;
  dataFormatada: string;
  descricao: string;
  meiosRaw: string;
  meiosParsed: VehicleParsed[];
  equipasRaw?: string;
  elementosEquipa: string[];
  eHoje: boolean;
}

export interface Observacao {
  id: string;
  titulo: string;
  texto: string;
}

export interface MeteoIPMA {
  descTempo: string;
  idWeatherType: number;
  tMin: number;
  tMax: number;
  probChuva: number;
  dirVento: string;
  velVentoVal: number;
  rajadaVentoVal: number;
  ffmcVal: number;
  isiVal: number;
  fwiVal: number;
  ultimaAtualizacao: string;
}

export type LayoutMode = 'quad' | 'panoramic' | 'vertical';
export type ScaleMode = 'auto-fit' | 'scroll';

export interface AppSettings {
  sheetId: string;
  gidViaturas: string;
  gidCanais: string;
  gidAgendamentos: string;
  gidComunicacoes: string;
  dicoBraga: string;
  intervaloSegundos: number;
  layoutMode: LayoutMode;
  scaleMode: ScaleMode;
  mostrarApenasHoje: boolean;
}
