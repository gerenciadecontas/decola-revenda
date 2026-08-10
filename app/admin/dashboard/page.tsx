import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/login');
  }

  const supabase = await createClient();

  // Get all revendas with related data
  const { data: revendas } = await supabase
    .from('revendas')
    .select(`
      *,
      trilha:trilhas(id, nome),
      gestor:profiles(id, full_name),
      progresso(id, concluido, concluido_em)
    `)
    .order('nome');

  // Get all temas count per trilha
  const { data: temasCount } = await supabase
    .from('temas')
    .select('id, dia:dias(trilha_id)');

  const temasPerTrilha: Record<string, number> = {};
  temasCount?.forEach((tema: any) => {
    const trilhaId = tema.dia?.trilha_id;
    if (trilhaId) {
      temasPerTrilha[trilhaId] = (temasPerTrilha[trilhaId] || 0) + 1;
    }
  });

  const revendasComStats = (revendas || []).map((revenda: any) => {
    const progressoItems = revenda.progresso || [];
    const totalTemas = temasPerTrilha[revenda.trilha_id] || 0;
    const concluidos = progressoItems.filter((p: any) => p.concluido).length;
    const percentual = totalTemas > 0 ? Math.round((concluidos / totalTemas) * 100) : 0;

    const ultimaAtividade = progressoItems
      .filter((p: any) => p.concluido_em)
      .sort((a: any, b: any) =>
        new Date(b.concluido_em).getTime() - new Date(a.concluido_em).getTime()
      )[0];

    const diasSemAtividade = ultimaAtividade
      ? Math.floor(
          (new Date().getTime() - new Date(ultimaAtividade.concluido_em).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      ...revenda,
      totalTemas,
      concluidos,
      percentual,
      diasSemAtividade,
      ultimaAtividade: ultimaAtividade?.concluido_em,
    };
  });

  // Sort by percentual (ascending) to show atrasadas first
  revendasComStats.sort((a, b) => a.percentual - b.percentual);

  const stats = {
    totalRevendas: revendasComStats.length,
    ativas: revendasComStats.filter((r) => r.status === 'ativa').length,
    concluidas: revendasComStats.filter((r) => r.status === 'concluida').length,
    mediaProgresso:
      revendasComStats.length > 0
        ? Math.round(revendasComStats.reduce((sum, r) => sum + r.percentual, 0) / revendasComStats.length)
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard de Monitoramento</h1>
            <p className="text-gray-600 mt-2">
              Acompanhamento de progresso de todas as revendas
            </p>
          </div>
          <Link
            href="/admin/revendas"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Gerenciar Revendas
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Total de Revendas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRevendas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Ativas</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.ativas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Concluídas</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.concluidas}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Progresso Médio</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.mediaProgresso}%</p>
          </div>
        </div>

        {/* Revendas Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Revenda
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
                  Dias sem atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revendasComStats.map((revenda) => (
                <tr key={revenda.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{revenda.nome}</p>
                      <p className="text-xs text-gray-600">{revenda.cnpj || '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{revenda.trilha?.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {revenda.gestor?.full_name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{revenda.percentual}%</span>
                        <span className="text-gray-600">
                          {revenda.concluidos}/{revenda.totalTemas}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            revenda.percentual === 100
                              ? 'bg-green-500'
                              : revenda.percentual >= 50
                              ? 'bg-purple-600'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${revenda.percentual}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {revenda.diasSemAtividade !== null ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          revenda.diasSemAtividade > 7
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {revenda.diasSemAtividade}d
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        revenda.status === 'ativa'
                          ? 'bg-green-100 text-green-800'
                          : revenda.status === 'pausada'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {revenda.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/revendas/${revenda.id}`}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      Ver detalhe
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
