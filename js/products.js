// js/products.js
import { db, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase.js';
import { utils } from './app.js';

export async function createProduct(productData) {
  try {
    const id = utils.generateId();
    const productRef = doc(db, 'products', id);
    await setDoc(productRef, {
      ...productData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id };
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function updateProduct(id, productData) {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id) {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return { success: false, error: error.message };
  }
}
