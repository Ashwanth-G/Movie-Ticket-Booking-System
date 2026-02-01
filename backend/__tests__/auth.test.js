const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

const TEST_MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking-test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({ email: /^test-/ });
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const unique = Date.now();
  const user = {
    email: `test-${unique}@example.com`,
    password: 'password123',
    name: 'Test User',
  };

  it('POST /api/auth/register creates user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.user.name).toBe(user.name);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('POST /api/auth/login returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(user.email);
  });

  it('POST /api/auth/login returns 401 for invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: 'wrong',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register returns 400 for duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
