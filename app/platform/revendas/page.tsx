'use client';

import { useState } from 'react';
import { PlatformLayout } from '@/app/components/PlatformLayout';
import { mockRevendas } from '@/app/data/mockData';
import { ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

export default function RevendasPage() {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterAgent, setFilterAgent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRevendas = mockRevendas.filter((r) => {
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchAgent = !filterAgent || r.responsable.id === filterAgent;
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchAgent && matchSearch;
  });

  const statusColors: Record<string, string> = {
    'nao-iniciada': 'bg-gray-100 text-gray-800',
    'em-implantacao': 'bg-blue-100 text-blue-800',
    'em-treinamento': 'bg-yellow-100 text-yellow-800',
    'aguardando-revenda': 'bg-purple-100 text-purple-800',
    'com-pendencia': 'bg-orange-100 text-orange-800',
    'atrasada': 'bg-red-100 text-red-800',
    'concluida': 'bg-green-100 text-green-800',
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
    <PlatformLayout currentPage="revendas">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
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
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos os Agentes</option>
              {/* Aqui viria lista de agentes */}
            </select>
          </div>
        </div>

        {/* Tabela de Revendas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Responsável</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Progresso</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dias</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pendências</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRevendas.map((revenda) => (
                <tr key={revenda.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{revenda.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{revenda.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{revenda.responsable.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[revenda.status]}`}>
                      {statusLabels[revenda.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${revenda.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{revenda.progressPercentage}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{revenda.implantationDays}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        revenda.pendenciesCount > 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {revenda.pendenciesCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/platform/revendas/${revenda.id}`}
                      className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Ver <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRevendas.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Nenhuma revenda encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
