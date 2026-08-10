import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function GestorRevendasPage() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== 'gestor') {
    redirect('/login');
  }

  const supabase = await createClient();
  const { data: revendas } = await supabase
    .from('revendas')
    .select(`
      *,
      trilha:trilhas(id, nome),
      progresso(id, concluido)
    `)
    .eq('gestor_responsavel_id', profile.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Revendas</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o treinamento de cada revenda designada a você
          </p>
        </div>

        {!revendas || revendas.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">
              Nenhuma revenda atribuída a você no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {revendas.map((revenda: any) => {
              const progressoItems = revenda.progresso || [];
              const concluidos = progressoItems.filter((p: any) => p.concluido).length;
              const percentual = progressoItems.length > 0
                ? Math.round((concluidos / progressoItems.length) * 100)
                : 0;

              return (
                <Link
                  key={revenda.id}
                  href={`/gestor/revendas/${revenda.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{revenda.nome}</h3>
                    <p className="text-sm text-gray-600">{revenda.trilha?.nome}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Progresso</span>
                        <span className="text-gray-600">{percentual}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {concluidos} de {progressoItems.length} temas concluídos
                    </div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        revenda.status === 'ativa'
                          ? 'bg-green-100 text-green-800'
                          : revenda.status === 'pausada'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {revenda.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
