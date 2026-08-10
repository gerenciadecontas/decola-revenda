'use client';

import { useState, useEffect } from 'react';
import { Dia, Tema, Progresso } from '@/lib/types';

interface CronogramaAccordionProps {
  dias: Dia[];
  temas: Tema[];
  progresso: Progresso[];
  onProgressoChange?: (temaId: string, concluido: boolean) => Promise<void>;
  readOnly?: boolean;
}

export default function CronogramaAccordion({
  dias,
  temas,
  progresso,
  onProgressoChange,
  readOnly = false,
}: CronogramaAccordionProps) {
  const [openDay, setOpenDay] = useState<string | null>(dias[0]?.id || null);
  const [loading, setLoading] = useState<string | null>(null);

  const temasMap = new Map(temas.map((t) => [t.id, t]));
  const progressoMap = new Map(progresso.map((p) => [p.tema_id, p]));

  const getDiasTemas = (diaId: string) => {
    return temas.filter((t) => {
      const dia = dias.find((d) => d.id === diaId);
      return dia && t.dia_id === dia.id;
    });
  };

  const getDiaProgress = (diaId: string) => {
    const dayTemas = getDiasTemas(diaId);
    const completed = dayTemas.filter((t) => progressoMap.get(t.id)?.concluido).length;
    return { completed, total: dayTemas.length };
  };

  const handleCheckboxChange = async (temaId: string, checked: boolean) => {
    if (!onProgressoChange || readOnly) return;

    setLoading(temaId);
    try {
      await onProgressoChange(temaId, checked);
    } finally {
      setLoading(temaId);
    }
  };

  return (
    <div className="space-y-3">
      {dias.map((dia) => {
        const dayTemas = getDiasTemas(dia.id);
        const { completed, total } = getDiaProgress(dia.id);
        const isOpen = openDay === dia.id;

        return (
          <details
            key={dia.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            open={isOpen}
            onToggle={() => setOpenDay(isOpen ? null : dia.id)}
          >
            <summary className="cursor-pointer flex items-center justify-between gap-4 p-5 hover:bg-gray-50 list-none">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                  {dia.numero}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{dia.titulo}</h3>
                  <p className="text-sm text-gray-600 truncate">{dia.objetivo}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {completed}/{total}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    completed === total && total > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {completed}/{total}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </summary>

            {isOpen && (
              <div className="bg-gray-50 border-t border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">
                        Tela
                      </th>
                      <th className="px-6 py-3 text-center font-semibold text-gray-700 w-20">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayTemas.map((tema) => {
                      const p = progressoMap.get(tema.id);
                      const isCompleted = p?.concluido || false;
                      const isLoading = loading === tema.id;

                      return (
                        <tr
                          key={tema.id}
                          className={`border-t border-gray-200 ${
                            isCompleted ? 'bg-gray-100' : 'bg-white'
                          }`}
                        >
                          <td className="px-6 py-3">
                            <code
                              className={`px-2 py-1 rounded text-xs font-mono ${
                                isCompleted
                                  ? 'bg-gray-300 text-gray-600 line-through'
                                  : 'bg-purple-100 text-purple-600'
                              }`}
                            >
                              {tema.nome_tela}
                            </code>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={(e) =>
                                handleCheckboxChange(tema.id, e.target.checked)
                              }
                              disabled={readOnly || isLoading}
                              className="w-5 h-5 text-yellow-500 rounded cursor-pointer disabled:opacity-50"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </details>
        );
      })}
    </div>
  );
}
