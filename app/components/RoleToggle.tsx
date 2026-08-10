'use client';

import { useState, useEffect } from 'react';

export function RoleToggle() {
  const [role, setRoleState] = useState<'admin' | 'gestor'>('admin');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'admin' | 'gestor' | null;
    if (savedRole) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: 'admin' | 'gestor') => {
    setRoleState(newRole);
    localStorage.setItem('userRole', newRole);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setRole('admin')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          role === 'admin'
            ? 'bg-purple-600 text-white'
            : 'bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700'
        }`}
      >
        👨‍💼 Admin
      </button>
      <button
        onClick={() => setRole('gestor')}
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
