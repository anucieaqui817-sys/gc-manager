// js/app.js - VERSÃO SIMPLIFICADA PARA TESTE
import { db, collection, getDocs, onSnapshot, query, orderBy } from './firebase.js';
import { getCurrentUser, isAuthenticated, logoutUser, waitForAuth } from './auth.js';

const AppState = {
  user: null,
  products: [],
  clients: [],
  services: [],
  sales: [],
  settings: {},
  listeners: {}
};

export const utils = {
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  },
  
  formatDate: (date) => {
    if (!date) return '—';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },
  
  formatDateTime: (date) => {
    if (!date) return '—';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  generateCode: (prefix = 'OS') => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = prefix + '-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },
  
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },
  
  onlyNumbers: (value) => {
    return String(value).replace(/\D/g, '');
  }
};

// 🔥 FUNÇÃO DE LOGOUT MELHORADA
export async function handleLogout() {
  console.log('🚪 Tentando fazer logout...');
  try {
    const result = await logoutUser();
    console.log('📡 Resultado do logout:', result);
    if (result.success) {
      console.log('✅ Logout bem-sucedido, redirecionando...');
      window.location.href = 'login.html';
    } else {
      console.error('❌ Erro no logout:', result.error);
      alert('Erro ao sair: ' + result.error);
    }
  } catch (error) {
    console.error('❌ Erro inesperado no logout:', error);
    alert('Erro ao sair: ' + error.message);
  }
}

export async function carregarDados() {
  console.log('🔄 Carregando dados manualmente...');
  // ... resto do código (mantenha o que já tem)
}

export function initListeners() {
  // ... resto do código (mantenha o que já tem)
}

function notifyListeners(type) {
  if (AppState.listeners[type]) {
    AppState.listeners[type].forEach(callback => callback(AppState[type]));
  }
}

export function subscribe(type, callback) {
  if (!AppState.listeners[type]) {
    AppState.listeners[type] = [];
  }
  AppState.listeners[type].push(callback);
  callback(AppState[type]);
}

export function getState(type) {
  return AppState[type] || [];
}

export async function initApp() {
  console.log('🚀 initApp chamado');
  
  const user = await waitForAuth();
  AppState.user = user;
  console.log('✅ Usuário autenticado:', user ? user.email : 'null');
  
  initListeners();
  await carregarDados();
  
  // 🔥 LOGOUT MELHORADO
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    console.log('🔘 Botão de logout encontrado');
    logoutBtn.addEventListener('click', handleLogout);
  } else {
    console.warn('⚠️ Botão de logout não encontrado');
  }
}

export { AppState };
