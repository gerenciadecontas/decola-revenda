import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Desenvolvimento: pula autenticação para explorar a plataforma
  redirect('/admin/dashboard');
}
