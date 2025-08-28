export type User = { id: string; name: string; token?: string };
export type Account = { id: string; name: string; currency: string; balance: number };
export type Transaction = { id: string; accountId: string; type: 'credit' | 'debit'; amount: number; date: string; description?: string };