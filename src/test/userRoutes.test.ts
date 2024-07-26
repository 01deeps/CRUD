import request from 'supertest';
import { createExpressServer } from 'routing-controllers';
import { UserController } from '../controllers/UserController';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// jest.setup.ts
import 'reflect-metadata';



// Load environment variables from a .env file
dotenv.config();

// Create a custom express server instance
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
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    const userData = { username: 'testuser', password: 'password', role: 'user' };
    const expectedResponse = { id: 1, ...userData };
    
    (register as jest.Mock).mockResolvedValue(expectedResponse);

    const response = await request(app)
      .post('/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should login a user', async () => {
    const loginData = { username: 'testuser', password: 'password' };
    const expectedResponse = { token: 'mock-token' };
    
    (login as jest.Mock).mockResolvedValue(expectedResponse);

    const response = await request(app)
      .post('/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });
});
