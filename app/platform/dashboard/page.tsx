'use client';

import { useEffect, useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockRevendas, mockAgents, mockTrainings, mockPendencies } from '@/app/data/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calcular métricas
  const revendasEmImplantacao = mockRevendas.filter((r) => r.status === 'em-implantacao').length;
  const implementacoesCompletas = mockRevendas.filter((r) => r.status === 'concluida').length;
  const treinamentosHoje = mockTrainings.filter(
    (t) => t.scheduledDate === new Date().toISOString().split('T')[0]
  ).length;
  const pendenciaAberta = mockPendencies.filter((p) => p.status === 'aberta').length;
  const revendasAtrasadas = mockRevendas.filter((r) => r.status === 'atrasada').length;
  const tempoMedioImplantacao =
    Math.round(
      mockRevendas.reduce((sum, r) => sum + r.implantationDays, 0) / mockRevendas.length
    ) || 0;

  // Dados para gráficos
  const implementacoesChart = [
    { month: 'Jan', iniciadas: 8, concluidas: 3 },
    { month: 'Fev', iniciadas: 5, concluidas: 4 },
    { month: 'Mar', iniciadas: 6, concluidas: 5 },
  ];

  const statusChart = [
    { name: 'Não Iniciada', value: 1, color: '#94a3b8' },
    { name: 'Em Implantação', value: revendasEmImplantacao, color: '#3b82f6' },
    { name: 'Em Treinamento', value: 4, color: '#f59e0b' },
    { name: 'Aguardando Revenda', value: 1, color: '#8b5cf6' },
    { name: 'Com Pendência', value: 3, color: '#ef4444' },
    { name: 'Atrasada', value: 1, color: '#dc2626' },
    { name: 'Concluída', value: implementacoesCompletas, color: '#10b981' },
  ];

  const funnelData = [
    { value: 10, name: 'Revendas Cadastradas', fill: '#3b82f6' },
    { value: 9, name: 'Iniciaram Implantação', fill: '#8b5cf6' },
    { value: 7, name: 'Iniciaram Treinamento', fill: '#f59e0b' },
    { value: 5, name: 'Concluíram Treinamento', fill: '#06b6d4' },
    { value: 2, name: 'Concluíram Implantação', fill: '#10b981' },
  ];

  const agentPerformance = mockAgents.map((agent) => ({
    name: agent.name.split(' ')[0],
    revendas: agent.revendasCount,
    concluidas: agent.completedImplantations,
    taxa: agent.completionRate,
  }));

  return (
    <PlatformLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revendas em Implantação</p>
                <p className="text-3xl font-bold text-gray-900">{revendasEmImplantacao}</p>
                <p className="text-xs text-gray-500 mt-1">+2 esta semana</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Implantações Concluídas</p>
                <p className="text-3xl font-bold text-gray-900">{implementacoesCompletas}</p>
                <p className="text-xs text-gray-500 mt-1">Este mês</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Treinamentos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{treinamentosHoje}</p>
                <p className="text-xs text-gray-500 mt-1">Programados</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendências Abertas</p>
                <p className="text-3xl font-bold text-gray-900">{pendenciaAberta}</p>
                <p className="text-xs text-gray-500 mt-1">2 críticas</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revendas Atrasadas</p>
                <p className="text-3xl font-bold text-gray-900">{revendasAtrasadas}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tempo Médio Implantação</p>
                <p className="text-3xl font-bold text-gray-900">{tempoMedioImplantacao} dias</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Clock className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-gray-900">20%</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Target className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Implementações por Mês */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Implantações Iniciadas x Concluídas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={implementacoesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="iniciadas" fill="#3b82f6" />
                <Bar dataKey="concluidas" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status das Revendas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revendas por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Funil de Implantação */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Implantação</h3>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} fill="#8884d8">
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Desempenho dos Agentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Desempenho dos Agentes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revendas" fill="#3b82f6" name="Revendas" />
                <Bar dataKey="concluidas" fill="#10b981" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
