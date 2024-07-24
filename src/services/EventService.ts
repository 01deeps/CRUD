import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Event from '../models/Event';
import logger from '../config/logger';

class EventService {
  private verifyToken(req: Request): any {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      throw new Error('No token provided');
    }
    console.log('Token provided:', token);
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  public async createEvent(req: Request, res: Response): Promise<void> {
    console.log('createEvent called');
    try {
      const decoded = this.verifyToken(req);
      console.log('Token decoded:', decoded);
      const { event_name, date, description } = req.body;
      console.log('Request body:', req.body);
      const event = await Event.create({ event_name, date, description, userId: decoded.id });
      // const event = await Event.create({ event_name, date, description, userId: decoded.id });
      console.log('Event created:', event);

      res.status(201).json(event);
      logger.info(`Event created successfully by user: ${decoded.id}`, { event });
    } catch (error: any) {
      console.log('Error creating event:', error);
      logger.error('Error creating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    console.log('getEvents called');
    try {
      const events = await Event.findAll();
      console.log('Events fetched:', events);
      logger.info('Fetched all events', { events });
      res.status(200).json(events);
    } catch (error: any) {
      console.log('Error fetching events:', error);
      logger.error('Error fetching events', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updateEvent(req: Request, res: Response): Promise<void> {
    console.log('updateEvent called');
    try {
      const decoded = this.verifyToken(req);
      console.log('Token decoded:', decoded);
      const { id } = req.params;
      const { event_name, date, description } = req.body;
      console.log('Request params:', req.params);
      console.log('Request body:', req.body);
      const event = await Event.findByPk(id);

      if (event && (event.userId === decoded.id || decoded.role === 'admin' || decoded.role === 'user')) {
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();
        console.log('Event updated:', event);

        logger.info('Event updated successfully', { event });
        res.status(200).json(event);
      } else {
        console.log('Event not found or unauthorized access');
        logger.warn('Event not found or unauthorized access', { id });
        res.status(404).json({ error: 'Event not found or unauthorized access' });
      }
    } catch (error: any) {
      console.log('Error updating event:', error);
      logger.error('Error updating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteEvent(req: Request, res: Response): Promise<void> {
    console.log('deleteEvent called');
    try {
      const decoded = this.verifyToken(req);
      console.log('Token decoded:', decoded);
      const { id } = req.params;
      console.log('Request params:', req.params);
      const event = await Event.findByPk(id);

      if (event && (event.userId === decoded.id || decoded.role === 'admin' || decoded.role === 'user')) {
        await event.destroy();
        console.log('Event deleted:', id);
        logger.info('Event deleted successfully', { id });
        res.status(200).json({ message: 'Event deleted' });
      } else {
        console.log('Event not found or unauthorized access');
        logger.warn('Event not found or unauthorized access', { id });
        res.status(404).json({ error: 'Event not found or unauthorized access' });
      }
    } catch (error: any) {
      console.log('Error deleting event:', error);
      logger.error('Error deleting event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new EventService();
