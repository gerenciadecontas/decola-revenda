'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

export default function RelatoriosPage() {
  return (
    <PlatformLayout currentPage="relatorios">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg">Página de Relatórios em desenvolvimento</p>
        <p className="text-gray-500 mt-2">Em breve: Relatórios com filtros por período, agente e status</p>
      </div>
    </PlatformLayout>
  );
}
