import request from 'supertest';
import { createExpressServer } from 'routing-controllers';
import { EventController } from '../controllers/EventController';
import authMiddleware from '../middleware/auth';

// Create a custom express server instance
const app = createExpressServer({
  controllers: [EventController],
  middlewares: [authMiddleware.authenticateJWT, authMiddleware.authorizeRoles('user', 'admin')],
  defaultErrorHandler: false,
});

// Mock EventController methods
jest.mock('../controllers/EventController', () => ({
  __esModule: true,
  default: {
    createEvent: jest.fn(),
    getEvents: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  },
}));

const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/EventController').default;

describe('Event Routes with Mocked Middleware', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should create an event', async () => {
    (createEvent as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(201).json({ id: 1, ...req.body });
    });

    const response = await request(app)
      .post('/events')
      .send({
        event_name: 'New Event',
        date: new Date(),
        description: 'New Event Description',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('event_name', 'New Event');
    expect(response.body).toHaveProperty('description', 'New Event Description');
  });

  it('should get all events', async () => {
    (getEvents as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
    });

    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update an event', async () => {
    (updateEvent as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(200).json({ id: req.params.id, ...req.body });
    });

    const response = await request(app)
      .put('/events/1')
      .send({
        event_name: 'Updated Event',
        date: new Date(),
        description: 'Updated Description',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '1');
    expect(response.body).toHaveProperty('event_name', 'Updated Event');
    expect(response.body).toHaveProperty('description', 'Updated Description');
  });

  it('should delete an event', async () => {
    (deleteEvent as jest.Mock).mockImplementation((req: any, res: any) => {
      res.status(200).json({ message: 'Event deleted' });
    });

    const response = await request(app).delete('/events/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted');
  });
});
