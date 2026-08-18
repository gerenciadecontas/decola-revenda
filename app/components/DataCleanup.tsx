'use client';

import { useEffect } from 'react';

export function DataCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const keys = [
      'agenda-list',
      'alertas-list',
      'pendencias-list',
      'implantacoes-list',
      'revendas-list',
      'platformRole',
      'trainingRole',
      'gestor-list',
      'agentes-list',
      'historico-list',
      'configuracoes-list',
      'relatorios-list',
      'servicos-list',
      'treinamentos-list',
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
    });

    Object.keys(localStorage).forEach(key => {
      if (
        key.startsWith('training-progress-') ||
        key.startsWith('treinamentos-admin-')
      ) {
        localStorage.removeItem(key);
      }
    });

    console.log('✓ Cleanup: Todos os dados foram removidos!');
  }, []);

  return null;
}
