// js/auth.js
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from './firebase.js';

let currentUser = null;
let authInitialized = false;
let authListeners = [];

export function initAuth(redirectPath = 'dashboard.html') {
  console.log('🔥 initAuth chamado');
  
  onAuthStateChanged(auth, (user) => {
    console.log('📡 onAuthStateChanged:', user ? user.email : 'null');
    currentUser = user;
    authInitialized = true;
    
    // Notifica todos os listeners
    authListeners.forEach(cb => cb(user));
    
    if (user) {
      if (window.location.pathname.includes('login.html')) {
        window.location.href = redirectPath;
      }
    } else {
      if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
      }
    }
  });
}

// Função para aguardar a autenticação ficar pronta
export function waitForAuth() {
  return new Promise((resolve) => {
    if (authInitialized) {
      resolve(currentUser);
    } else {
      authListeners.push(resolve);
    }
  });
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function getCurrentUser() {
  return currentUser;
}

export function isAuthenticated() {
  return currentUser !== null;
}
