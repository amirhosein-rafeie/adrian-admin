export type Status = 'active' | 'inactive';
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type OrderStatus = 'processing' | 'completed' | 'rejected';

export interface Project {
  id: number;
  title: string;
  description: string;
  status: Status;
  created_at: string;
}

export interface Token {
  id: number;
  token_name: string;
  projectId: number;
  amount: number;
  price_per_token: number;
  status: Status;
  created_at: string;
}

export interface Transaction {
  id: number;
  user: string;
  token: string;
  amount: number;
  status: TransactionStatus;
  created_at: string;
}

export interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  iban: string;
  owner_name: string;
  created_at: string;
}

export interface Order {
  id: number;
  user: string;
  project: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}
