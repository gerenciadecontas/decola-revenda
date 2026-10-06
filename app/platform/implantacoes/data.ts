export type Status = 'em-andamento' | 'concluida' | 'pausado' | 'abandonado';
export type Prioridade = 'baixa' | 'normal' | 'alta' | 'urgente';

export interface Implantacao {
  id?: string;
  codigo?: string;
  revenda: string;
  cnpj?: string;
  cidade?: string;
  uf?: string;
  email?: string;
  telefone?: string;
  contato?: string;
  cargo?: string;
  situacao?: string;
  segmento?: string;
  porte?: string;
  vendedores?: number;
  data_ingresso?: string;
  data_aniversario?: string;
  contratos?: number;
  curva?: string;
  etapa: string;
  prioridade: Prioridade;
  produto: string;
  responsavel?: string;
  data_prevista?: string;
  observacoes?: string;
  status: Status;
  etapa_desde?: string;
  created_at?: string;
  updated_at?: string;
}

export const STAGES = [
  { id: 'chegada', nome: 'Chegada', c: '#E6B23E' },
  { id: 'boas-vindas', nome: 'Boas-vindas', c: '#C99526' },
  { id: 'sem-retorno', nome: 'Sem retorno', c: '#D9534F' },
  { id: 'apresentacao-desktop', nome: 'Apresentação e instalação', c: '#7C5CF0' },
  { id: 'apresentacao-web', nome: 'Web', c: '#5B43C0' },
  { id: 'lc-academy', nome: 'LC Academy', c: '#8B9099' },
  { id: 'acompanhamento', nome: 'Acompanhamento', c: '#4E8E5B' },
  { id: 'decola-produtos', nome: 'Produtos', c: '#7C5CF0' },
  { id: 'ativou-3', nome: 'Go-Live', c: '#4E8E5B' },
  { id: 'pausado', nome: 'Pausado', c: '#E6B23E' },
  { id: 'abandonado', nome: 'Abandono', c: '#D9534F' },
];

export const PRIORIDADES: Record<Prioridade, { label: string; c: string }> = {
  baixa: { label: 'Baixa', c: '#8B9099' },
  normal: { label: 'Normal', c: '#4A90E2' },
  alta: { label: 'Alta', c: '#E2944A' },
  urgente: { label: 'Urgente', c: '#D9534F' },
};

export const PRODUTOS = ['LC ERP Desktop', 'LC WEB', 'LC ERP Desktop + LC WEB', 'Outros'];

export const PARADA_DIAS = 5;

export const daysSince = (iso?: string) =>
  iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) : 0;

export const diasNaEtapa = (c: Implantacao) => daysSince(c.etapa_desde || c.created_at);
