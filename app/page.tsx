'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Inicializando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4">
      <p className="text-white text-2xl font-bold">Decola Revenda</p>
      <p className="text-gray-400">Escolha seu papel:</p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          👨‍💼 Gestor
        </button>
        <button
          onClick={() => router.push('/platform/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🚀 Agente de Canal
        </button>
      </div>
    </div>
  );
}
