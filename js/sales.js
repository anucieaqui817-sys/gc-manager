// js/sales.js
import { db, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase.js';
import { utils } from './app.js';

export async function createSale(saleData) {
  try {
    const id = utils.generateId();
    const saleRef = doc(db, 'sales', id);
    await setDoc(saleRef, {
      ...saleData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id };
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    return { success: false, error: error.message };
  }
}

export async function getSales() {
  try {
    const salesRef = collection(db, 'sales');
    const snapshot = await getDocs(salesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
}

export async function deleteSale(id) {
  try {
    const saleRef = doc(db, 'sales', id);
    await deleteDoc(saleRef);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    return { success: false, error: error.message };
  }
}
