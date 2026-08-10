'use client';

import { useRole } from '../context/RoleContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
