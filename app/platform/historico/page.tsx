'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockActivityLogs } from '@/app/data/mockData';
import {
  Plus,
  Edit2,
  CheckCircle,
  Calendar,
  AlertCircle,
  Clock,
  Download,
  Upload,
  UserPlus,
} from 'lucide-react';

export default function HistoricoPage() {
  const [logs, setLogs] = useState(mockActivityLogs);
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterEntity, setFilterEntity] = useState<string>('');
  const [filterAgent, setFilterAgent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesEntity = !filterEntity || log.entityType === filterEntity;
    const matchesAgent = !filterAgent || log.performedBy.id === filterAgent;
    const matchesSearch =
      !searchTerm ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAction && matchesEntity && matchesAgent && matchesSearch;
  });

  const actionIcons: Record<string, any> = {
    criar: Plus,
    atualizar: Edit2,
    concluir: CheckCircle,
    agendar: Calendar,
    cancelar: AlertCircle,
    reagendar: Calendar,
    'marcar-comparecimento': CheckCircle,
    'abrir-pendencia': AlertCircle,
    'resolver-pendencia': CheckCircle,
    exportar: Download,
    importar: Upload,
    atribuir: UserPlus,
  };

  const actionLabels: Record<string, string> = {
    criar: 'Criar',
    atualizar: 'Atualizar',
    concluir: 'Concluir',
    agendar: 'Agendar',
    cancelar: 'Cancelar',
    reagendar: 'Reagendar',
    'marcar-comparecimento': 'Comparecimento',
    'abrir-pendencia': 'Abrir Pendência',
    'resolver-pendencia': 'Resolver Pendência',
    exportar: 'Exportar',
    importar: 'Importar',
    atribuir: 'Atribuir',
  };

  const actionColors: Record<string, string> = {
    criar: 'bg-green-50 border-green-200 text-green-700',
    atualizar: 'bg-blue-50 border-blue-200 text-blue-700',
    concluir: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    agendar: 'bg-purple-50 border-purple-200 text-purple-700',
    cancelar: 'bg-red-50 border-red-200 text-red-700',
    reagendar: 'bg-orange-50 border-orange-200 text-orange-700',
    'marcar-comparecimento': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'abrir-pendencia': 'bg-red-50 border-red-200 text-red-700',
    'resolver-pendencia': 'bg-green-50 border-green-200 text-green-700',
    exportar: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    importar: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    atribuir: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  };

  const entityLabels: Record<string, string> = {
    revenda: 'Revenda',
    treinamento: 'Treinamento',
    pendencia: 'Pendência',
    agente: 'Agente',
    estágio: 'Estágio',
    sistema: 'Sistema',
  };

  const uniqueAgents = [...new Set(logs.map((l) => l.performedBy.id))];
  const uniqueActions = [...new Set(logs.map((l) => l.action))];
  const uniqueEntities = [...new Set(logs.map((l) => l.entityType))];

  return (
    <PlatformLayout currentPage="historico">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Histórico Completo</h1>
          <p className="text-blue-100">Log detalhado de todas as atividades e mudanças no sistema</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por nome, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ação</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as ações</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {actionLabels[action] || action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Entidade</label>
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as entidades</option>
                {uniqueEntities.map((entity) => (
                  <option key={entity} value={entity}>
                    {entityLabels[entity] || entity}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agente</label>
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os agentes</option>
                {uniqueAgents.map((agentId) => {
                  const agent = logs.find((l) => l.performedBy.id === agentId)?.performedBy;
                  return agent ? (
                    <option key={agentId} value={agentId}>
                      {agent.name}
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total de Ações</p>
            <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Filtros Aplicados</p>
            <p className="text-3xl font-bold text-gray-900">{filteredLogs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Agentes</p>
            <p className="text-3xl font-bold text-gray-900">{uniqueAgents.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Período</p>
            <p className="text-sm font-bold text-gray-900">Jan 2024</p>
          </div>
        </div>

        {/* Timeline de Histórico */}
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const ActionIcon = actionIcons[log.action] || Clock;
              const actionColor = actionColors[log.action];

              return (
                <div key={log.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-full border ${actionColor}`}>
                        <ActionIcon size={20} />
                      </div>
                      <div className="w-1 h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{log.entityName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${actionColor}`}>
                              {actionLabels[log.action]}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {entityLabels[log.entityType]}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{log.description}</p>

                          {/* Detalhes adicionais */}
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="bg-gray-50 rounded p-3 mb-3 text-xs text-gray-600">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(log.details).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium">{key}:</span>{' '}
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Informações relacionadas */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            <div className="bg-gray-100 px-3 py-1 rounded border border-gray-300">
                              <span className="font-medium">Por:</span> {log.performedBy.name}
                            </div>
                            {log.relatedRevenda && (
                              <div className="bg-blue-50 px-3 py-1 rounded border border-blue-200">
                                <span className="font-medium text-blue-700">Revenda:</span> {log.relatedRevenda.name}
                              </div>
                            )}
                            {log.relatedTraining && (
                              <div className="bg-purple-50 px-3 py-1 rounded border border-purple-200">
                                <span className="font-medium text-purple-700">Treinamento:</span> {log.relatedTraining.topic}
                              </div>
                            )}
                            {log.relatedPendency && (
                              <div className="bg-orange-50 px-3 py-1 rounded border border-orange-200">
                                <span className="font-medium text-orange-700">Pendência:</span> {log.relatedPendency.description.substring(0, 25)}...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right text-xs text-gray-500 shrink-0">
                          <p>{new Date(log.createdAt).toLocaleDateString('pt-BR')}</p>
                          <p className="font-medium text-gray-700">
                            {new Date(log.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhuma atividade encontrada</p>
              <p className="text-gray-500 mt-2">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
