// js/settings.js
import { db, doc, setDoc, getDoc, updateDoc, serverTimestamp } from './firebase.js';

const DEFAULT_SETTINGS = {
  companyName: 'Gestor PRO+',
  companyDocument: '',
  companyPhone: '',
  companyEmail: '',
  companyAddress: '',
  companyLogo: '',
  currency: 'BRL',
  invoiceFooter: 'Obrigado pela preferência!',
  lowStockAlert: 5
};

export async function getSettings() {
  try {
    const settingsRef = doc(db, 'settings', 'company');
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    }
    await setDoc(settingsRef, {
      ...DEFAULT_SETTINGS,
      updatedAt: serverTimestamp()
    });
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSettings(settingsData) {
  try {
    const settingsRef = doc(db, 'settings', 'company');
    
    // Verifica se o documento existe
    const snapshot = await getDoc(settingsRef);
    
    if (snapshot.exists()) {
      // Se existe, atualiza
      await updateDoc(settingsRef, {
        ...settingsData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Se não existe, cria com os dados
      await setDoc(settingsRef, {
        ...DEFAULT_SETTINGS,
        ...settingsData,
        updatedAt: serverTimestamp()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return { success: false, error: error.message };
  }
}
