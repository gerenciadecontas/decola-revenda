'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockTrainings, mockAgents } from '@/app/data/mockData';
import { Calendar, Clock, Users } from 'lucide-react';

export default function AgendaPage() {
  // Agrupar treinamentos por data
  const trainingsByDate: Record<string, typeof mockTrainings> = {};
  mockTrainings.forEach((training) => {
    if (!trainingsByDate[training.scheduledDate]) {
      trainingsByDate[training.scheduledDate] = [];
    }
    trainingsByDate[training.scheduledDate].push(training);
  });

  const sortedDates = Object.keys(trainingsByDate).sort();

  const statusIndicators: Record<string, string> = {
    agendado: 'bg-blue-500',
    realizado: 'bg-green-500',
    'nao-compareceu': 'bg-red-500',
    cancelado: 'bg-gray-500',
    reagendado: 'bg-yellow-500',
    pendente: 'bg-orange-500',
  };

  return (
    <PlatformLayout currentPage="agenda">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendário Lateral */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário</h3>
            <div className="space-y-2">
              {sortedDates.map((date) => {
                const count = trainingsByDate[date].length;
                return (
                  <div key={date} className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <p className="font-medium text-gray-900">{new Date(date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">{count} treinamento{count !== 1 ? 's' : ''}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline de Treinamentos */}
          <div className="lg:col-span-3 space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <Calendar className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                </div>

                <div className="space-y-4">
                  {trainingsByDate[date]
                    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                    .map((training) => (
                      <div key={training.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-1 rounded ${statusIndicators[training.status]}`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{training.topic}</h4>
                              <p className="text-sm text-gray-600">{training.revenda.name}</p>
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-white text-gray-700 border border-gray-200">
                              {training.status === 'agendado'
                                ? 'Agendado'
                                : training.status === 'realizado'
                                ? 'Realizado'
                                : training.status === 'nao-compareceu'
                                ? 'Não Compareceu'
                                : 'Outro'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock size={16} />
                              {training.scheduledTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={16} />
                              {training.agent.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
