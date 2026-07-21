// js/admin.js
import { db, collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { atualizarPlano } from './plano.js';

// Verificar se usuário é admin
export function isAdmin() {
  const user = getCurrentUser();
  if (!user) return false;
  return user.email === 'gc_saas@gmail.com';
}

// Listar todos os usuários
export async function listarUsuarios() {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const snapshot = await getDocs(usuariosRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return [];
  }
}

// Desativar/Ativar usuário
export async function toggleUsuario(userId, ativo) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      ativo: ativo,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Renovar plano de usuário
export async function renovarPlano(userId, plano, dias) {
  return await atualizarPlano(userId, plano, dias);
}

// Estatísticas do sistema
export async function getAdminStats() {
  try {
    const usuarios = await listarUsuarios();
    const total = usuarios.length;
    const ativos = usuarios.filter(u => u.ativo !== false).length;
    const testes = usuarios.filter(u => u.plano === 'teste' && u.ativo !== false).length;
    const pagos = usuarios.filter(u => u.plano !== 'teste' && u.ativo !== false).length;
    
    return {
      total,
      ativos,
      testes,
      pagos
    };
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return { total: 0, ativos: 0, testes: 0, pagos: 0 };
  }
}
