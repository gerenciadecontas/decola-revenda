import { RoleToggle } from '../components/RoleToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header com toggle */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard Admin</h1>
            <p className="text-gray-400 mt-2">Acompanhe o progresso de todas as revendas</p>
          </div>
          <RoleToggle />
        </div>

        {/* Conteúdo */}
        {children}
      </div>
    </div>
  );
}
