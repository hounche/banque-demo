import { Account, Transaction, User } from '../types';

// Change this baseURL for devices/emulators: use 10.0.2.2 for Android emulator
const baseURL = 'http://localhost:3000';

async function request(path: string, opts: any = {}) {
  const res = await fetch(baseURL + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<User> {
  return request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export async function getAccounts(): Promise<Account[]> {
  return request('/accounts');
}
export async function getTransactions(accountId: string): Promise<Transaction[]> {
  return request(`/accounts/${accountId}/transactions`);
}
export async function transfer(fromId: string, toId: string, amount: number, description?: string) {
  return request('/transfer', { method: 'POST', body: JSON.stringify({ fromId, toId, amount, description }) });
}