// src/__tests__/eventRoutes.test.ts
import request from 'supertest';
import express from 'express';
import eventRoutes from '../routes/eventRoutes';
import EventController from '../controllers/EventController';

// Create an instance of express and apply the routes
const app = express();
app.use(express.json());
app.use('/api', eventRoutes);

// Mock the controller methods
jest.mock('../controllers/EventController');

describe('Event Routes', () => {
  it('should create an event', async () => {
    const mockCreateEvent = EventController.createEvent as jest.Mock;
    mockCreateEvent.mockImplementation((req, res) => {
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
    const mockGetEvents = EventController.getEvents as jest.Mock;
    mockGetEvents.mockImplementation((req, res) => {
      res.status(200).json([{ id: 1, event_name: 'Event 1', description: 'Description 1' }]);
    });

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update an event', async () => {
    const mockUpdateEvent = EventController.updateEvent as jest.Mock;
    mockUpdateEvent.mockImplementation((req, res) => {
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
    const mockDeleteEvent = EventController.deleteEvent as jest.Mock;
    mockDeleteEvent.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Event deleted' });
    });

    const response = await request(app).delete('/api/events/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted');
  });
});
