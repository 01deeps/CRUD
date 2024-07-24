import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import eventRoutes from '../routes/eventRoutes';
import EventController from '../controllers/EventController';
import authMiddleware from '../middleware/auth';


// Create an instance of express and apply the routes
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api', eventRoutes); // Apply event routes to the /api path

// Mock middleware with console logs
jest.mock('../middleware/auth', () => ({
  __esModule: true,
  authenticateJWT: (req: Request, res: Response, next: NextFunction) => {
    console.log('authenticateJWT called');
    next();
  },
  authorizeRoles: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    console.log(`authorizeRoles called with roles: ${roles}`);
    next();
  },
}));

// Mock EventController methods
jest.mock('../controllers/EventController', () => ({
  __esModule: true,
  default: {
    createEvent: jest.fn(),
    getEvents: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn()
  }
}));

describe('Event Routes', () => {
  const mockCreateEvent = EventController.createEvent as jest.Mock;
  const mockGetEvents = EventController.getEvents as jest.Mock;
  const mockUpdateEvent = EventController.updateEvent as jest.Mock;
  const mockDeleteEvent = EventController.deleteEvent as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an event', async () => {
    mockCreateEvent.mockImplementation((req: Request, res: Response) => {
      res.status(201).json({ id: 1, ...req.body });
    });

    const response = await request(app)
      .post('/api/events')
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
    mockGetEvents.mockImplementation((req: Request, res: Response) => {
      res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
    });

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update an event', async () => {
    mockUpdateEvent.mockImplementation((req: Request, res: Response) => {
      res.status(200).json({ id: req.params.id, ...req.body });
    });

    const response = await request(app)
      .put('/api/events/1')
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
    mockDeleteEvent.mockImplementation((req: Request, res: Response) => {
      res.status(200).json({ message: 'Event deleted' });
    });

    const response = await request(app).delete('/api/events/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted');
  });

  // Test cases for unauthorized access
  it('should return 401 for create event without auth', async () => {
    // Mock middleware to simulate authentication failure
    jest.mock('../middleware/auth', () => ({
      __esModule: true,
      authenticateJWT: (req: Request, res: Response, next: NextFunction) => {
        console.log('authenticateJWT called - unauthorized');
        res.status(401).json({ error: 'Unauthorized' });
      },
      authorizeRoles: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => next(),
    }));

    const response = await request(app)
      .post('/api/events')
      .send({
        event_name: 'New Event',
        date: new Date(),
        description: 'New Event Description',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  it('should return 403 for unauthorized role', async () => {
    // Mock middleware to simulate role-based access control failure
    jest.mock('../middleware/auth', () => ({
      __esModule: true,
      authenticateJWT: (req: Request, res: Response, next: NextFunction) => next(),
      authorizeRoles: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
        console.log(`authorizeRoles called with roles: ${roles} - forbidden`);
        res.status(403).json({ error: 'Forbidden' });
      },
    }));

    const response = await request(app).delete('/api/events/1');

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Forbidden');
  });
});
