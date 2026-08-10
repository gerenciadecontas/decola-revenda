'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { RoleToggle } from '../components/RoleToggle';

const mockRevendas = [
  {
    id: '1',
    nome: 'Revenda São Paulo',
    trilha: { nome: 'LC WEB' },
    gestor: { full_name: 'João Silva' },
    percentual: 75,
    diasSemAtividade: 2,
    status: 'ativa',
  },
  {
    id: '2',
    nome: 'Revenda Minas Gerais',
    trilha: { nome: 'LC ERP Desktop' },
    gestor: { full_name: 'Maria Santos' },
    percentual: 45,
    diasSemAtividade: 5,
    status: 'ativa',
  },
  {
    id: '3',
    nome: 'Revenda Rio de Janeiro',
    trilha: { nome: 'Produtos' },
    gestor: { full_name: 'Carlos Costa' },
    percentual: 100,
    diasSemAtividade: 0,
    status: 'concluida',
  },
];

const mockRevendasGestor = [
  mockRevendas[0],
  mockRevendas[1],
];

const mockTreinamentoDiario = [
  {
    id: '1',
    colaborador: 'João',
    responsavel: 'Maria',
    diaAtual: '4/10',
    progresso: 32,
    ultimaAtividade: 'Hoje 09:15',
    status: 'em-dia',
    statusEmoji: '🟢',
  },
  {
    id: '2',
    colaborador: 'Carlos',
    responsavel: 'Pedro',
    diaAtual: '2/10',
    progresso: 15,
    ultimaAtividade: 'Ontem',
    status: 'pendente',
    statusEmoji: '🟡',
  },
  {
    id: '3',
    colaborador: 'Ana',
    responsavel: 'Maria',
    diaAtual: '10/10',
    progresso: 100,
    ultimaAtividade: '07/08',
    status: 'concluido',
    statusEmoji: '✅',
  },
];

export default function LoginPage() {
  const [view, setViewState] = useState<'admin' | 'gestor' | null>(null);
  const [subView, setSubView] = useState<'dashboard' | 'treinamento-diario'>('dashboard');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'admin' | 'gestor' | null;
    setViewState(savedRole || 'admin');
  }, []);

  const setView = (role: 'admin' | 'gestor') => {
    setViewState(role);
    localStorage.setItem('userRole', role);
  };

  const revendas = view === 'admin' ? mockRevendas : mockRevendasGestor;

  const stats = {
    totalRevendas: revendas.length,
    ativas: revendas.filter((r) => r.status === 'ativa').length,
    concluidas: revendas.filter((r) => r.status === 'concluida').length,
    mediaProgresso: Math.round(
      revendas.reduce((sum, r) => sum + r.percentual, 0) / revendas.length
    ),
    emAndamento: revendas.filter((r) => r.percentual > 0 && r.percentual < 100).length,
    atrasadas: revendas.filter((r) => r.diasSemAtividade && r.diasSemAtividade > 3).length,
    temasHoje: 8,
    ultimoTreinamento: 'Hoje às 14:30',
    quemRealizou: 'Maria Santos',
  };

  if (view === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {view === 'admin' ? 'Dashboard Admin' : 'Minhas Revendas'}
            </h1>
            <p className="text-gray-400 mt-2">
              {view === 'admin'
                ? 'Acompanhe o progresso de todas as revendas'
                : 'Revendas atribuídas a você'}
            </p>
          </div>
          <RoleToggle />
        </div>

        {/* Sub Views Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-700">
          <button
            onClick={() => setSubView('dashboard')}
            className={`px-4 py-3 font-medium transition-colors ${
              subView === 'dashboard'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setSubView('treinamento-diario')}
            className={`px-4 py-3 font-medium transition-colors ${
              subView === 'treinamento-diario'
                ? 'text-purple-500 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            📅 Treinamento Diário
          </button>
        </div>

        {/* Dashboard View */}
        {subView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">📅</div>
                  <p className="text-gray-600 text-sm">Dias de treinamento</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRevendas}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">📋</div>
                  <p className="text-gray-600 text-sm">Temas totais</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.temasHoje}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">✓</div>
                  <p className="text-gray-600 text-sm">Temas concluídos</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.atrasadas}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">📈</div>
                  <p className="text-gray-600 text-sm">Progresso geral</p>
                </div>
                <p className="text-3xl font-bold text-purple-600">{stats.mediaProgresso}%</p>
              </div>
            </div>

            {/* Revendas Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Trilha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Gestor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Dias s/ Atividade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {revendas.map((revenda) => (
                    <tr key={revenda.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{revenda.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{revenda.trilha.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{revenda.gestor.full_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${revenda.percentual}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{revenda.percentual}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {revenda.diasSemAtividade === 0 ? (
                          <span className="text-green-600">Hoje</span>
                        ) : (
                          <span>{revenda.diasSemAtividade} dias</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            revenda.status === 'ativa'
                              ? 'bg-green-100 text-green-800'
                              : revenda.status === 'pausada'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {revenda.status === 'ativa'
                            ? 'Ativa'
                            : revenda.status === 'pausada'
                            ? 'Pausada'
                            : 'Concluída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/admin/revendas/${revenda.id}`} className="text-blue-600 hover:underline">
                          Ver detalhe
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            {view === 'admin' && (
              <div className="mt-8 flex gap-4">
                <Link
                  href="/admin/revendas"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  ➕ Criar Novo Treinamento
                </Link>
                <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  📝 Editar Cronograma
                </button>
              </div>
            )}
          </>
        )}

        {/* Treinamento Diário View */}
        {subView === 'treinamento-diario' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Colaborador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Dia Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Última Atividade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockTreinamentoDiario.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.colaborador}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.responsavel}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.diaAtual}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${item.progresso}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.progresso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.ultimaAtividade}</td>
                    <td className="px-6 py-4 text-2xl">{item.statusEmoji}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:underline">Marcar</button>
                      <button className="text-green-600 hover:underline">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
