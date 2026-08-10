'use client';

import { CronogramaTrainamento } from '@/app/components/CronogramaTrainamento';

export default function TreinamentosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cronograma de Treinamentos</h1>
        <p className="text-gray-600 mt-2">Plataforma integrada de acompanhamento de treinamentos</p>
      </div>

      <CronogramaTrainamento />
    </div>
  );
}
