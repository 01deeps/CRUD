// src/routes/eventRoutes.ts
import { Router } from 'express';
import EventController from '../controllers/EventController';

// Create a new router instance
const router = Router();

// Define the route for creating a new event
router.post('/events', EventController.createEvent);

// Define the route for fetching all events
router.get('/events', EventController.getEvents);

// Define the route for updating an event by its ID
router.put('/events/:id', EventController.updateEvent);

// Define the route for deleting an event by its ID
router.delete('/events/:id', EventController.deleteEvent);

// Export the router to be used in the main application
export default router;
