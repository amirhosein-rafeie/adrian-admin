import { createMockService } from './mockApi';
import { db } from './mockDb';

export const projectService = createMockService(db.projects);
export const tokenService = createMockService(db.tokens);
export const transactionService = createMockService(db.transactions);
export const bankService = createMockService(db.banks);
export const orderService = createMockService(db.orders);
