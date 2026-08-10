'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CronogramaAccordion from '@/components/CronogramaAccordion';
import { Dia, Tema, Progresso, Revenda } from '@/lib/types';

export default function RevendaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const revendaId = params.id as string;
  const supabase = createClient();

  const [revenda, setRevenda] = useState<Revenda | null>(null);
  const [dias, setDias] = useState<Dia[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [revendaId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load revenda
      const { data: revendaData } = await supabase
        .from('revendas')
        .select('*')
        .eq('id', revendaId)
        .single();

      if (!revendaData) {
        setError('Revenda não encontrada');
        return;
      }

      setRevenda(revendaData);

      // Load dias and temas for this trilha
      const { data: diasData } = await supabase
        .from('dias')
        .select('*')
        .eq('trilha_id', revendaData.trilha_id)
        .order('numero');

      const { data: temasData } = await supabase
        .from('temas')
        .select('*')
        .in('dia_id', diasData?.map((d) => d.id) || []);

      // Load progresso for this revenda
      const { data: progressoData } = await supabase
        .from('progresso')
        .select('*')
        .eq('revenda_id', revendaId);

      setDias(diasData || []);
      setTemas(temasData || []);
      setProgresso(progressoData || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleProgressoChange = async (temaId: string, concluido: boolean) => {
    try {
      const existente = progresso.find((p) => p.tema_id === temaId);

      if (existente) {
        await supabase
          .from('progresso')
          .update({
            concluido,
            concluido_em: concluido ? new Date().toISOString() : null,
          })
          .eq('id', existente.id);
      } else {
        await supabase.from('progresso').insert({
          revenda_id: revendaId,
          tema_id: temaId,
          concluido,
          concluido_em: concluido ? new Date().toISOString() : null,
        });
      }

      // Reload progresso
      const { data: updatedProgresso } = await supabase
        .from('progresso')
        .select('*')
        .eq('revenda_id', revendaId);

      setProgresso(updatedProgresso || []);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao atualizar progresso');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !revenda) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Revenda não encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const concluidos = progresso.filter((p) => p.concluido).length;
  const percentual = temas.length > 0 ? Math.round((concluidos / temas.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-purple-600 hover:underline mb-6 text-sm"
        >
          ← Voltar
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{revenda.nome}</h1>
              <p className="text-gray-600 mt-1">{revenda.cnpj || 'Sem CNPJ'}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Progresso</p>
              <p className="text-2xl font-bold text-purple-600">{percentual}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Temas</p>
              <p className="text-2xl font-bold text-gray-900">
                {concluidos}/{temas.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Iniciado em</p>
              <p className="text-sm font-mono text-gray-700">
                {new Date(revenda.data_inicio).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dias decorridos</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(
                  (new Date().getTime() - new Date(revenda.data_inicio).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Barra de progresso</span>
              <span className="text-gray-600">{percentual}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cronograma de Treinamento</h2>
          <CronogramaAccordion
            dias={dias}
            temas={temas}
            progresso={progresso}
            onProgressoChange={handleProgressoChange}
            readOnly={false}
          />
        </div>
      </div>
    </div>
  );
}
