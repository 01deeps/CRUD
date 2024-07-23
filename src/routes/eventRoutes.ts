// src/routes/eventRoutes.ts
import { Router } from 'express';
import EventController from '../controllers/EventController';

const router = Router();

router.post('/events', EventController.createEvent);
router.get('/events', EventController.getEvents);
router.put('/events/:id', EventController.updateEvent);
router.delete('/events/:id', EventController.deleteEvent);

export default router;
