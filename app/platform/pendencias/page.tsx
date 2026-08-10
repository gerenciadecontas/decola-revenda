'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockPendencies } from '@/app/data/mockData';
import { AlertCircle, Filter } from 'lucide-react';

export default function PendenciasPage() {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  const filteredPendencies = mockPendencies.filter((p) => {
    const matchStatus = !filterStatus || p.status === filterStatus;
    const matchPriority = !filterPriority || p.priority === filterPriority;
    return matchStatus && matchPriority;
  });

  const priorityColors: Record<string, string> = {
    baixa: 'bg-blue-100 text-blue-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800',
  };

  const statusColors: Record<string, string> = {
    aberta: 'bg-red-50',
    'em-andamento': 'bg-yellow-50',
    resolvida: 'bg-green-50',
    bloqueada: 'bg-gray-50',
  };

  const statusLabels: Record<string, string> = {
    aberta: 'Aberta',
    'em-andamento': 'Em Andamento',
    resolvida: 'Resolvida',
    bloqueada: 'Bloqueada',
  };

  return (
    <PlatformLayout currentPage="pendencias">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="aberta">Aberta</option>
              <option value="em-andamento">Em Andamento</option>
              <option value="resolvida">Resolvida</option>
              <option value="bloqueada">Bloqueada</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas as Prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        {/* Pendências */}
        <div className="space-y-4">
          {filteredPendencies.map((pendency) => (
            <div
              key={pendency.id}
              className={`rounded-lg shadow-sm border border-gray-200 p-6 ${statusColors[pendency.status]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{pendency.revenda.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{pendency.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Responsável</p>
                      <p className="font-medium text-gray-900">{pendency.responsable.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Categoria</p>
                      <p className="font-medium text-gray-900 capitalize">{pendency.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Aberta em</p>
                      <p className="font-medium text-gray-900">{new Date(pendency.openDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Prazo</p>
                      <p className="font-medium text-gray-900">{new Date(pendency.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${priorityColors[pendency.priority]}`}>
                    {pendency.priority.charAt(0).toUpperCase() + pendency.priority.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 whitespace-nowrap">
                    {statusLabels[pendency.status]}
                  </span>
                </div>
              </div>
              {pendency.observations && (
                <div className="mt-4 p-3 bg-white rounded border border-gray-300 text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Observações:</p>
                  <p>{pendency.observations}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPendencies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Nenhuma pendência encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
