import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  if (profile.role === 'admin') {
    redirect('/admin/dashboard');
  } else if (profile.role === 'gestor') {
    redirect('/gestor/revendas');
  }

  redirect('/login');
}
