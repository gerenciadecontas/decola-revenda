'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Trilha, Revenda, Profile } from '@/lib/types';

export default function AdminRevendasPage() {
  const supabase = createClient();

  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [gestores, setGestores] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    nome: string;
    cnpj: string;
    trilha_id: string;
    gestor_responsavel_id: string;
    status: 'ativa' | 'pausada' | 'concluida';
  }>({
    nome: '',
    cnpj: '',
    trilha_id: '',
    gestor_responsavel_id: '',
    status: 'ativa',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [revendasRes, trilhasRes, gestoresRes] = await Promise.all([
        supabase.from('revendas').select('*').order('nome'),
        supabase.from('trilhas').select('*').order('nome'),
        supabase.from('profiles').select('*').eq('role', 'gestor').order('full_name'),
      ]);

      if (revendasRes.error) throw revendasRes.error;
      if (trilhasRes.error) throw trilhasRes.error;
      if (gestoresRes.error) throw gestoresRes.error;

      setRevendas(revendasRes.data || []);
      setTrilhas(trilhasRes.data || []);
      setGestores(gestoresRes.data || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar dados: ' + (err.message || 'Tente novamente'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cnpj: '',
      trilha_id: '',
      gestor_responsavel_id: '',
      status: 'ativa',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('revendas')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('revendas').insert(formData);

        if (error) throw error;
      }

      resetForm();
      setShowForm(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao salvar revenda');
    }
  };

  const handleEdit = (revenda: Revenda) => {
    setFormData({
      nome: revenda.nome,
      cnpj: revenda.cnpj || '',
      trilha_id: revenda.trilha_id,
      gestor_responsavel_id: revenda.gestor_responsavel_id || '',
      status: revenda.status,
    });
    setEditingId(revenda.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta revenda?')) return;

    try {
      const { error } = await supabase.from('revendas').delete().eq('id', id);

      if (error) throw error;

      await loadData();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao deletar revenda');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Revendas</h1>
            <p className="text-gray-600 mt-2">Crie e atribua revendas aos gestores</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Voltar ao Dashboard
            </Link>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Adicionar Revenda'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Editar Revenda' : 'Nova Revenda'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trilha *
                  </label>
                  <select
                    value={formData.trilha_id}
                    onChange={(e) => setFormData({ ...formData, trilha_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione uma trilha</option>
                    {trilhas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gestor Responsável
                  </label>
                  <select
                    value={formData.gestor_responsavel_id}
                    onChange={(e) =>
                      setFormData({ ...formData, gestor_responsavel_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione um gestor</option>
                    {gestores.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.full_name || g.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'ativa' | 'pausada' | 'concluida',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Criar'} Revenda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Revendas List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {revendas.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Nenhuma revenda cadastrada. Comece adicionando uma!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    CNPJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Trilha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Gestor
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
                {revendas.map((revenda) => {
                  const trilha = trilhas.find((t) => t.id === revenda.trilha_id);
                  const gestor = gestores.find((g) => g.id === revenda.gestor_responsavel_id);

                  return (
                    <tr key={revenda.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{revenda.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {revenda.cnpj || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{trilha?.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {gestor?.full_name || '-'}
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
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(revenda)}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(revenda.id)}
                            className="text-red-600 hover:underline"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
