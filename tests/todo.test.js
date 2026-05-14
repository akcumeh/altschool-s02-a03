const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let testUser;
let testToken;
let agent;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
  await mongoose.connection.close();
});

describe('Todo Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      username: 'todouser',
      password: hashedPassword
    });

    testToken = jwt.sign(
      { userId: testUser._id, username: testUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    agent = request.agent(app);
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.title).toBe('Test Todo');

      const todo = await Todo.findOne({ title: 'Test Todo' });
      expect(todo).toBeTruthy();
      expect(todo.description).toBe('Test Description');
      expect(todo.status).toBe('pending');
    });

    it('should not create todo without title', async () => {
      const response = await agent
        .post('/todos')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          description: 'Test Description'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title is required');
    });

    it('should not create todo without authentication', async () => {
      const response = await agent
        .post('/todos')
        .set('Accept', 'application/json')
        .send({
          title: 'Test Todo'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /todos/:id', () => {
    let testTodo;

    beforeEach(async () => {
      testTodo = await Todo.create({
        title: 'Test Todo',
        userId: testUser._id,
        status: 'pending'
      });
    });

    it('should update todo status to completed', async () => {
      const response = await agent
        .patch(`/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedTodo = await Todo.findById(testTodo._id);
      expect(updatedTodo.status).toBe('completed');
    });

    it('should not update todo of another user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const otherUser = await User.create({
        username: 'otheruser',
        password: hashedPassword
      });

      const otherToken = jwt.sign(
        { userId: otherUser._id, username: otherUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await agent
        .patch(`/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    let testTodo;

    beforeEach(async () => {
      testTodo = await Todo.create({
        title: 'Test Todo',
        userId: testUser._id,
        status: 'pending'
      });
    });

    it('should soft delete todo', async () => {
      const response = await agent
        .delete(`/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedTodo = await Todo.findById(testTodo._id);
      expect(deletedTodo.status).toBe('deleted');
    });

    it('should not delete todo of another user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const otherUser = await User.create({
        username: 'otheruser',
        password: hashedPassword
      });

      const otherToken = jwt.sign(
        { userId: otherUser._id, username: otherUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await agent
        .delete(`/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(404);
    });
  });
});
