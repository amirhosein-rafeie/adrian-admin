import { BankAccount, Order, Project, Token, Transaction } from '@/types/models';

export const db: {
  projects: Project[];
  tokens: Token[];
  transactions: Transaction[];
  banks: BankAccount[];
  orders: Order[];
} = {
  projects: [
    { id: 1, title: 'Indigo Launch', description: 'Main fundraising project', status: 'active', created_at: '2026-01-03' },
    { id: 2, title: 'Green Energy', description: 'Renewable grid expansion', status: 'inactive', created_at: '2026-01-12' }
  ],
  tokens: [
    { id: 1, token_name: 'INDX', projectId: 1, amount: 12000, price_per_token: 15, status: 'active', created_at: '2026-01-14' },
    { id: 2, token_name: 'GREX', projectId: 2, amount: 8400, price_per_token: 9.5, status: 'inactive', created_at: '2026-01-20' }
  ],
  transactions: [
    { id: 1, user: 'Ariana P.', tokenId: 1, amount: 1200, status: 'pending', created_at: '2026-02-01' },
    { id: 2, user: 'Kian R.', tokenId: 2, amount: 300, status: 'success', created_at: '2026-02-04' }
  ],
  banks: [
    { id: 1, bank_name: 'Melli', account_number: '0102345678', iban: 'IR220170000000123456789001', owner_name: 'Adrian Co', created_at: '2026-01-01' },
    { id: 2, bank_name: 'Saman', account_number: '0235641239', iban: 'IR380560000000223344556677', owner_name: 'Adrian Co', created_at: '2026-01-18' }
  ],
  orders: [
    { id: 1, user: 'Nima S.', projectId: 1, quantity: 130, total_price: 1950, status: 'processing', created_at: '2026-02-02' },
    { id: 2, user: 'Mina A.', projectId: 2, quantity: 80, total_price: 760, status: 'completed', created_at: '2026-02-05' }
  ]
};
