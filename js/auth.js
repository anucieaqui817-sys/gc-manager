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

export function initAuth(redirectPath = '/dashboard.html') {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      if (window.location.pathname.includes('login.html')) {
        window.location.href = redirectPath;
      }
    } else {
      currentUser = null;
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html';
      }
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
