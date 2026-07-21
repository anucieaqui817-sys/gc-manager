// js/empresa.js
import { db, doc, getDoc, updateDoc, serverTimestamp } from './firebase.js';
import { getCurrentUser } from './auth.js';

// Buscar dados da empresa
export async function getEmpresa() {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return data.empresa || null;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return null;
  }
}

// Atualizar dados da empresa
export async function updateEmpresa(empresaData) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: 'Usuário não logado' };

  try {
    const userRef = doc(db, 'usuarios', user.uid);
    await updateDoc(userRef, {
      empresa: empresaData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    return { success: false, error: error.message };
  }
}

// Verificar se empresa está configurada
export async function isEmpresaConfigurada() {
  const user = getCurrentUser();
  if (!user) return false;

  try {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data().configurado || false;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar configuração:', error);
    return false;
  }
}
