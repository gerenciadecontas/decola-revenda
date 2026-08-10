'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockAgents } from '@/app/data/mockData';
import { ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AgentesPage() {
  return (
    <PlatformLayout currentPage="agentes">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/platform/agentes/${agent.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.email}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Revendas</span>
                  <span className="font-semibold text-gray-900">{agent.revendasCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Treinamentos Mês</span>
                  <span className="font-semibold text-gray-900">{agent.trainingsMonth}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Concluídas</span>
                  <span className="font-semibold text-green-600">{agent.completedImplantations}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Taxa Conclusão</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="font-semibold text-green-600">{agent.completionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600"
                      style={{ width: `${agent.completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{agent.completionRate}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PlatformLayout>
  );
}
