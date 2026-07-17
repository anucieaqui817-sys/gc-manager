// js/app.js
import { db, collection, getDocs, onSnapshot, query, orderBy } from './firebase.js';
import { getCurrentUser, isAuthenticated, logoutUser } from './auth.js';

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

export function initListeners() {
  const productsQuery = query(collection(db, 'products'), orderBy('name'));
  onSnapshot(productsQuery, (snapshot) => {
    AppState.products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('products');
  });

  const clientsQuery = query(collection(db, 'clients'), orderBy('name'));
  onSnapshot(clientsQuery, (snapshot) => {
    AppState.clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('clients');
  });

  const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
  onSnapshot(servicesQuery, (snapshot) => {
    AppState.services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    notifyListeners('services');
  });

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
    window.location.href = '/login.html';
  } else {
    alert('Erro ao sair: ' + result.error);
  }
}

export function initApp() {
  AppState.user = getCurrentUser();
  initListeners();
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

export { AppState };
