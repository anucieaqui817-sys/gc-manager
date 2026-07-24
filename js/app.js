// js/app.js
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

// 🔥 FUNÇÃO PARA CARREGAR DADOS MANUALMENTE
export async function carregarDados() {
  console.log('🔄 Carregando dados manualmente...');
  
  try {
    // Produtos
    const productsRef = collection(db, 'products');
    const productsSnap = await getDocs(productsRef);
    AppState.products = productsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('products');
    console.log('✅ Produtos carregados:', AppState.products.length);

    // Clientes
    const clientsRef = collection(db, 'clients');
    const clientsSnap = await getDocs(clientsRef);
    AppState.clients = clientsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('clients');

    // Serviços
    const servicesRef = collection(db, 'services');
    const servicesSnap = await getDocs(servicesRef);
    AppState.services = servicesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('services');

    // Vendas
    const salesRef = collection(db, 'sales');
    const salesSnap = await getDocs(salesRef);
    AppState.sales = salesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('sales');

    console.log('✅ Todos os dados carregados!');
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
  }
}

export function initListeners() {
  console.log('🔥 initListeners chamado');
  
  // Produtos
  const productsQuery = query(collection(db, 'products'), orderBy('name'));
  onSnapshot(productsQuery, (snapshot) => {
    console.log('📦 Snapshot de products recebido:', snapshot.docs.length);
    AppState.products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('products');
  }, (error) => {
    console.error('❌ Erro no snapshot de products:', error);
  });

  // Clientes
  const clientsQuery = query(collection(db, 'clients'), orderBy('name'));
  onSnapshot(clientsQuery, (snapshot) => {
    AppState.clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('clients');
  });

  // Serviços
  const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
  onSnapshot(servicesQuery, (snapshot) => {
    AppState.services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('services');
  });

  // Vendas
  const salesQuery = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
  onSnapshot(salesQuery, (snapshot) => {
    AppState.sales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('sales');
  });
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

export async function handleLogout() {
  const result = await logoutUser();
  if (result.success) {
    window.location.href = 'login.html';
  } else {
    alert('Erro ao sair: ' + result.error);
  }
}

export async function initApp() {
  console.log('🚀 initApp chamado');
  
  // Aguarda a autenticação ficar pronta
  const user = await waitForAuth();
  AppState.user = user;
  console.log('✅ Usuário autenticado:', user ? user.email : 'null');
  
  // Inicia os listeners
  initListeners();
  
  // Carrega dados manualmente como fallback
  await carregarDados();
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

export { AppState };
