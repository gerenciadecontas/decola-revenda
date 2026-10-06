export type LiveStatus = 'agendada' | 'realizada' | 'cancelada';

export interface Live {
  id?: string;
  tema: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  duracao?: number;
  apresentador?: string;
  modulo: string;
  link?: string;
  descricao?: string;
  status: LiveStatus;
  created_at?: string;
  updated_at?: string;
}

export const LIVES_TABLE = 'jornada-lives';

export const LIVE_MODULOS = ['Geral', 'LC WEB', 'LC ERP Desktop', 'Serviços adicionais'];

export const LIVE_STATUS: Record<LiveStatus, { label: string; c: string }> = {
  agendada: { label: 'Agendada', c: '#7C5CF0' },
  realizada: { label: 'Realizada', c: '#4E8E5B' },
  cancelada: { label: 'Cancelada', c: '#D9534F' },
};

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const liveDate = (l: Live) => new Date(`${l.data}T${l.hora || '00:00'}:00`);

export const sortLives = (a: Live, b: Live) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`);

export const isPendente = (l: Live) => l.status === 'agendada' && liveDate(l).getTime() < Date.now();
