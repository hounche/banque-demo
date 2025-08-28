const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let user = { id: 'u1', name: 'Marie', token: 'mock-token' };
let accounts = [ { id: 'a1', name: 'Compte courant', currency: 'EUR', balance: 2450.5 }, { id: 'a2', name: 'Épargne', currency: 'EUR', balance: 10250.0 } ];
let transactions = [ { id: uuidv4(), accountId: 'a1', type: 'debit', amount: 120.5, date: new Date().toISOString(), description: 'Courses' }, { id: uuidv4(), accountId: 'a1', type: 'credit', amount: 1500, date: new Date(Date.now() - 86400000).toISOString(), description: 'Salaire' }, { id: uuidv4(), accountId: 'a2', type: 'credit', amount: 50, date: new Date(Date.now() - 2*86400000).toISOString(), description: 'Virement vers épargne' } ];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) return res.json(user);
  return res.status(400).send('Identifiants invalides');
});

app.get('/accounts', (req, res) => res.json(accounts));

app.get('/accounts/:id/transactions', (req, res) => {
  const id = req.params.id;
  const tx = transactions.filter(t => t.accountId === id).sort((a,b) => new Date(b.date) - new Date(a.date));
  res.json(tx);
});

app.post('/transfer', (req, res) => {
  const { fromId, toId, amount, description } = req.body;
  const amt = Number(amount);
  if (!fromId || !toId || !(amt > 0)) return res.status(400).send('Données invalides');
  if (fromId === toId) return res.status(400).send('Comptes identiques');
  const from = accounts.find(a => a.id === fromId);
  const to = accounts.find(a => a.id === toId);
  if (!from || !to) return res.status(404).send('Compte introuvable');
  if (from.balance < amt) return res.status(400).send('Fonds insuffisants');

  from.balance -= amt;
  to.balance += amt;

  const txnOut = { id: uuidv4(), accountId: fromId, type: 'debit', amount: amt, date: new Date().toISOString(), description: description || `Virement vers ${to.name}` };
  const txnIn = { id: uuidv4(), accountId: toId, type: 'credit', amount: amt, date: new Date().toISOString(), description: description || `Virement depuis ${from.name}` };
  transactions.unshift(txnIn, txnOut);

  res.json({ from, to });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log('Server listening on', port));
}

module.exports = app;