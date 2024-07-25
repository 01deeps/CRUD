import request from 'supertest';
import express from 'express';
import { createExpressServer } from 'routing-controllers';
import { UserController } from '../controllers/UserController';

// Create an instance of express with routing-controllers
const app = createExpressServer({
  controllers: [UserController],
  defaultErrorHandler: false,
});

// Mock UserService methods
jest.mock('../services/UserService', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

const { register, login } = require('../services/UserService').default;

describe('User Routes', () => {
  it('should register a user', async () => {
    (register as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(201).json({ id: 1, ...req.body });
    });

    const response = await request(app)
      .post('/register')
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
    (login as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(200).json({ token: 'mock-token' });
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'mock-token');
  });
});
