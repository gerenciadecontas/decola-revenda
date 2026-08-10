import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/login');
  }

  return <>{children}</>;
}
