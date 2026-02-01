const request = require('supertest');
const app = require('../src/app');

describe('Health API', () => {
  it('GET /health returns 200 and OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('OK');
  });
});
