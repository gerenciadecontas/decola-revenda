'use client';

import { PlatformLayout } from '@/app/components/PlatformLayout';

export default function ConfiguracoesPage() {
  return (
    <PlatformLayout currentPage="configuracoes">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600 text-lg">Página de Configurações em desenvolvimento</p>
        <p className="text-gray-500 mt-2">Em breve: Configurações da plataforma e perfil do usuário</p>
      </div>
    </PlatformLayout>
  );
}
