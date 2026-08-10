'use client';

interface RoleToggleProps {
  role: 'admin' | 'gestor';
  onRoleChange: (role: 'admin' | 'gestor') => void;
}

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onRoleChange('admin')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          role === 'admin'
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700'
        }`}
      >
        👨‍💼 Admin
      </button>
      <button
        onClick={() => onRoleChange('gestor')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          role === 'gestor'
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700'
        }`}
      >
        👤 Gestor
      </button>
    </div>
  );
}
