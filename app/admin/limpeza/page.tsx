'use client';

import { useState } from 'react';

export default function LimpezaDadosPage() {
  const [cleaned, setCleaned] = useState(false);

  const handleLimpeza = () => {
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
      'treinamentos-admin-*',
      'training-progress-*',
    ];

    // Limpar chaves específicas
    keys.forEach(key => {
      if (key.includes('*')) {
        // Para chaves dinâmicas, limpar todas que começam com o prefixo
        const prefix = key.replace('-*', '');
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith(prefix)) {
            localStorage.removeItem(k);
          }
        });
      } else {
        localStorage.removeItem(key);
      }
    });

    // Limpar tudo que começa com 'training-progress-'
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('training-progress-') || key.startsWith('treinamentos-admin-')) {
        localStorage.removeItem(key);
      }
    });

    setCleaned(true);
    setTimeout(() => setCleaned(false), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0E1013',
      color: '#E8EAED',
      padding: '40px 20px',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#16181D',
        border: '1px solid #23262C',
        borderRadius: '12px',
        padding: '40px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '16px',
          color: '#fff',
        }}>
          🗑️ Limpeza de Dados
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#8A9099',
          marginBottom: '24px',
          lineHeight: 1.6,
        }}>
          Esta ação irá remover TODOS os dados cadastrados na plataforma:
        </p>

        <ul style={{
          fontSize: '14px',
          color: '#9AA1AA',
          marginBottom: '24px',
          paddingLeft: '20px',
          lineHeight: 1.8,
        }}>
          <li>✓ Pendências</li>
          <li>✓ Implantações</li>
          <li>✓ Agenda/Compromissos</li>
          <li>✓ Alertas</li>
          <li>✓ Revendas</li>
          <li>✓ Treinamentos</li>
          <li>✓ Progresso de Treinamentos</li>
          <li>✓ Agentes</li>
          <li>✓ Histórico</li>
          <li>✓ Configurações</li>
        </ul>

        {cleaned && (
          <div style={{
            background: '#34D39920',
            border: '1px solid #34D399',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: '#34D399',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            ✓ Todos os dados foram removidos com sucesso!
          </div>
        )}

        <button
          onClick={handleLimpeza}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: '#EF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#DC2626';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#EF4444';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Limpar Todos os Dados
        </button>

        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          marginTop: '16px',
          textAlign: 'center',
        }}>
          ⚠️ Esta ação não pode ser desfeita
        </p>
      </div>
    </div>
  );
}
