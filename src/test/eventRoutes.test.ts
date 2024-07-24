import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/eventRoutes';
import EventController from '../controllers/EventController';

const app = express();
app.use(express.json());
app.use('/api', eventRoutes);

jest.mock('../controllers/EventController', () => ({
  __esModule: true,
  default: {
    createEvent: jest.fn(),
    getEvents: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  },
}));

const { createEvent, getEvents, updateEvent, deleteEvent } = EventController;

describe('Event Routes with Mocked Middleware', () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    jest.mock('../middleware/auth', () => ({
      __esModule: true,
      default: {
        authenticateJWT: (req: any, res: any, next: any) => {
          console.log('Mocked authenticateJWT middleware');
          req.user = { id: 1, role: 'user' };
          next();
        },
        authorizeRoles: (...roles: string[]) => (req: any, res: any, next: any) => {
          console.log('Mocked authorizeRoles middleware');
          if (roles.includes(req.user.role)) {
            next();
          } else {
            res.status(403).json({ error: 'Forbidden' });
          }
        },
      },
    }));
  });

  it('should create an event', async () => {
    console.log('Test: Create Event');
    (createEvent as jest.Mock).mockImplementation((req, res) => {
      console.log('Mocked createEvent controller');
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
    console.log('Test: Get All Events');
    (getEvents as jest.Mock).mockImplementation((req, res) => {
      console.log('Mocked getEvents controller');
      res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
    });

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update an event by user who created it', async () => {
    console.log('Test: Update Event');
    (updateEvent as jest.Mock).mockImplementation((req, res) => {
      console.log('Mocked updateEvent controller');
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



  it('should delete an event by admin', async () => {
    console.log('Test: Delete Event by Admin');
    jest.mock('../middleware/auth', () => ({
      __esModule: true,
      default: {
        authenticateJWT: (req: any, res: any, next: any) => {
          console.log('Mocked authenticateJWT middleware');
          req.user = { id: 1, role: 'admin' };
          next();
        },
        authorizeRoles: (...roles: string[]) => (req: any, res: any, next: any) => {
          console.log('Mocked authorizeRoles middleware');
          if (roles.includes(req.user.role)) {
            next();
          } else {
            res.status(403).json({ error: 'Forbidden' });
          }
        },
      },
    }));

    (deleteEvent as jest.Mock).mockImplementation((req, res) => {
      console.log('Mocked deleteEvent controller');
      res.status(200).json({ message: 'Event deleted' });
    });

    const response = await request(app).delete('/api/events/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted');
  });

  
});
