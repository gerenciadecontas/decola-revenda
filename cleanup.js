// Script para limpar todos os dados do localStorage
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

// Limpar chaves específicas
keys.forEach(key => {
  localStorage.removeItem(key);
});

// Limpar chaves dinâmicas
Object.keys(localStorage).forEach(key => {
  if (
    key.startsWith('training-progress-') ||
    key.startsWith('treinamentos-admin-')
  ) {
    localStorage.removeItem(key);
  }
});

console.log('✓ Todos os dados foram removidos!');
