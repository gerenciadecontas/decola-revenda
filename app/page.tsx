import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Desenvolvimento temporário: pula autenticação para explorar a plataforma
  // TODO: Remover quando Supabase estiver conectado corretamente
  redirect('/admin/dashboard');
}
