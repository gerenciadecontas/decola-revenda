'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockAgents, mockRevendas } from '@/app/data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Mail, Phone, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AgenteDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  const agent = mockAgents.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <PlatformLayout currentPage="agentes">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">Agente não encontrado</p>
        </div>
      </PlatformLayout>
    );
  }

  // Filtrar revendas do agente
  const agentRevendas = mockRevendas.filter(
    (r) => r.responsable.id === agentId
  );

  // Dados para gráfico de performance mensal
  const performanceData = [
    { mes: 'Jan', revendas: 2, concluidas: 2, taxa: 100 },
    { mes: 'Fev', revendas: 3, concluidas: 2, taxa: 67 },
    { mes: 'Mar', revendas: 2, concluidas: 2, taxa: 100 },
    { mes: 'Abr', revendas: 4, concluidas: 3, taxa: 75 },
    { mes: 'Mai', revendas: 3, concluidas: 2, taxa: 67 },
    { mes: 'Jun', revendas: 1, concluidas: 1, taxa: 100 },
  ];

  // Status das revendas do agente
  const statusCount = {
    'nao-iniciada': agentRevendas.filter((r) => r.status === 'nao-iniciada').length,
    'em-implantacao': agentRevendas.filter((r) => r.status === 'em-implantacao' || r.status === 'em-treinamento').length,
    'com-pendencia': agentRevendas.filter((r) => r.status === 'com-pendencia' || r.status === 'atrasada').length,
    'concluida': agentRevendas.filter((r) => r.status === 'concluida').length,
  };

  const statusDistribution = [
    { name: 'Não Iniciada', value: statusCount['nao-iniciada'], color: '#ef4444' },
    { name: 'Em Andamento', value: statusCount['em-implantacao'], color: '#3b82f6' },
    { name: 'Com Pendência', value: statusCount['com-pendencia'], color: '#f59e0b' },
    { name: 'Concluída', value: statusCount['concluida'], color: '#10b981' },
  ];

  const statusColors: Record<string, string> = {
    'nao-iniciada': 'bg-red-50 border-red-200 text-red-700',
    'em-implantacao': 'bg-blue-50 border-blue-200 text-blue-700',
    'em-treinamento': 'bg-blue-50 border-blue-200 text-blue-700',
    'aguardando-revenda': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'com-pendencia': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'atrasada': 'bg-orange-50 border-orange-200 text-orange-700',
    'concluida': 'bg-green-50 border-green-200 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    'nao-iniciada': 'Não Iniciada',
    'em-implantacao': 'Em Implantação',
    'em-treinamento': 'Em Treinamento',
    'aguardando-revenda': 'Aguardando Revenda',
    'com-pendencia': 'Com Pendência',
    'atrasada': 'Atrasada',
    'concluida': 'Concluída',
  };

  return (
    <PlatformLayout currentPage="agentes">
      <div className="space-y-6">
        {/* Header do Agente */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{agent.name}</h1>
              <div className="space-y-1 text-purple-100">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {agent.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {agent.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{agent.completionRate}%</p>
              <p className="text-purple-100">Taxa de Conclusão</p>
            </div>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revendas Gerenciadas</p>
                <p className="text-3xl font-bold text-gray-900">{agent.revendasCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Implantações Concluídas</p>
                <p className="text-3xl font-bold text-gray-900">{agent.completedImplantations}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revendas Atrasadas</p>
                <p className="text-3xl font-bold text-gray-900">{agent.delayedRevendas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tempo Médio Implementação</p>
                <p className="text-3xl font-bold text-gray-900">{agent.averageImplementationTime}d</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Performance Mensal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revendas" fill="#3b82f6" name="Revendas" />
                <Bar dataKey="concluidas" fill="#10b981" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Taxa de Conclusão */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Conclusão Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="taxa" stroke="#8b5cf6" name="Taxa %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição de Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribuição de Revendas por Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusDistribution.map((status) => (
              <div key={status.name} className="text-center p-4 rounded-lg border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: status.color + '20' }}>
                  <span className="text-2xl font-bold" style={{ color: status.color }}>
                    {status.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{status.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revendas do Agente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revendas Gerenciadas ({agentRevendas.length})</h3>
          <div className="space-y-3">
            {agentRevendas.length > 0 ? (
              agentRevendas.map((revenda) => (
                <div key={revenda.id} className={`border rounded-lg p-4 ${statusColors[revenda.status]}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{revenda.name}</h4>
                      <p className="text-sm opacity-75">{revenda.city}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="font-medium">{revenda.progressPercentage}%</p>
                        <p className="opacity-75">Progresso</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-white bg-opacity-50">
                          {statusLabels[revenda.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-current h-2 rounded-full opacity-75 transition-all"
                      style={{ width: `${revenda.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma revenda gerenciada</p>
            )}
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Treinamentos Hoje</p>
            <p className="text-4xl font-bold text-purple-600">{agent.trainingsToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Treinamentos Este Mês</p>
            <p className="text-4xl font-bold text-blue-600">{agent.trainingsMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Pendências Abertas</p>
            <p className="text-4xl font-bold text-red-600">{agent.openPendencies}</p>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
