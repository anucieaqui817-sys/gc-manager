// js/services.js
import { db, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from './firebase.js';
import { utils } from './app.js';

export const SERVICE_STATUS = {
  RECEIVED: 'Recebido',
  IN_ANALYSIS: 'Em Análise',
  WAITING_APPROVAL: 'Aguardando Aprovação',
  APPROVED: 'Aprovado',
  IN_REPAIR: 'Em Reparo',
  WAITING_PART: 'Aguardando Peça',
  COMPLETED: 'Concluído',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
};

export async function createService(serviceData) {
  try {
    const id = utils.generateId();
    const code = serviceData.code || utils.generateCode('OS');
    const serviceRef = doc(db, 'services', id);
    await setDoc(serviceRef, {
      ...serviceData,
      id,
      code,
      status: serviceData.status || SERVICE_STATUS.RECEIVED,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id, code };
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return { success: false, error: error.message };
  }
}

export async function getServices() {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return [];
  }
}

export async function updateService(id, serviceData) {
  try {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      ...serviceData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteService(id) {
  try {
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    return { success: false, error: error.message };
  }
}

export async function updateServiceStatus(id, status) {
  try {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { success: false, error: error.message };
  }
}
