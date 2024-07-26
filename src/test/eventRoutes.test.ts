import request from 'supertest';
import { createExpressServer } from 'routing-controllers';
import { EventController } from '../controllers/EventController';
import authMiddleware from '../middleware/auth';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

// Setting the secret for testing
process.env.JWT_SECRET = 'your-secret-key';

const generateToken = (role: string, userId?: number) => {
  return jwt.sign({ role, userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

const adminToken = generateToken('admin');
const userToken = generateToken('user', 1);

const app = createExpressServer({
  controllers: [EventController],
  middlewares: [authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin')],
  defaultErrorHandler: false,
});

// Mock EventService methods
jest.mock('../services/EventService', () => ({
  __esModule: true,
  default: {
    createEvent: jest.fn(),
    getEvents: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  },
}));

const { createEvent, getEvents, updateEvent, deleteEvent } = require('../services/EventService').default;

describe('Event Routes with Role-Based Access', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const testCRUDOperations = (token: string, role: string, isAdmin: boolean) => {
    const eventData = {
      event_name: 'New Event',
      date: new Date().toISOString(),
      description: 'New Event Description',
    };

    const updatedEventData = {
      event_name: 'Updated Event',
      date: new Date().toISOString(),
      description: 'Updated Description',
    };

    const expectedResponse = {
      id: 1,
      event_name: updatedEventData.event_name,
      date: updatedEventData.date,
      description: updatedEventData.description,
    };

    it(`should allow ${role} to create an event`, async () => {
      createEvent.mockResolvedValue({ id: 1, ...eventData });

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${token}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...eventData });
    });

    it(`should allow ${role} to update an event`, async () => {
      updateEvent.mockResolvedValue(expectedResponse);

      const response = await request(app)
        .put('/events/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedEventData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it(`should allow ${role} to delete an event`, async () => {
      deleteEvent.mockResolvedValue({ message: 'Event deleted' });

      const response = await request(app)
        .delete('/events/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Event deleted' });
    });
  };

  testCRUDOperations(adminToken, 'admin', true);
  testCRUDOperations(userToken, 'user', false);
});
