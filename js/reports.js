// js/reports.js
import { db, collection, getDocs } from './firebase.js';

export async function getSalesReport(startDate, endDate) {
  try {
    const salesRef = collection(db, 'sales');
    const snapshot = await getDocs(salesRef);
    const sales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filtered = sales.filter(sale => {
      if (!sale.createdAt) return false;
      const saleDate = sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    });
    const total = filtered.reduce((sum, sale) => sum + (sale.total || 0), 0);
    return { sales: filtered, total, count: filtered.length };
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    return null;
  }
}

export async function getServicesReport(startDate, endDate) {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const filtered = services.filter(service => {
      if (!service.createdAt) return false;
      const serviceDate = service.createdAt.toDate ? service.createdAt.toDate() : new Date(service.createdAt);
      return serviceDate >= start && serviceDate <= end;
    });
    const totalValue = filtered.reduce((sum, service) => sum + (service.total || 0), 0);
    return { services: filtered, totalValue, count: filtered.length };
  } catch (error) {
    console.error('Erro ao gerar relatório de serviços:', error);
    return null;
  }
}

export async function getFinancialSummary() {
  try {
    const salesRef = collection(db, 'sales');
    const salesSnapshot = await getDocs(salesRef);
    const sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const totalSales = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    return { totalRevenue: totalSales, totalSales, salesCount: sales.length };
  } catch (error) {
    console.error('Erro ao gerar resumo financeiro:', error);
    return null;
  }
}
