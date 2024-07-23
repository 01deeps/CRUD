// src/services/EventService.ts
import { Request, Response } from 'express';
import Event from '../models/Event';
import logger from '../config/logger';

//EventService class to handle CRUD operations for events

class EventService {

  //Create a new event
  public async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { event_name, date, description } = req.body;  // Destructure event details from request body
      const event = await Event.create({ event_name, date, description });  // Create new event
      logger.info('Event created successfully', { event });  // Log success
      res.status(201).json(event);  // Send created event as response
    } catch (error) {
      logger.error('Error creating event', { error });  // Log error
      res.status(500).json({ error: 'Internal Server Error' });  // Send error response
    }
  }

   //Fetch all events 
  public async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await Event.findAll();  // Retrieve all events
      logger.info('Fetched all events', { events });  // Log success
      res.status(200).json(events);  // Send events as response
    } catch (error) {
      logger.error('Error fetching events', { error });  // Log error
      res.status(500).json({ error: 'Internal Server Error' });  // Send error response
    }
  }

   // Update an event by ID
  public async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;  // Extract event ID from request parameters
      const { event_name, date, description } = req.body;  // Extract updated details from request body
      const event = await Event.findByPk(id);  // Find event by ID
      if (event) {
        // Update event details
        event.event_name = event_name;
        event.date = date;
        event.description = description;
        await event.save();  // Save changes to database
        logger.info('Event updated successfully', { event });  // Log success
        res.status(200).json(event);  // Send updated event as response
      } else {
        logger.warn('Event not found', { id });  // Log warning
        res.status(404).json({ error: 'Event not found' });  // Send not found response
      }
    } catch (error) {
      logger.error('Error updating event', { error });  // Log error
      res.status(500).json({ error: 'Internal Server Error' });  // Send error response
    }
  }
 
  //Delete an event by ID
  public async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;  // Extract event ID from request parameters
      const event = await Event.findByPk(id);  // Find event by ID
      if (event) {
        await event.destroy();  // Delete event from database
        logger.info('Event deleted successfully', { id });  // Log success
        res.status(200).json({ message: 'Event deleted' });  // Send success response
      } else {
        logger.warn('Event not found', { id });  // Log warning
        res.status(404).json({ error: 'Event not found' });  // Send not found response
      }
    } catch (error) {
      logger.error('Error deleting event', { error });  // Log error
      res.status(500).json({ error: 'Internal Server Error' });  // Send error response
    }
  }
}
// Export a new instance of EventService
export default new EventService();
