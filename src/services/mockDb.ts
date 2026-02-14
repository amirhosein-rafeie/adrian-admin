import { BankAccount, Order, Project, Token, Transaction } from './types';

export const db = {
  projects: [
    { id: 1, title: 'Atlas', description: 'Main launch project', status: 'active', created_at: '2026-01-15' },
    { id: 2, title: 'Nova', description: 'Expansion project', status: 'inactive', created_at: '2026-01-20' }
  ] as Project[],
  tokens: [
    { id: 1, token_name: 'ATL-01', projectId: 1, amount: 5000, price_per_token: 2.5, status: 'active', created_at: '2026-01-16' },
    { id: 2, token_name: 'NVA-01', projectId: 2, amount: 2500, price_per_token: 1.75, status: 'inactive', created_at: '2026-01-21' }
  ] as Token[],
  transactions: [
    { id: 1, user: 'Ali Reza', token: 'ATL-01', amount: 1200, status: 'pending', created_at: '2026-01-22' },
    { id: 2, user: 'Sara M', token: 'NVA-01', amount: 300, status: 'success', created_at: '2026-01-23' }
  ] as Transaction[],
  banks: [
    { id: 1, bank_name: 'Mellat', account_number: '123456789', iban: 'IR820540102680020817909002', owner_name: 'Adrian LLC', created_at: '2026-01-10' },
    { id: 2, bank_name: 'Tejarat', account_number: '987654321', iban: 'IR640170000000001234567890', owner_name: 'Adrian LLC', created_at: '2026-01-11' }
  ] as BankAccount[],
  orders: [
    { id: 1, user: 'Nima', project: 'Atlas', quantity: 10, total_price: 25, status: 'processing', created_at: '2026-01-30' },
    { id: 2, user: 'Elham', project: 'Nova', quantity: 100, total_price: 175, status: 'completed', created_at: '2026-01-31' }
  ] as Order[]
};
