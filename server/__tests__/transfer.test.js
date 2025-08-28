const request = require('supertest');
const app = require('../index');

describe('Transfer API', () => {
  it('should perform a valid transfer', async () => {
    const accountsRes = await request(app).get('/accounts');
    expect(accountsRes.status).toBe(200);
    const [a1, a2] = accountsRes.body;
    const res = await request(app).post('/transfer').send({ fromId: a1.id, toId: a2.id, amount: 10 });
    expect(res.status).toBe(200);
    expect(res.body.from.balance).toBeCloseTo(a1.balance - 10, 2);
    expect(res.body.to.balance).toBeCloseTo(a2.balance + 10, 2);
  });

  it('should reject insufficient funds', async () => {
    const accountsRes = await request(app).get('/accounts');
    const [a1, a2] = accountsRes.body;
    const res = await request(app).post('/transfer').send({ fromId: a1.id, toId: a2.id, amount: 9999999 });
    expect(res.status).toBe(400);
  });
});
