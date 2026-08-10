import Link from 'next/link';

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

export default function AdminDashboardPage() {
  const stats = {
    totalRevendas: mockRevendas.length,
    ativas: mockRevendas.filter((r) => r.status === 'ativa').length,
    concluidas: mockRevendas.filter((r) => r.status === 'concluida').length,
    mediaProgresso: Math.round(
      mockRevendas.reduce((sum, r) => sum + r.percentual, 0) / mockRevendas.length
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard de Monitoramento</h1>
          <p className="text-gray-600 mt-2">Acompanhe o progresso de todas as revendas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Total de Revendas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRevendas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Ativas</p>
            <p className="text-3xl font-bold text-green-600">{stats.ativas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Concluídas</p>
            <p className="text-3xl font-bold text-blue-600">{stats.concluidas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm">Progresso Médio</p>
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
              {mockRevendas.map((revenda) => (
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
        <div className="mt-8 flex gap-4">
          <Link
            href="/admin/revendas"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Gerenciar Revendas
          </Link>
        </div>
      </div>
    </div>
  );
}
