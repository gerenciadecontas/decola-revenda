'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockAlerts } from '@/app/data/mockData';
import { AlertCircle, CheckCircle, Clock, Zap, TrendingDown, Users, MessageSquare } from 'lucide-react';

export default function AlertasPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [filterRead, setFilterRead] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity;
    const matchesRead = !filterRead || (filterRead === 'unread' ? !alert.read : alert.read);
    return matchesSeverity && matchesRead;
  });

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critica' && !a.read).length;

  const severityConfig = {
    critica: {
      color: 'bg-red-50 border-red-200 text-red-900',
      badge: 'bg-red-100 text-red-800',
      icon: 'text-red-600',
      label: 'Crítico',
    },
    alta: {
      color: 'bg-orange-50 border-orange-200 text-orange-900',
      badge: 'bg-orange-100 text-orange-800',
      icon: 'text-orange-600',
      label: 'Alto',
    },
    media: {
      color: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: 'text-yellow-600',
      label: 'Médio',
    },
    baixa: {
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badge: 'bg-blue-100 text-blue-800',
      icon: 'text-blue-600',
      label: 'Baixo',
    },
  };

  const typeConfig: Record<string, { icon: any; label: string }> = {
    'revenda-sem-treinamento': { icon: Clock, label: 'Sem Treinamento' },
    'treinamento-atrasado': { icon: TrendingDown, label: 'Treinamento Atrasado' },
    'revenda-atrasada': { icon: AlertCircle, label: 'Revenda Atrasada' },
    'pendencia-critica': { icon: Zap, label: 'Pendência Crítica' },
    'pendencia-vencida': { icon: Clock, label: 'Pendência Vencida' },
    'agente-sobrecarregado': { icon: Users, label: 'Agente Sobrecarregado' },
    'taxa-conclusao-baixa': { icon: TrendingDown, label: 'Taxa Baixa' },
  };

  return (
    <PlatformLayout currentPage="alertas">
      <div className="space-y-6">
        {/* Header com Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Alertas Críticos</p>
                <p className="text-3xl font-bold text-red-900">{criticalCount}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">Não Lidos</p>
                <p className="text-3xl font-bold text-orange-900">{unreadCount}</p>
              </div>
              <MessageSquare className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total de Alertas</p>
                <p className="text-3xl font-bold text-blue-900">{alerts.length}</p>
              </div>
              <CheckCircle className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Severidade</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Todas as Severidades</option>
                <option value="critica">Crítico</option>
                <option value="alta">Alto</option>
                <option value="media">Médio</option>
                <option value="baixa">Baixo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="unread">Não Lidos</option>
                <option value="read">Lidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const severity = severityConfig[alert.severity];
              const TypeIcon = typeConfig[alert.type]?.icon || AlertCircle;

              return (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-6 transition-all ${
                    !alert.read
                      ? `border-l-${alert.severity === 'critica' ? 'red' : alert.severity === 'alta' ? 'orange' : alert.severity === 'media' ? 'yellow' : 'blue'}-600 ${severity.color} shadow-sm`
                      : 'bg-gray-50 border-l-gray-300 border border-gray-200'
                  }`}
                  style={{
                    borderLeft: `4px solid ${
                      alert.severity === 'critica'
                        ? '#dc2626'
                        : alert.severity === 'alta'
                        ? '#ea580c'
                        : alert.severity === 'media'
                        ? '#ca8a04'
                        : '#3b82f6'
                    }`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${severity.badge} shrink-0`}>
                        <TypeIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severity.badge}`}>
                            {severity.label}
                          </span>
                          {!alert.read && (
                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{alert.description}</p>

                        {/* Informações Relacionadas */}
                        <div className="flex flex-wrap gap-4 text-xs">
                          {alert.relatedRevenda && (
                            <div className="bg-white bg-opacity-50 px-3 py-1 rounded border border-gray-300">
                              <span className="font-medium">Revenda:</span> {alert.relatedRevenda.name}
                            </div>
                          )}
                          {alert.relatedAgent && (
                            <div className="bg-white bg-opacity-50 px-3 py-1 rounded border border-gray-300">
                              <span className="font-medium">Agente:</span> {alert.relatedAgent.name}
                            </div>
                          )}
                          {alert.relatedPendency && (
                            <div className="bg-white bg-opacity-50 px-3 py-1 rounded border border-gray-300">
                              <span className="font-medium">Pendência:</span> {alert.relatedPendency.description.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 shrink-0">
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Marcar como lido
                        </button>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(alert.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(alert.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhum alerta encontrado</p>
              <p className="text-gray-500 mt-2">Parabéns! Tudo está funcionando corretamente</p>
            </div>
          )}
        </div>
      </div>
    </PlatformLayout>
  );
}
