import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Desenvolvimento: pula autenticação para explorar a plataforma
  redirect('/admin/dashboard');
}
