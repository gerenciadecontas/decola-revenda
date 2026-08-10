export interface Trilha {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface Dia {
  id: string;
  trilha_id: string;
  numero: number;
  titulo: string;
  objetivo?: string;
  created_at: string;
  updated_at: string;
}

export interface Tema {
  id: string;
  dia_id: string;
  nome_tela: string;
  acessos?: number;
  created_at: string;
  updated_at: string;
}

export interface Revenda {
  id: string;
  nome: string;
  cnpj?: string;
  status: 'ativa' | 'pausada' | 'concluida';
  trilha_id: string;
  gestor_responsavel_id?: string;
  data_inicio: string;
  created_at: string;
  updated_at: string;
}

export interface Progresso {
  id: string;
  revenda_id: string;
  tema_id: string;
  concluido: boolean;
  concluido_em?: string;
  concluido_por?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'gestor';
  created_at: string;
  updated_at: string;
}

export interface RevendaComProgresso extends Revenda {
  trilha?: Trilha;
  gestor?: Profile;
  totalTemas?: number;
  temasConcluidos?: number;
  percentualConclusao?: number;
  ultimaAtualizar?: string;
  diasSemAtividade?: number;
}
