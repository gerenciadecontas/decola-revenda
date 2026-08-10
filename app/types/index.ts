// Tipos para a plataforma de implantação

export type UserRole = 'gestor' | 'agente-canal';
export type ImplantationStatus = 'nao-iniciada' | 'em-implantacao' | 'em-treinamento' | 'aguardando-revenda' | 'com-pendencia' | 'atrasada' | 'concluida';
export type TrainingStatus = 'agendado' | 'realizado' | 'nao-compareceu' | 'cancelado' | 'reagendado' | 'pendente';
export type PendencyStatus = 'aberta' | 'em-andamento' | 'resolvida' | 'bloqueada';
export type PendencyCategory = 'treinamento' | 'configuracao' | 'fiscal' | 'financeiro' | 'suporte' | 'desenvolvimento' | 'revenda' | 'comercial' | 'outro';
export type PendencyPriority = 'baixa' | 'media' | 'alta' | 'critica';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  revendasCount: number;
  trainingsToday: number;
  trainingsMonth: number;
  completedImplantations: number;
  delayedRevendas: number;
  openPendencies: number;
  completionRate: number;
  averageImplementationTime: number;
}

export interface Revenda {
  id: string;
  name: string;
  city: string;
  state: string;
  cnpj: string;
  entryDate: string;
  responsable: Agent;
  status: ImplantationStatus;
  progressPercentage: number;
  nextTraining?: Training;
  lastTraining?: Training;
  pendenciesCount: number;
  implantationDays: number;
  estimatedCompletionDate: string;
  completionDate?: string;
  daysWithoutTraining: number;
  stages: Stage[];
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'nao-iniciada' | 'em-andamento' | 'concluida';
  scheduledDate: string;
  completionDate?: string;
  responsable: Agent;
  content: string;
  observations?: string;
}

export interface Training {
  id: string;
  revenda: Revenda;
  topic: string;
  agent: Agent;
  status: TrainingStatus;
  scheduledDate: string;
  scheduledTime: string;
  scheduledDuration: number;
  completionDate?: string;
  duration?: number;
  participants?: string[];
  content?: string;
  difficulties?: string[];
  pendencies?: Pendency[];
  needsReinforcement?: boolean;
  nextTraining?: string;
  observations?: string;
}

export interface Pendency {
  id: string;
  revenda: Revenda;
  responsable: Agent;
  description: string;
  category: PendencyCategory;
  priority: PendencyPriority;
  openDate: string;
  dueDate: string;
  status: PendencyStatus;
  observations?: string;
  resolution?: string;
}

export interface DashboardMetrics {
  revendasInProgress: number;
  implementationsCompleted: number;
  trainingsToday: number;
  pendingTrainings: number;
  delayedRevendas: number;
  openPendencies: number;
  averageImplementationTime: number;
  completionRate: number;
  trainingsCompletedToday: number;
  revendasWithoutTraining: number;
}

export interface ChartData {
  month: string;
  initiated: number;
  completed: number;
}

export interface StatusChartData {
  status: string;
  count: number;
}

export interface DelayReasonData {
  reason: string;
  count: number;
}

export interface AgentPerformanceData {
  agent: string;
  revendas: number;
  completed: number;
  trainings: number;
  delayed: number;
  completionRate: number;
}

export interface FunnelData {
  stage: string;
  value: number;
}
