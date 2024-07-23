// src/services/EventService.ts
import { Request, Response } from 'express';
import Event from '../models/Event';
import logger from '../config/logger';

class EventService {
  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { event_name, date, description } = req.body;
      const event = await Event.create({ event_name, date, description });
      logger.info('Event created successfully', { event });
      res.status(201).json(event);
    } catch (error) {
      logger.error('Error creating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.findAll();
      logger.info('Fetched all events', { events });
      res.status(200).json(events);
    } catch (error) {
      logger.error('Error fetching events', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { event_name, date, description } = req.body;
      const event = await Event.findByPk(id);
      if (event) {
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();
        logger.info('Event updated successfully', { event });
        res.status(200).json(event);
      } else {
        logger.warn('Event not found', { id });
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      logger.error('Error updating event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      if (event) {
        await event.destroy();
        logger.info('Event deleted successfully', { id });
        res.status(200).json({ message: 'Event deleted' });
      } else {
        logger.warn('Event not found', { id });
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      logger.error('Error deleting event', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new EventService();
