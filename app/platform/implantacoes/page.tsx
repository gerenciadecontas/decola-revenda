'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

export default function ImplantacoesPage() {
  return (
    <PlatformLayout currentPage="implantacoes">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg">Página de Implantações em desenvolvimento</p>
        <p className="text-gray-500 mt-2">Em breve: Acompanhamento de implantações por etapas</p>
      </div>
    </PlatformLayout>
  );
}
