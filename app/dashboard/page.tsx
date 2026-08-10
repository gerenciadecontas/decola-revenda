'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from './context/RoleContext';

export default function DashboardPage() {
  const router = useRouter();
  const { role } = useRole();

  useEffect(() => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/gestor/revendas');
    }
  }, [role, router]);

  return null;
}
