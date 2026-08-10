import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';

export default async function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'gestor' && profile.role !== 'admin')) {
    redirect('/login');
  }

  return <>{children}</>;
}
