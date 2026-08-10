'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'admin' | 'gestor' | null;
    const role = savedRole || 'admin';

    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/gestor/revendas');
    }
  }, [router]);

  return null;
}
