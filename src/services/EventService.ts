import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Event from '../models/Event';
import logger from '../config/logger';

class EventService {
  private verifyToken(req: Request): any {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const decoded = this.verifyToken(req);
      const { event_name, date, description } = req.body;
      const event = await Event.create({ event_name, date, description, userId: decoded.id });

      res.status(201).json(event);
      logger.info(`Event created successfully by user: ${decoded.id}`, { event });
    } catch (error: any) {
      logger.error('Error creating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.findAll();
      logger.info('Fetched all events', { events });
      res.status(200).json(events);
    } catch (error: any) {
      logger.error('Error fetching events', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const decoded = this.verifyToken(req);
      const { id } = req.params;
      const { event_name, date, description } = req.body;
      const event = await Event.findByPk(id);

      if (event && (event.userId === decoded.id || decoded.role === 'admin')) {
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();

        logger.info('Event updated successfully', { event });
        res.status(200).json(event);
      } else {
        logger.warn('Event not found or unauthorized access', { id });
        res.status(404).json({ error: 'Event not found or unauthorized access' });
      }
    } catch (error: any) {
      logger.error('Error updating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const decoded = this.verifyToken(req);
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (event && (event.userId === decoded.id || decoded.role === 'admin')) {
        await event.destroy();
        logger.info('Event deleted successfully', { id });
        res.status(200).json({ message: 'Event deleted' });
      } else {
        logger.warn('Event not found or unauthorized access', { id });
        res.status(404).json({ error: 'Event not found or unauthorized access' });
      }
    } catch (error: any) {
      logger.error('Error deleting event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new EventService();
