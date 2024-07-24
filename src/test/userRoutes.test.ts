// src/__tests__/userRoutes.test.ts
import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import UserService from '../services/UserService';

// Create an instance of express and apply the routes
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api', userRoutes); // Apply user routes to the /api path

// Mock the service methods
jest.mock('../services/UserService');

describe('User Routes', () => {
  it('should register a user', async () => {
    const mockRegister = UserService.register as jest.Mock;
    mockRegister.mockImplementation((req, res) => {
      res.status(201).json({ id: 1, ...req.body });
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'password',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should login a user', async () => {
    const mockLogin = UserService.login as jest.Mock;
    mockLogin.mockImplementation((req, res) => {
      res.status(200).json({ token: 'mock-token' });
    });

    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'mock-token');
  });
});
