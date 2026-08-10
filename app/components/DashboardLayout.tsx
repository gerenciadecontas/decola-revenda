'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type TrainingTab = 'lcweb' | 'lcerp' | 'produtos';
type UserRole = 'gestor' | 'agente-canal';

const trainings: Record<TrainingTab, { title: string; days: number; temas: number }> = {
  lcweb: { title: 'LC WEB', days: 10, temas: 73 },
  lcerp: { title: 'LC ERP Desktop', days: 4, temas: 20 },
  produtos: { title: 'Produtos', days: 1, temas: 8 },
};

export function DashboardLayout() {
  const [userRole, setUserRoleState] = useState<UserRole>('gestor');
  const [selectedTab, setSelectedTab] = useState<TrainingTab>('lcweb');
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const savedRole = localStorage.getItem('trainingRole') as UserRole | null;
    if (savedRole) {
      setUserRoleState(savedRole);
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('trainingRole', role);
  };

  const training = trainings[selectedTab];
  const chartData = [
    { name: 'Jan', value: 10 },
    { name: 'Fev', value: 25 },
    { name: 'Mar', value: 35 },
    { name: 'Abr', value: 45 },
    { name: 'Mai', value: 60 },
    { name: 'Jun', value: 72 },
  ];

  const pieData = [
    { name: 'Concluído', value: completionRate, color: '#10b981' },
    { name: 'Pendente', value: 100 - completionRate, color: '#e5e7eb' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Decola</h2>
          <p className="text-sm text-gray-600">Treinamentos</p>
        </div>

        <nav className="px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase">Treinamentos</div>
          {(Object.entries(trainings) as [TrainingTab, typeof trainings[TrainingTab]][]).map(
            ([key, training]) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === key
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {training.title}
              </button>
            )
          )}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">Escolha seu papel:</p>
            <div className="space-y-2">
              <button
                onClick={() => setUserRole('gestor')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userRole === 'gestor'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                👤 Gestor
              </button>
              <button
                onClick={() => setUserRole('agente-canal')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userRole === 'agente-canal'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                🚀 Agente de Canal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{training.title}</h1>
              <p className="text-gray-600 mt-1">
                {userRole === 'gestor' ? 'Acompanhamento de treinamentos' : 'Responsável por todos os treinamentos'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">🔔</button>
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {userRole === 'gestor' ? 'G' : 'A'}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Roxo */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-purple-100 text-sm">Total de Temas</p>
                  <p className="text-4xl font-bold mt-2">${training.temas}</p>
                </div>
                <span className="bg-purple-400 text-white text-xs px-3 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-purple-100 text-sm">Aumento este mês</p>
            </div>

            {/* Card 2 - Verde */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-green-100 text-sm">Temas Concluídos</p>
                  <p className="text-4xl font-bold mt-2">{Math.round(training.temas * completionRate / 100)}</p>
                </div>
                <span className="bg-green-400 text-white text-xs px-3 py-1 rounded-full">+8%</span>
              </div>
              <p className="text-green-100 text-sm">Progresso realizado</p>
            </div>

            {/* Card 3 - Vermelho */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-red-100 text-sm">Dias Restantes</p>
                  <p className="text-4xl font-bold mt-2">{training.days}</p>
                </div>
                <span className="bg-red-400 text-white text-xs px-3 py-1 rounded-full">-5%</span>
              </div>
              <p className="text-red-100 text-sm">Acompanhamento</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso Mensal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conclusão Geral</h3>
              <div className="flex items-center justify-center h-300">
                <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                    <p className="text-xs text-gray-600">Completo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Tema concluído: Cadastro de Produtos</p>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Iniciado: Vendas</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Em andamento: Estoque</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                  <span className="text-sm font-semibold text-gray-900">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-sm text-gray-600">Temas Estudados</span>
                  <span className="text-sm font-semibold text-gray-900">{Math.round(training.temas * completionRate / 100)}/{training.temas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
