// js/plano.js
import { db, doc, getDoc, setDoc, updateDoc, serverTimestamp } from './firebase.js';
import { getCurrentUser } from './auth.js';

// Verificar plano do usuário
export async function verificarPlano() {
  const user = getCurrentUser();
  if (!user) {
    return { status: 'nao_logado' };
  }

  try {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      await criarUsuarioTeste(user.uid, user.email);
      return { status: 'ativo', plano: 'teste', diasRestantes: 15 };
    }

    const data = snapshot.data();
    const hoje = new Date();
    const dataFim = data.dataFim ? new Date(data.dataFim) : null;

    if (dataFim && hoje > dataFim && data.plano !== 'vitalicio') {
      return { 
        status: 'expirado', 
        plano: data.plano,
        diasRestantes: 0
      };
    }

    let diasRestantes = 0;
    if (dataFim && data.plano !== 'vitalicio') {
      const diff = dataFim - hoje;
      diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
    } else if (data.plano === 'vitalicio') {
      diasRestantes = '♾️';
    }

    return {
      status: 'ativo',
      plano: data.plano || 'teste',
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      diasRestantes: diasRestantes,
      isVitalicio: data.plano === 'vitalicio',
      empresa: data.empresa || null,
      role: data.role || 'user'
    };
  } catch (error) {
    console.error('Erro ao verificar plano:', error);
    return { status: 'erro', error: error.message };
  }
}

// Atualizar plano do usuário
export async function atualizarPlano(userId, novoPlano, dias) {
  try {
    const hoje = new Date();
    const dataFim = new Date(hoje);
    dataFim.setDate(dataFim.getDate() + dias);

    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      plano: novoPlano,
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      ativo: true,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar plano:', error);
    return { success: false, error: error.message };
  }
}

// Criar usuário com teste grátis
export async function criarUsuarioTeste(userId, email) {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const hoje = new Date();
    const dataFim = new Date(hoje);
    dataFim.setDate(dataFim.getDate() + 15);

    await setDoc(userRef, {
      email: email,
      plano: 'teste',
      dataInicio: hoje.toISOString(),
      dataFim: dataFim.toISOString(),
      ativo: true,
      role: 'user',
      createdAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar usuário teste:', error);
    return { success: false, error: error.message };
  }
}

// Verificar se usuário tem acesso
export async function temAcesso() {
  const info = await verificarPlano();
  return info.status === 'ativo';
}

// Formatar dias restantes
export function formatarDiasRestantes(dias) {
  if (dias === '♾️') return '♾️ Vitalício';
  if (dias === 0) return '⚠️ Expirado';
  if (dias === 1) return '1 dia';
  return `${dias} dias`;
}
