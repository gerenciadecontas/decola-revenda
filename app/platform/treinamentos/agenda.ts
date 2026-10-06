import type { ModuloId } from './data';

export type SessaoStatus = 'agendado' | 'realizado' | 'cancelado';

export interface SessaoTreinamento {
  id?: string;
  modulo: ModuloId;
  dia: number;
  titulo: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  duracao?: number;
  revenda?: string;
  instrutor?: string;
  link?: string;
  observacoes?: string;
  status: SessaoStatus;
  created_at?: string;
  updated_at?: string;
}

export const SESSOES_TABLE = 'jornada_sessoes';

export const SESSAO_STATUS: Record<SessaoStatus, { label: string; c: string }> = {
  agendado: { label: 'Agendado', c: '#E6B23E' },
  realizado: { label: 'Realizado', c: '#4E8E5B' },
  cancelado: { label: 'Cancelado', c: '#D9534F' },
};

export const COR_LIVE = '#7C5CF0';
export const COR_TREINAMENTO = '#E6B23E';
