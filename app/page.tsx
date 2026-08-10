'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">Carregando plataforma...</p>
    </div>
  );
}
