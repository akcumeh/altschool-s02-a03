const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return JWT token', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');

      const user = await User.findOne({ username: 'testuser' });
      expect(user).toBeTruthy();
      expect(user.username).toBe('testuser');
    });

    it('should not register user with duplicate username', async () => {
      await User.create({
        username: 'testuser',
        password: 'password123'
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username already exists');
    });

    it('should not register user with short username', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'ab',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username must be at least 3 characters');
    });

    it('should not register user with short password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: '12345'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password must be at least 6 characters');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        password: 'password123'
      });
    });

    it('should login with valid credentials and return JWT token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');

      // Verify JWT token works by accessing protected route
      const token = response.body.token;
      const todosResponse = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(todosResponse.status).toBe(200);
      expect(todosResponse.body.success).toBe(true);
    });

    it('should not login with invalid username', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'wronguser',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
