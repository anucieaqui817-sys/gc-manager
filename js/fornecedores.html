// js/fornecedores.js
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase.js';

// Criar fornecedor
export async function criarFornecedor(data) {
  try {
    const ref = doc(collection(db, 'fornecedores'));
    await setDoc(ref, {
      ...data,
      credito: 0,
      compras: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: ref.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Listar fornecedores
export async function listarFornecedores() {
  try {
    const ref = collection(db, 'fornecedores');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    return [];
  }
}

// Registrar compra
export async function registrarCompra(fornecedorId, compra) {
  try {
    const ref = doc(db, 'fornecedores', fornecedorId);
    const fornecedor = await getDoc(ref);
    if (!fornecedor.exists()) {
      return { success: false, error: 'Fornecedor não encontrado' };
    }
    const data = fornecedor.data();
    const compras = data.compras || [];
    compras.push({
      ...compra,
      data: new Date().toISOString()
    });
    await updateDoc(ref, {
      compras: compras,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Registrar devolução
export async function registrarDevolucao(fornecedorId, devolucao) {
  try {
    const ref = doc(db, 'fornecedores', fornecedorId);
    const fornecedor = await getDoc(ref);
    if (!fornecedor.exists()) {
      return { success: false, error: 'Fornecedor não encontrado' };
    }
    const data = fornecedor.data();
    const compras = data.compras || [];
    compras.push({
      tipo: 'devolucao',
      ...devolucao,
      data: new Date().toISOString()
    });
    await updateDoc(ref, {
      compras: compras,
      credito: (data.credito || 0) + (devolucao.credito || 0),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Excluir fornecedor
export async function excluirFornecedor(fornecedorId) {
  try {
    const ref = doc(db, 'fornecedores', fornecedorId);
    await deleteDoc(ref);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
