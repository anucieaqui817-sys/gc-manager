// js/clients.js
import { db, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase.js';
import { utils } from './app.js';

export async function createClient(clientData) {
  try {
    const id = utils.generateId();
    const clientRef = doc(db, 'clients', id);
    await setDoc(clientRef, {
      ...clientData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id };
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return { success: false, error: error.message };
  }
}

export async function getClients() {
  try {
    const clientsRef = collection(db, 'clients');
    const snapshot = await getDocs(clientsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return [];
  }
}

export async function updateClient(id, clientData) {
  try {
    const clientRef = doc(db, 'clients', id);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteClient(id) {
  try {
    const clientRef = doc(db, 'clients', id);
    await deleteDoc(clientRef);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return { success: false, error: error.message };
  }
}
