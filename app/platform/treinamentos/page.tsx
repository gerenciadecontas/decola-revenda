'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockTrainings } from '@/app/data/mockData';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

export default function TreinamentosPage() {
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredTrainings = mockTrainings.filter((t) => !filterStatus || t.status === filterStatus);

  const statusColors: Record<string, string> = {
    agendado: 'bg-blue-100 text-blue-800',
    realizado: 'bg-green-100 text-green-800',
    'nao-compareceu': 'bg-red-100 text-red-800',
    cancelado: 'bg-gray-100 text-gray-800',
    reagendado: 'bg-yellow-100 text-yellow-800',
    pendente: 'bg-orange-100 text-orange-800',
  };

  const statusLabels: Record<string, string> = {
    agendado: 'Agendado',
    realizado: 'Realizado',
    'nao-compareceu': 'Não Compareceu',
    cancelado: 'Cancelado',
    reagendado: 'Reagendado',
    pendente: 'Pendente',
  };

  return (
    <PlatformLayout currentPage="treinamentos">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos os Status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Treinamentos */}
        <div className="space-y-4">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{training.topic}</h3>
                  <p className="text-gray-600">{training.revenda.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[training.status]}`}>
                  {statusLabels[training.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">Data</p>
                    <p className="font-medium text-gray-900">{new Date(training.scheduledDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">Horário</p>
                    <p className="font-medium text-gray-900">{training.scheduledTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">Agente</p>
                    <p className="font-medium text-gray-900">{training.agent.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-600">Duração</p>
                    <p className="font-medium text-gray-900">{training.scheduledDuration}min</p>
                  </div>
                </div>
              </div>

              {training.observations && (
                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Observações:</p>
                  <p>{training.observations}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTrainings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Nenhum treinamento encontrado.</p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
